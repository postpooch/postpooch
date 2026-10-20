import type { QueryResult, QueryResultRow } from "pg";

import { getDbPool } from "@/lib/db/client";
import type {
  ContactInput,
  DealInput,
  DealStageInput,
  NoteInput,
  PartnerInput,
  PropertyInput,
  RelationshipInput,
  RelationshipTypeInput,
  StageInput,
  TagInput,
  TaskInput,
  TransactionInput,
} from "@/lib/crm/input";
import { CRM_DEFAULT_DEAL_STAGES, CRM_DEAL_CLIENT_TYPES } from "@/lib/crm/constants";

type DealClientType = (typeof CRM_DEAL_CLIENT_TYPES)[number];

type Db = {
  query<R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>>;
};
type ListOptions = { page: number; pageSize: number; offset: number; q?: string | null; filters?: Record<string, string | null> };

export class CrmAccessError extends Error {
  constructor(message = "CRM record not found.") {
    super(message);
    this.name = "CrmAccessError";
  }
}

export class CrmValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CrmValidationError";
  }
}

export class CrmConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CrmConflictError";
  }
}

function pgError(error: unknown): never {
  const code = (error as { code?: unknown })?.code;
  if (code === "23505") throw new CrmConflictError("A CRM record with that unique value already exists.");
  if (code === "23503" || code === "23514" || code === "22P02") {
    throw new CrmValidationError("The CRM record references invalid or unavailable data.");
  }
  throw error;
}

const CONTACT_COLUMNS = `
  c.id,
  c.first_name as "firstName",
  c.last_name as "lastName",
  c.email,
  c.phone,
  c.contact_types as "contactTypes",
  c.lead_status as "leadStatus",
  c.lead_source as "leadSource",
  c.priority,
  c.price_min::float8 as "priceMin",
  c.price_max::float8 as "priceMax",
  c.preferred_locations as "preferredLocations",
  c.preapproved,
  c.last_contacted_at::text as "lastContactedAt",
  c.next_follow_up_at::text as "nextFollowUpAt",
  c.notes,
  c.created_at::text as "createdAt",
  c.updated_at::text as "updatedAt",
  (
    select jsonb_build_object(
      'id', s.id,
      'profileId', s.profile_id,
      'name', s.name,
      'color', s.color,
      'position', s.position,
      'isClosed', s.is_closed,
      'isWon', s.is_won
    )
    from public.crm_contact_stages s
    where s.id = c.stage_id
      and (s.profile_id is null or s.profile_id = c.profile_id)
  ) as stage,
  coalesce((
    select jsonb_agg(jsonb_build_object('id', tag.id, 'name', tag.name, 'color', tag.color) order by tag.name)
    from public.crm_contact_tags ct
    join public.crm_tags tag on tag.id = ct.tag_id and tag.profile_id = c.profile_id
    where ct.contact_id = c.id and ct.profile_id = c.profile_id
  ), '[]'::jsonb) as tags,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'relatedContactId', other.id,
        'relatedContactName', nullif(concat_ws(' ', other.first_name, nullif(other.last_name, '')), ''),
        'relationshipTypeId', rt.id,
        'label', case
          when r.person_1_id = c.id then coalesce(rt.type_2, rt.type_1)
          else rt.type_1
        end,
        'type1', rt.type_1,
        'type2', rt.type_2,
        'isPerson1', (r.person_1_id = c.id)
      )
      order by
        case when r.person_1_id = c.id then coalesce(rt.type_2, rt.type_1) else rt.type_1 end,
        other.first_name,
        other.last_name
    )
    from public.crm_contacts_relationships r
    join public.crm_contacts_relationships_types rt
      on rt.id = r.crm_contacts_relationship_type_id
     and (rt.profile_id is null or rt.profile_id = c.profile_id)
    join public.crm_contacts other
      on other.id = case when r.person_1_id = c.id then r.person_2_id else r.person_1_id end
     and other.profile_id = c.profile_id
    where r.person_1_id = c.id or r.person_2_id = c.id
  ), '[]'::jsonb) as relationships
`;

const PROPERTY_COLUMNS = `
  p.id,
  p.address_line1 as "addressLine1",
  p.address_line2 as "addressLine2",
  p.city,
  p.state,
  p.postal_code as "postalCode",
  p.country,
  p.property_type as "propertyType",
  p.listing_status as "listingStatus",
  p.mls_number as "mlsNumber",
  p.listing_price::float8 as "listingPrice",
  p.bedrooms::float8 as bedrooms,
  p.bathrooms::float8 as bathrooms,
  p.square_feet as "squareFeet",
  p.notes,
  p.created_at::text as "createdAt",
  p.updated_at::text as "updatedAt"
`;

const TRANSACTION_COLUMNS = `
  t.id,
  t.title,
  t.contact_id as "contactId",
  nullif(concat_ws(' ', c.first_name, nullif(c.last_name, '')), '') as "contactName",
  t.property_id as "propertyId",
  nullif(concat_ws(', ', p.address_line1, p.city, p.state), '') as "propertyAddress",
  t.partner_id as "partnerId",
  t.side,
  t.status,
  t.estimated_value::float8 as "estimatedValue",
  t.offer_amount::float8 as "offerAmount",
  t.expected_closing_date::text as "expectedClosingDate",
  t.actual_closing_date::text as "actualClosingDate",
  t.estimated_commission::float8 as "estimatedCommission",
  t.actual_commission::float8 as "actualCommission",
  t.lead_source as "leadSource",
  t.description,
  t.position,
  t.created_at::text as "createdAt",
  t.updated_at::text as "updatedAt"
`;

const TASK_COLUMNS = `
  task.id,
  task.contact_id as "contactId",
  nullif(concat_ws(' ', c.first_name, nullif(c.last_name, '')), '') as "contactName",
  task.property_id as "propertyId",
  task.transaction_id as "transactionId",
  t.title as "transactionTitle",
  task.title,
  task.task_type as "taskType",
  task.priority,
  task.due_at::text as "dueAt",
  task.completed_at::text as "completedAt",
  task.details,
  task.created_at::text as "createdAt",
  task.updated_at::text as "updatedAt"
`;

function updateSql(
  table: string,
  alias: string,
  id: string,
  profileId: string,
  changes: Record<string, unknown>,
  columns: Record<string, string>,
  returning: string,
) {
  const entries = Object.entries(changes).filter(([key]) => columns[key]);
  if (!entries.length) return null;
  const values = entries.map(([, value]) => value);
  const assignments = entries.map(([key], index) => `${columns[key]} = $${index + 1}`).join(", ");
  values.push(id, profileId);
  return {
    text: `update public.${table} ${alias} set ${assignments} where ${alias}.id = $${values.length - 1} and ${alias}.profile_id = $${values.length} returning ${returning}`,
    values,
  };
}

function rowsWithoutTotal(rows: QueryResultRow[]) {
  return rows.map((row) => {
    const { totalCount, ...record } = row;
    void totalCount;
    return record;
  });
}

export class CrmRepository {
  readonly profileId: string;
  private readonly db: Db;

  constructor(profileId: string, db: Db = getDbPool()) {
    this.profileId = profileId;
    this.db = db;
  }

  private async owned(table: string, id: string, db: Db = this.db) {
    const result = await db.query(
      `select id from public.${table} where id = $1 and profile_id = $2 limit 1`,
      [id, this.profileId],
    );
    return Boolean(result.rows[0]);
  }

  private async requireOwned(table: string, id: string | null | undefined, db: Db = this.db) {
    if (id && !(await this.owned(table, id, db))) throw new CrmAccessError("Related CRM record not found.");
  }

  private async activity(
    db: Db,
    activityType: string,
    summary: string,
    relations: { contactId?: string | null; propertyId?: string | null; transactionId?: string | null; taskId?: string | null } = {},
  ) {
    await db.query(
      `insert into public.crm_activities
        (profile_id, activity_type, summary, contact_id, property_id, transaction_id, task_id)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [this.profileId, activityType, summary, relations.contactId ?? null, relations.propertyId ?? null, relations.transactionId ?? null, relations.taskId ?? null],
    );
  }

  private async requireAccessibleStage(stageId: string | null | undefined, db: Db = this.db) {
    if (stageId == null) return;
    const result = await db.query(
      `select id from public.crm_contact_stages
       where id = $1 and (profile_id is null or profile_id = $2)
       limit 1`,
      [stageId, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Related CRM record not found.");
  }

  private stageColumns(alias = "s") {
    return `${alias}.id, ${alias}.profile_id as "profileId", ${alias}.name, ${alias}.color, ${alias}.position, ${alias}.is_closed as "isClosed", ${alias}.is_won as "isWon"`;
  }

  async listContacts(options: ListOptions) {
    const values: unknown[] = [this.profileId];
    const where = ["c.profile_id = $1"];
    if (options.q) {
      values.push(`%${options.q}%`);
      where.push(`concat_ws(' ', c.first_name, c.last_name, c.email, c.phone) ilike $${values.length}`);
    }
    const filters = options.filters ?? {};
    if (filters.status) { values.push(filters.status); where.push(`c.lead_status = $${values.length}`); }
    if (filters.priority) { values.push(filters.priority); where.push(`c.priority = $${values.length}`); }
    if (filters.stageId) { values.push(filters.stageId); where.push(`c.stage_id = $${values.length}`); }
    if (filters.type) { values.push(filters.type); where.push(`$${values.length} = any(c.contact_types)`); }
    if (filters.source) { values.push(filters.source); where.push(`c.lead_source = $${values.length}`); }
    if (filters.tagId) {
      values.push(filters.tagId);
      where.push(`exists (select 1 from public.crm_contact_tags fct where fct.profile_id = c.profile_id and fct.contact_id = c.id and fct.tag_id = $${values.length})`);
    }
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select ${CONTACT_COLUMNS}, count(*) over()::int as "totalCount"
       from public.crm_contacts c
       where ${where.join(" and ")}
       order by c.updated_at desc, c.id
       limit $${values.length - 1} offset $${values.length}`,
      values,
    );
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getContact(id: string, db: Db = this.db) {
    const result = await db.query(`select ${CONTACT_COLUMNS} from public.crm_contacts c where c.id = $1 and c.profile_id = $2 limit 1`, [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Contact not found.");
    return result.rows[0];
  }

  private async setContactTags(db: Db, contactId: string, tagIds: string[]) {
    if (tagIds.length) {
      const owned = await db.query<{ id: string }>(
        "select id from public.crm_tags where profile_id = $1 and id = any($2::uuid[])",
        [this.profileId, tagIds],
      );
      if (owned.rowCount !== new Set(tagIds).size) throw new CrmAccessError("One or more tags were not found.");
    }
    await db.query("delete from public.crm_contact_tags where profile_id = $1 and contact_id = $2", [this.profileId, contactId]);
    if (tagIds.length) {
      await db.query(
        `insert into public.crm_contact_tags (profile_id, contact_id, tag_id)
         select $1, $2, tag_id from unnest($3::uuid[]) tag_id`,
        [this.profileId, contactId, [...new Set(tagIds)]],
      );
    }
  }

  async createContact(input: ContactInput) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      await this.requireAccessibleStage(input.stageId, client);
      const result = await client.query<{ id: string }>(
        `insert into public.crm_contacts
          (profile_id, first_name, last_name, email, phone, contact_types, lead_status, lead_source, priority,
           price_min, price_max, preferred_locations, preapproved, last_contacted_at, next_follow_up_at, notes, stage_id)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         returning id`,
        [this.profileId, input.firstName, input.lastName, input.email ?? null, input.phone ?? null, input.contactTypes,
          input.leadStatus, input.leadSource ?? null, input.priority, input.priceMin ?? null, input.priceMax ?? null,
          input.preferredLocations, input.preapproved, input.lastContactedAt ?? null, input.nextFollowUpAt ?? null, input.notes ?? null,
          input.stageId ?? null],
      );
      const id = result.rows[0]!.id;
      await this.setContactTags(client, id, input.tagIds);
      await this.activity(client, "contact_created", `Added ${input.firstName} ${input.lastName}`.trim(), { contactId: id });
      await client.query("commit");
      return await this.getContact(id);
    } catch (error) {
      await client.query("rollback");
      pgError(error);
    } finally {
      client.release();
    }
  }

  async updateContact(id: string, input: Partial<ContactInput>) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const previous = await this.getContact(id, client) as { stage: { id: string } | null };
      await this.requireAccessibleStage(input.stageId, client);
      const { tagIds, ...changes } = input;
      const query = updateSql("crm_contacts", "c", id, this.profileId, changes, {
        firstName: "first_name", lastName: "last_name", email: "email", phone: "phone", contactTypes: "contact_types",
        leadStatus: "lead_status", leadSource: "lead_source", priority: "priority", priceMin: "price_min", priceMax: "price_max",
        preferredLocations: "preferred_locations", preapproved: "preapproved", lastContactedAt: "last_contacted_at",
        nextFollowUpAt: "next_follow_up_at", notes: "notes", stageId: "stage_id",
      }, "c.id");
      if (query) await client.query(query.text, query.values);
      if (tagIds) await this.setContactTags(client, id, tagIds);
      const stageChanged = input.stageId !== undefined && (input.stageId ?? null) !== (previous.stage?.id ?? null);
      await this.activity(
        client,
        stageChanged ? "stage_changed" : "contact_updated",
        stageChanged ? "Moved a contact to a new stage" : "Updated a contact",
        { contactId: id },
      );
      await client.query("commit");
      return await this.getContact(id);
    } catch (error) {
      await client.query("rollback");
      pgError(error);
    } finally { client.release(); }
  }

  async deleteContact(id: string) {
    const result = await this.db.query("delete from public.crm_contacts where id = $1 and profile_id = $2 returning id", [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Contact not found.");
  }

  private relationshipTypeColumns(alias = "rt") {
    return `${alias}.id, ${alias}.profile_id as "profileId", ${alias}.type_1 as "type1", ${alias}.type_2 as "type2"`;
  }

  private async requireAccessibleRelationshipType(typeId: string, db: Db = this.db) {
    const result = await db.query(
      `select id, type_1 as "type1", type_2 as "type2"
       from public.crm_contacts_relationships_types
       where id = $1 and (profile_id is null or profile_id = $2)
       limit 1`,
      [typeId, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Relationship type not found.");
    return result.rows[0] as { id: string; type1: string; type2: string | null };
  }

  async listRelationshipTypes() {
    const result = await this.db.query(
      `select ${this.relationshipTypeColumns()}
       from public.crm_contacts_relationships_types rt
       where rt.profile_id is null or rt.profile_id = $1
       order by rt.profile_id nulls first, lower(rt.type_1), lower(coalesce(rt.type_2, '')), rt.id`,
      [this.profileId],
    );
    return result.rows;
  }

  async createRelationshipType(input: RelationshipTypeInput) {
    try {
      const type2 = input.type2?.trim() || null;
      const clash = await this.db.query(
        `select id from public.crm_contacts_relationships_types
         where lower(type_1) = lower($1)
           and lower(coalesce(type_2, '')) = lower(coalesce($2, ''))
           and (profile_id is null or profile_id = $3)
         limit 1`,
        [input.type1, type2, this.profileId],
      );
      if (clash.rows[0]) throw new CrmConflictError("A CRM record with that unique value already exists.");
      const result = await this.db.query(
        `insert into public.crm_contacts_relationships_types (profile_id, type_1, type_2)
         values ($1, $2, $3)
         returning id, profile_id as "profileId", type_1 as "type1", type_2 as "type2"`,
        [this.profileId, input.type1, type2],
      );
      return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async updateRelationshipType(id: string, input: Partial<RelationshipTypeInput>) {
    try {
      if (input.type1 != null || input.type2 !== undefined) {
        const current = await this.db.query<{ type1: string; type2: string | null }>(
          `select type_1 as "type1", type_2 as "type2"
           from public.crm_contacts_relationships_types
           where id = $1 and profile_id = $2`,
          [id, this.profileId],
        );
        if (!current.rows[0]) throw new CrmAccessError("Relationship type not found.");
        const type1 = input.type1 ?? current.rows[0].type1;
        const type2 = input.type2 !== undefined ? (input.type2?.trim() || null) : current.rows[0].type2;
        if (type2 && type2.toLowerCase() === type1.toLowerCase()) {
          throw new CrmValidationError("The two relationship labels must be different.");
        }
        const clash = await this.db.query(
          `select id from public.crm_contacts_relationships_types
           where id <> $1
             and lower(type_1) = lower($2)
             and lower(coalesce(type_2, '')) = lower(coalesce($3, ''))
             and (profile_id is null or profile_id = $4)
           limit 1`,
          [id, type1, type2, this.profileId],
        );
        if (clash.rows[0]) throw new CrmConflictError("A CRM record with that unique value already exists.");
      }

      const query = updateSql(
        "crm_contacts_relationships_types",
        "rt",
        id,
        this.profileId,
        {
          ...(input.type1 !== undefined ? { type1: input.type1 } : {}),
          ...(input.type2 !== undefined ? { type2: input.type2?.trim() || null } : {}),
        },
        { type1: "type_1", type2: "type_2" },
        this.relationshipTypeColumns("rt"),
      );
      if (!query) {
        const result = await this.db.query(
          `select ${this.relationshipTypeColumns()} from public.crm_contacts_relationships_types rt where rt.id=$1 and rt.profile_id=$2`,
          [id, this.profileId],
        );
        if (!result.rows[0]) throw new CrmAccessError("Relationship type not found.");
        return result.rows[0];
      }
      const result = await this.db.query(query.text, query.values);
      if (!result.rows[0]) throw new CrmAccessError("Relationship type not found.");
      return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async deleteRelationshipType(id: string) {
    try {
      const result = await this.db.query(
        "delete from public.crm_contacts_relationships_types where id=$1 and profile_id=$2 returning id",
        [id, this.profileId],
      );
      if (!result.rows[0]) throw new CrmAccessError("Relationship type not found.");
    } catch (error) { pgError(error); }
  }

  async createRelationship(input: RelationshipInput) {
    try {
      await this.requireOwned("crm_contacts", input.contactId);
      await this.requireOwned("crm_contacts", input.relatedContactId);
      const type = await this.requireAccessibleRelationshipType(input.relationshipTypeId);

      if (input.relatedAs === "type2" && !type.type2) {
        throw new CrmValidationError("This relationship type is symmetric; use relatedAs \"type1\".");
      }

      const person1Id = input.relatedAs === "type2" ? input.contactId : input.relatedContactId;
      const person2Id = input.relatedAs === "type2" ? input.relatedContactId : input.contactId;

      const result = await this.db.query<{ id: string }>(
        `insert into public.crm_contacts_relationships
          (person_1_id, person_2_id, crm_contacts_relationship_type_id)
         values ($1, $2, $3)
         returning id`,
        [person1Id, person2Id, input.relationshipTypeId],
      );
      return this.getRelationshipForContact(result.rows[0]!.id, input.contactId);
    } catch (error) { pgError(error); }
  }

  private async getRelationshipForContact(relationshipId: string, contactId: string) {
    const result = await this.db.query(
      `select
         r.id,
         other.id as "relatedContactId",
         nullif(concat_ws(' ', other.first_name, nullif(other.last_name, '')), '') as "relatedContactName",
         rt.id as "relationshipTypeId",
         case when r.person_1_id = $2 then coalesce(rt.type_2, rt.type_1) else rt.type_1 end as label,
         rt.type_1 as "type1",
         rt.type_2 as "type2",
         (r.person_1_id = $2) as "isPerson1"
       from public.crm_contacts_relationships r
       join public.crm_contacts_relationships_types rt on rt.id = r.crm_contacts_relationship_type_id
       join public.crm_contacts self on self.id = $2 and self.profile_id = $3
       join public.crm_contacts other
         on other.id = case when r.person_1_id = $2 then r.person_2_id else r.person_1_id end
        and other.profile_id = $3
       where r.id = $1
         and (r.person_1_id = $2 or r.person_2_id = $2)
       limit 1`,
      [relationshipId, contactId, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Relationship not found.");
    return result.rows[0];
  }

  async deleteRelationship(id: string) {
    const result = await this.db.query(
      `delete from public.crm_contacts_relationships r
       where r.id = $1
         and exists (
           select 1 from public.crm_contacts p1
           where p1.id = r.person_1_id and p1.profile_id = $2
         )
         and exists (
           select 1 from public.crm_contacts p2
           where p2.id = r.person_2_id and p2.profile_id = $2
         )
       returning r.id`,
      [id, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Relationship not found.");
  }

  async listProperties(options: ListOptions) {
    const values: unknown[] = [this.profileId];
    const where = ["p.profile_id = $1"];
    if (options.q) { values.push(`%${options.q}%`); where.push(`concat_ws(' ', p.address_line1, p.city, p.state, p.postal_code, p.mls_number) ilike $${values.length}`); }
    if (options.filters?.status) { values.push(options.filters.status); where.push(`p.listing_status = $${values.length}`); }
    if (options.filters?.type) { values.push(options.filters.type); where.push(`p.property_type = $${values.length}`); }
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select ${PROPERTY_COLUMNS}, count(*) over()::int as "totalCount" from public.crm_properties p
       where ${where.join(" and ")} order by p.updated_at desc, p.id limit $${values.length - 1} offset $${values.length}`,
      values,
    );
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getProperty(id: string, db: Db = this.db) {
    const result = await db.query(`select ${PROPERTY_COLUMNS} from public.crm_properties p where p.id = $1 and p.profile_id = $2 limit 1`, [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Property not found.");
    return result.rows[0];
  }

  async createProperty(input: PropertyInput) {
    try {
      const result = await this.db.query<{ id: string }>(
        `insert into public.crm_properties
          (profile_id,address_line1,address_line2,city,state,postal_code,country,property_type,listing_status,mls_number,listing_price,bedrooms,bathrooms,square_feet,notes)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) returning id`,
        [this.profileId, input.addressLine1, input.addressLine2 ?? null, input.city, input.state, input.postalCode, input.country,
          input.propertyType, input.listingStatus, input.mlsNumber ?? null, input.listingPrice ?? null, input.bedrooms ?? null,
          input.bathrooms ?? null, input.squareFeet ?? null, input.notes ?? null],
      );
      const id = result.rows[0]!.id;
      await this.activity(this.db, "property_created", `Added ${input.addressLine1}`, { propertyId: id });
      return this.getProperty(id);
    } catch (error) { pgError(error); }
  }

  async updateProperty(id: string, input: Partial<PropertyInput>) {
    await this.getProperty(id);
    try {
      const query = updateSql("crm_properties", "p", id, this.profileId, input, {
        addressLine1: "address_line1", addressLine2: "address_line2", city: "city", state: "state", postalCode: "postal_code",
        country: "country", propertyType: "property_type", listingStatus: "listing_status", mlsNumber: "mls_number",
        listingPrice: "listing_price", bedrooms: "bedrooms", bathrooms: "bathrooms", squareFeet: "square_feet", notes: "notes",
      }, "p.id");
      if (query) await this.db.query(query.text, query.values);
      await this.activity(this.db, "property_updated", "Updated a property", { propertyId: id });
      return this.getProperty(id);
    } catch (error) { pgError(error); }
  }

  async deleteProperty(id: string) {
    try {
      const result = await this.db.query("delete from public.crm_properties where id = $1 and profile_id = $2 returning id", [id, this.profileId]);
      if (!result.rows[0]) throw new CrmAccessError("Property not found.");
    } catch (error) { pgError(error); }
  }

  async listStages() {
    const result = await this.db.query(
      `select ${this.stageColumns()}
       from public.crm_contact_stages s
       where s.profile_id is null or s.profile_id = $1
       order by s.position, s.profile_id nulls first, s.id`,
      [this.profileId],
    );
    return result.rows;
  }

  async createStage(input: StageInput) {
    try {
      const clash = await this.db.query(
        `select id from public.crm_contact_stages
         where name = $1 and (profile_id is null or profile_id = $2)
         limit 1`,
        [input.name, this.profileId],
      );
      if (clash.rows[0]) throw new CrmConflictError("A CRM record with that unique value already exists.");

      let position = input.position;
      if (position == null || Number.isNaN(position)) {
        const max = await this.db.query<{ next: number }>(
          `select coalesce(max(position), -1) + 1 as next
           from public.crm_contact_stages
           where profile_id is null or profile_id = $1`,
          [this.profileId],
        );
        position = Number(max.rows[0]?.next ?? 0);
      }

      const result = await this.db.query(
        `insert into public.crm_contact_stages (profile_id,name,color,position,is_closed,is_won)
         values ($1,$2,$3,$4,$5,$6)
         returning id, profile_id as "profileId", name, color, position, is_closed as "isClosed", is_won as "isWon"`,
        [this.profileId, input.name, input.color, position, input.isClosed, input.isWon],
      );
      return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async updateStage(id: string, input: Partial<StageInput>) {
    try {
      if (input.name) {
        const clash = await this.db.query(
          `select id from public.crm_contact_stages
           where name = $1 and id <> $2 and (profile_id is null or profile_id = $3)
           limit 1`,
          [input.name, id, this.profileId],
        );
        if (clash.rows[0]) throw new CrmConflictError("A CRM record with that unique value already exists.");
      }

      const query = updateSql("crm_contact_stages", "s", id, this.profileId, input, {
        name: "name", color: "color", position: "position", isClosed: "is_closed", isWon: "is_won",
      }, this.stageColumns("s"));
      if (!query) {
        const result = await this.db.query(
          `select ${this.stageColumns()} from public.crm_contact_stages s where s.id=$1 and s.profile_id=$2`,
          [id, this.profileId],
        );
        if (!result.rows[0]) throw new CrmAccessError("Contact stage not found.");
        return result.rows[0];
      }
      const result = await this.db.query(query.text, query.values);
      if (!result.rows[0]) throw new CrmAccessError("Contact stage not found.");
      return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async deleteStage(id: string) {
    try {
      const result = await this.db.query(
        "delete from public.crm_contact_stages where id=$1 and profile_id=$2 returning id",
        [id, this.profileId],
      );
      if (!result.rows[0]) throw new CrmAccessError("Contact stage not found.");
    } catch (error) { pgError(error); }
  }

  async listTransactions(options: ListOptions) {
    const values: unknown[] = [this.profileId];
    const where = ["t.profile_id = $1"];
    if (options.q) { values.push(`%${options.q}%`); where.push(`concat_ws(' ', t.title, c.first_name, c.last_name, p.address_line1) ilike $${values.length}`); }
    for (const [key, column] of Object.entries({ status: "t.status", side: "t.side", contactId: "t.contact_id", propertyId: "t.property_id" })) {
      const value = options.filters?.[key];
      if (value) { values.push(value); where.push(`${column} = $${values.length}`); }
    }
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select ${TRANSACTION_COLUMNS}, count(*) over()::int as "totalCount"
       from public.crm_transactions t
       left join public.crm_contacts c on c.id=t.contact_id and c.profile_id=t.profile_id
       left join public.crm_properties p on p.id=t.property_id and p.profile_id=t.profile_id
       where ${where.join(" and ")}
       order by t.updated_at desc, t.id
       limit $${values.length - 1} offset $${values.length}`,
      values,
    );
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getTransaction(id: string, db: Db = this.db) {
    const result = await db.query(
      `select ${TRANSACTION_COLUMNS} from public.crm_transactions t
       left join public.crm_contacts c on c.id=t.contact_id and c.profile_id=t.profile_id
       left join public.crm_properties p on p.id=t.property_id and p.profile_id=t.profile_id
       where t.id=$1 and t.profile_id=$2 limit 1`,
      [id, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Transaction not found.");
    return result.rows[0];
  }

  private async validateTransactionRelations(input: Partial<TransactionInput>, db: Db = this.db) {
    await Promise.all([
      this.requireOwned("crm_contacts", input.contactId, db),
      this.requireOwned("crm_properties", input.propertyId, db),
      this.requireOwned("crm_partners", input.partnerId, db),
    ]);
  }

  async createTransaction(input: TransactionInput) {
    await this.validateTransactionRelations(input);
    try {
      const result = await this.db.query<{ id: string }>(
        `insert into public.crm_transactions
          (profile_id,title,contact_id,property_id,partner_id,side,status,estimated_value,offer_amount,expected_closing_date,
           actual_closing_date,estimated_commission,actual_commission,lead_source,description,position)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning id`,
        [this.profileId, input.title, input.contactId ?? null, input.propertyId ?? null, input.partnerId ?? null,
          input.side, input.status, input.estimatedValue ?? null, input.offerAmount ?? null, input.expectedClosingDate ?? null,
          input.actualClosingDate ?? null, input.estimatedCommission ?? null, input.actualCommission ?? null, input.leadSource ?? null,
          input.description ?? null, input.position],
      );
      const id = result.rows[0]!.id;
      await this.activity(this.db, "transaction_created", `Started ${input.title}`, { transactionId: id, contactId: input.contactId });
      return this.getTransaction(id);
    } catch (error) { pgError(error); }
  }

  async updateTransaction(id: string, input: Partial<TransactionInput>) {
    await this.getTransaction(id);
    await this.validateTransactionRelations(input);
    try {
      const query = updateSql("crm_transactions", "t", id, this.profileId, input, {
        title: "title", contactId: "contact_id", propertyId: "property_id", partnerId: "partner_id",
        side: "side", status: "status", estimatedValue: "estimated_value", offerAmount: "offer_amount",
        expectedClosingDate: "expected_closing_date", actualClosingDate: "actual_closing_date",
        estimatedCommission: "estimated_commission", actualCommission: "actual_commission", leadSource: "lead_source",
        description: "description", position: "position",
      }, "t.id");
      if (query) await this.db.query(query.text, query.values);
      await this.activity(this.db, "transaction_updated", "Updated a transaction", { transactionId: id, contactId: input.contactId });
      return this.getTransaction(id);
    } catch (error) { pgError(error); }
  }

  async deleteTransaction(id: string) {
    const result = await this.db.query("delete from public.crm_transactions where id=$1 and profile_id=$2 returning id", [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Transaction not found.");
  }

  async listTasks(options: ListOptions) {
    const values: unknown[] = [this.profileId];
    const where = ["task.profile_id = $1"];
    if (options.q) { values.push(`%${options.q}%`); where.push(`concat_ws(' ', task.title, task.details, c.first_name, c.last_name) ilike $${values.length}`); }
    const status = options.filters?.status;
    if (status === "open") where.push("task.completed_at is null");
    if (status === "completed") where.push("task.completed_at is not null");
    for (const [key, column] of Object.entries({ priority: "task.priority", type: "task.task_type", contactId: "task.contact_id", transactionId: "task.transaction_id" })) {
      const value = options.filters?.[key];
      if (value) { values.push(value); where.push(`${column} = $${values.length}`); }
    }
    if (options.filters?.due === "upcoming") where.push("task.completed_at is null and task.due_at <= now() + interval '14 days'");
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select ${TASK_COLUMNS}, count(*) over()::int as "totalCount"
       from public.crm_tasks task
       left join public.crm_contacts c on c.id=task.contact_id and c.profile_id=task.profile_id
       left join public.crm_transactions t on t.id=task.transaction_id and t.profile_id=task.profile_id
       where ${where.join(" and ")}
       order by task.completed_at nulls first, task.due_at asc nulls last, task.created_at desc
       limit $${values.length - 1} offset $${values.length}`,
      values,
    );
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getTask(id: string, db: Db = this.db) {
    const result = await db.query(
      `select ${TASK_COLUMNS} from public.crm_tasks task
       left join public.crm_contacts c on c.id=task.contact_id and c.profile_id=task.profile_id
       left join public.crm_transactions t on t.id=task.transaction_id and t.profile_id=task.profile_id
       where task.id=$1 and task.profile_id=$2 limit 1`, [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Task not found.");
    return result.rows[0];
  }

  private async validateTaskRelations(input: Partial<TaskInput>, db: Db = this.db) {
    await Promise.all([
      this.requireOwned("crm_contacts", input.contactId, db),
      this.requireOwned("crm_properties", input.propertyId, db),
      this.requireOwned("crm_transactions", input.transactionId, db),
    ]);
  }

  async createTask(input: TaskInput) {
    await this.validateTaskRelations(input);
    try {
      const result = await this.db.query<{ id: string }>(
        `insert into public.crm_tasks (profile_id,contact_id,property_id,transaction_id,title,task_type,priority,due_at,completed_at,details)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`,
        [this.profileId, input.contactId ?? null, input.propertyId ?? null, input.transactionId ?? null, input.title,
          input.taskType, input.priority, input.dueAt ?? null, input.completedAt ?? null, input.details ?? null],
      );
      const id = result.rows[0]!.id;
      await this.activity(this.db, input.completedAt ? "task_completed" : "task_created", input.title, { taskId: id, contactId: input.contactId, transactionId: input.transactionId });
      return this.getTask(id);
    } catch (error) { pgError(error); }
  }

  async updateTask(id: string, input: Partial<TaskInput>) {
    const previous = await this.getTask(id) as { completedAt: string | null };
    await this.validateTaskRelations(input);
    try {
      const query = updateSql("crm_tasks", "task", id, this.profileId, input, {
        contactId: "contact_id", propertyId: "property_id", transactionId: "transaction_id", title: "title",
        taskType: "task_type", priority: "priority", dueAt: "due_at", completedAt: "completed_at", details: "details",
      }, "task.id");
      if (query) await this.db.query(query.text, query.values);
      if (input.completedAt && !previous.completedAt) await this.activity(this.db, "task_completed", "Completed a task", { taskId: id });
      return this.getTask(id);
    } catch (error) { pgError(error); }
  }

  async deleteTask(id: string) {
    const result = await this.db.query("delete from public.crm_tasks where id=$1 and profile_id=$2 returning id", [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Task not found.");
  }

  async listNotes(options: ListOptions) {
    const values: unknown[] = [this.profileId];
    const where = ["n.profile_id=$1"];
    for (const [key, column] of Object.entries({ contactId: "n.contact_id", propertyId: "n.property_id", transactionId: "n.transaction_id" })) {
      const value = options.filters?.[key]; if (value) { values.push(value); where.push(`${column}=$${values.length}`); }
    }
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select n.id,n.contact_id as "contactId",n.property_id as "propertyId",n.transaction_id as "transactionId",n.body,
              n.created_at::text as "createdAt",n.updated_at::text as "updatedAt",count(*) over()::int as "totalCount"
       from public.crm_notes n where ${where.join(" and ")} order by n.created_at desc
       limit $${values.length - 1} offset $${values.length}`, values);
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getNote(id: string) {
    const result = await this.db.query(
      `select id,contact_id as "contactId",property_id as "propertyId",transaction_id as "transactionId",body,
              created_at::text as "createdAt",updated_at::text as "updatedAt"
       from public.crm_notes where id=$1 and profile_id=$2`, [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Note not found.");
    return result.rows[0];
  }

  private async validateNoteRelations(input: Partial<NoteInput>) {
    await Promise.all([
      this.requireOwned("crm_contacts", input.contactId), this.requireOwned("crm_properties", input.propertyId),
      this.requireOwned("crm_transactions", input.transactionId),
    ]);
  }

  async createNote(input: NoteInput) {
    await this.validateNoteRelations(input);
    try {
      const result = await this.db.query<{ id: string }>(
        `insert into public.crm_notes (profile_id,contact_id,property_id,transaction_id,body) values ($1,$2,$3,$4,$5) returning id`,
        [this.profileId, input.contactId ?? null, input.propertyId ?? null, input.transactionId ?? null, input.body]);
      const id = result.rows[0]!.id;
      await this.activity(this.db, "note_added", "Added a CRM note", { contactId: input.contactId, propertyId: input.propertyId, transactionId: input.transactionId });
      return this.getNote(id);
    } catch (error) { pgError(error); }
  }

  async updateNote(id: string, input: Partial<NoteInput>) {
    await this.getNote(id); await this.validateNoteRelations(input);
    const query = updateSql("crm_notes", "n", id, this.profileId, input, { contactId: "contact_id", propertyId: "property_id", transactionId: "transaction_id", body: "body" }, "n.id");
    if (query) await this.db.query(query.text, query.values);
    return this.getNote(id);
  }

  async deleteNote(id: string) {
    const result = await this.db.query("delete from public.crm_notes where id=$1 and profile_id=$2 returning id", [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Note not found.");
  }

  async listTags() {
    const result = await this.db.query("select id,name,color from public.crm_tags where profile_id=$1 order by name", [this.profileId]);
    return result.rows;
  }

  async createTag(input: TagInput) {
    try {
      const result = await this.db.query("insert into public.crm_tags (profile_id,name,color) values ($1,$2,$3) returning id,name,color", [this.profileId, input.name, input.color]);
      return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async updateTag(id: string, input: Partial<TagInput>) {
    const query = updateSql("crm_tags", "tag", id, this.profileId, input, { name: "name", color: "color" }, "tag.id,tag.name,tag.color");
    if (!query) {
      const result = await this.db.query("select id,name,color from public.crm_tags where id=$1 and profile_id=$2", [id, this.profileId]);
      if (!result.rows[0]) throw new CrmAccessError("Tag not found."); return result.rows[0];
    }
    try {
      const result = await this.db.query(query.text, query.values); if (!result.rows[0]) throw new CrmAccessError("Tag not found."); return result.rows[0];
    } catch (error) { pgError(error); }
  }

  async deleteTag(id: string) {
    const result = await this.db.query("delete from public.crm_tags where id=$1 and profile_id=$2 returning id", [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Tag not found.");
  }

  async listPartners(options: ListOptions) {
    const values: unknown[] = [this.profileId]; const where = ["p.profile_id=$1"];
    if (options.q) { values.push(`%${options.q}%`); where.push(`concat_ws(' ',p.name,p.contact_name,p.email,p.phone) ilike $${values.length}`); }
    if (options.filters?.type) { values.push(options.filters.type); where.push(`p.partner_type=$${values.length}`); }
    values.push(options.pageSize, options.offset);
    const result = await this.db.query(
      `select p.id,p.name,p.partner_type as "partnerType",p.contact_name as "contactName",p.email,p.phone,p.website,p.notes,
              p.created_at::text as "createdAt",p.updated_at::text as "updatedAt",count(*) over()::int as "totalCount"
       from public.crm_partners p where ${where.join(" and ")} order by p.name limit $${values.length - 1} offset $${values.length}`, values);
    return { data: rowsWithoutTotal(result.rows), total: Number(result.rows[0]?.totalCount ?? 0) };
  }

  async getPartner(id: string) {
    const result = await this.db.query(
      `select id,name,partner_type as "partnerType",contact_name as "contactName",email,phone,website,notes,
              created_at::text as "createdAt",updated_at::text as "updatedAt" from public.crm_partners where id=$1 and profile_id=$2`, [id, this.profileId]);
    if (!result.rows[0]) throw new CrmAccessError("Partner not found."); return result.rows[0];
  }

  async createPartner(input: PartnerInput) {
    const result = await this.db.query<{ id: string }>(
      `insert into public.crm_partners (profile_id,name,partner_type,contact_name,email,phone,website,notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
      [this.profileId,input.name,input.partnerType,input.contactName ?? null,input.email ?? null,input.phone ?? null,input.website ?? null,input.notes ?? null]);
    return this.getPartner(result.rows[0]!.id);
  }

  async updatePartner(id: string, input: Partial<PartnerInput>) {
    await this.getPartner(id);
    const query = updateSql("crm_partners", "p", id, this.profileId, input, { name: "name", partnerType: "partner_type", contactName: "contact_name", email: "email", phone: "phone", website: "website", notes: "notes" }, "p.id");
    if (query) await this.db.query(query.text, query.values); return this.getPartner(id);
  }

  async deletePartner(id: string) {
    try {
      const result = await this.db.query("delete from public.crm_partners where id=$1 and profile_id=$2 returning id", [id, this.profileId]);
      if (!result.rows[0]) throw new CrmAccessError("Partner not found.");
    } catch (error) { pgError(error); }
  }

  async listActivities(limit = 20) {
    const result = await this.db.query(
      `select id,activity_type as "activityType",summary,contact_id as "contactId",property_id as "propertyId",
              transaction_id as "transactionId",task_id as "taskId",created_at::text as "createdAt"
       from public.crm_activities where profile_id=$1 order by created_at desc limit $2`, [this.profileId, Math.min(100, Math.max(1, limit))]);
    return result.rows;
  }

  async summary() {
    const [metrics, pipeline, tasks, activities] = await Promise.all([
      this.db.query(
        `select
          (select count(*)::int from public.crm_contacts where profile_id=$1) as contacts,
          (select count(*)::int from public.crm_contacts where profile_id=$1 and priority='hot') as "hotLeads",
          (select count(*)::int from public.crm_properties where profile_id=$1 and listing_status in ('active','coming_soon')) as "activeProperties",
          (select count(*)::int from public.crm_transactions where profile_id=$1 and status='active') as "activeTransactions",
          (select coalesce(sum(estimated_commission),0)::float8 from public.crm_transactions where profile_id=$1 and status='active') as "pipelineCommission",
          (select count(*)::int from public.crm_tasks where profile_id=$1 and completed_at is null and due_at < now()) as "overdueTasks"`, [this.profileId]),
      this.db.query(
        `select s.id,s.name,s.color,s.position,count(c.id)::int as count
         from public.crm_contact_stages s
         left join public.crm_contacts c on c.stage_id=s.id and c.profile_id=$1
         where s.profile_id is null or s.profile_id=$1
         group by s.id
         order by s.position, s.profile_id nulls first, s.id`, [this.profileId]),
      this.db.query(
        `select ${TASK_COLUMNS} from public.crm_tasks task
         left join public.crm_contacts c on c.id=task.contact_id and c.profile_id=task.profile_id
         left join public.crm_transactions t on t.id=task.transaction_id and t.profile_id=task.profile_id
         where task.profile_id=$1 and task.completed_at is null order by task.due_at asc nulls last limit 6`, [this.profileId]),
      this.listActivities(12),
    ]);
    return { metrics: metrics.rows[0], pipeline: pipeline.rows, upcomingTasks: tasks.rows, activities };
  }

  private dealStageColumns(alias = "s") {
    return `${alias}.id, ${alias}.profile_id as "profileId", ${alias}.name, ${alias}.client_type as "clientType", ${alias}.color, ${alias}.position`;
  }

  private dealColumns(alias = "d") {
    return `
      ${alias}.id,
      ${alias}.name,
      ${alias}.price::float8 as price,
      ${alias}.commission::float8 as commission,
      ${alias}.close_date::text as "closeDate",
      ${alias}.earnest_money_due::text as "earnestMoneyDue",
      ${alias}.mutual_acceptance::text as "mutualAcceptance",
      ${alias}.due_diligence::text as "dueDiligence",
      ${alias}.final_walk_through::text as "finalWalkThrough",
      ${alias}.possession::text as "possession",
      ${alias}.property_address as "propertyAddress",
      ${alias}.description,
      ${alias}.client_type as "clientType",
      ${alias}.crm_deal_stage_id as "stageId",
      ${alias}.position,
      ${alias}.created_at::text as "createdAt",
      ${alias}.updated_at::text as "updatedAt",
      (
        select jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'color', s.color,
          'clientType', s.client_type,
          'position', s.position
        )
        from public.crm_deal_stages s
        where s.id = ${alias}.crm_deal_stage_id and s.profile_id = ${alias}.profile_id
      ) as stage,
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'connectionId', link.id,
            'id', c.id,
            'name', nullif(concat_ws(' ', c.first_name, nullif(c.last_name, '')), '')
          )
          order by c.first_name, c.last_name, c.id
        )
        from public.crm_deal_and_contact_connections link
        join public.crm_contacts c on c.id = link.crm_contact_id and c.profile_id = ${alias}.profile_id
        where link.crm_deal_id = ${alias}.id
      ), '[]'::jsonb) as contacts,
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'connectionId', link.id,
            'id', p.id,
            'name', p.name,
            'partnerType', p.partner_type
          )
          order by p.name, p.id
        )
        from public.crm_deal_and_partners_connections link
        join public.crm_partners p on p.id = link.crm_partner_id and p.profile_id = ${alias}.profile_id
        where link.crm_deal_id = ${alias}.id
      ), '[]'::jsonb) as partners
    `;
  }

  async ensureDealStages() {
    for (const clientType of CRM_DEAL_CLIENT_TYPES) {
      const existing = await this.db.query<{ n: number }>(
        `select count(*)::int as n from public.crm_deal_stages where profile_id = $1 and client_type = $2`,
        [this.profileId, clientType],
      );
      if ((existing.rows[0]?.n ?? 0) > 0) continue;
      for (const stage of CRM_DEFAULT_DEAL_STAGES[clientType]) {
        await this.db.query(
          `insert into public.crm_deal_stages (profile_id, name, client_type, color, position)
           values ($1,$2,$3,$4,$5)`,
          [this.profileId, stage.name, clientType, stage.color, stage.position],
        );
      }
    }
  }

  async getDealBoard(clientType: DealClientType) {
    await this.ensureDealStages();
    const stages = await this.db.query(
      `select ${this.dealStageColumns()}
       from public.crm_deal_stages s
       where s.profile_id = $1 and s.client_type = $2
       order by s.position, s.id`,
      [this.profileId, clientType],
    );
    const deals = await this.db.query(
      `select ${this.dealColumns()}
       from public.crm_deals d
       where d.profile_id = $1 and d.client_type = $2
       order by d.position, d.created_at, d.id`,
      [this.profileId, clientType],
    );
    const byStage = new Map<string, typeof deals.rows>();
    for (const deal of deals.rows) {
      const key = String(deal.stageId ?? "");
      const list = byStage.get(key) ?? [];
      list.push(deal);
      byStage.set(key, list);
    }
    return {
      clientType,
      stages: stages.rows.map((stage) => {
        const stageDeals = byStage.get(String(stage.id)) ?? [];
        return {
          ...stage,
          dealCount: stageDeals.length,
          totalPrice: stageDeals.reduce((sum, deal) => sum + (Number(deal.price) || 0), 0),
          deals: stageDeals,
        };
      }),
    };
  }

  private async requireDealStage(stageId: string, clientType?: DealClientType, db: Db = this.db) {
    const result = await db.query(
      `select id, client_type as "clientType"
       from public.crm_deal_stages
       where id = $1 and profile_id = $2
       limit 1`,
      [stageId, this.profileId],
    );
    const stage = result.rows[0] as { id: string; clientType: DealClientType } | undefined;
    if (!stage) throw new CrmAccessError("Deal stage not found.");
    if (clientType && stage.clientType !== clientType) {
      throw new CrmValidationError("Deal stage must match the buyer/seller pipeline.");
    }
    return stage;
  }

  private async setDealContacts(db: Db, dealId: string, contactIds: string[]) {
    const unique = [...new Set(contactIds)];
    if (unique.length) {
      const owned = await db.query(
        `select id from public.crm_contacts where profile_id = $1 and id = any($2::uuid[])`,
        [this.profileId, unique],
      );
      if (owned.rowCount !== unique.length) throw new CrmAccessError("One or more contacts were not found.");
    }
    await db.query("delete from public.crm_deal_and_contact_connections where crm_deal_id = $1", [dealId]);
    if (unique.length) {
      await db.query(
        `insert into public.crm_deal_and_contact_connections (crm_deal_id, crm_contact_id)
         select $1, contact_id from unnest($2::uuid[]) contact_id`,
        [dealId, unique],
      );
    }
  }

  private async setDealPartners(db: Db, dealId: string, partnerIds: string[]) {
    const unique = [...new Set(partnerIds)];
    if (unique.length) {
      const owned = await db.query(
        `select id from public.crm_partners where profile_id = $1 and id = any($2::uuid[])`,
        [this.profileId, unique],
      );
      if (owned.rowCount !== unique.length) throw new CrmAccessError("One or more partners were not found.");
    }
    await db.query("delete from public.crm_deal_and_partners_connections where crm_deal_id = $1", [dealId]);
    if (unique.length) {
      await db.query(
        `insert into public.crm_deal_and_partners_connections (crm_deal_id, crm_partner_id)
         select $1, partner_id from unnest($2::uuid[]) partner_id`,
        [dealId, unique],
      );
    }
  }

  async getDeal(id: string, db: Db = this.db) {
    const result = await db.query(
      `select ${this.dealColumns()} from public.crm_deals d where d.id = $1 and d.profile_id = $2 limit 1`,
      [id, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Deal not found.");
    return result.rows[0];
  }

  async createDeal(input: DealInput) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      await this.requireDealStage(input.stageId, input.clientType, client);
      let position = input.position;
      if (position == null || Number.isNaN(position)) {
        const max = await client.query<{ next: number }>(
          `select coalesce(max(position), -1) + 1 as next
           from public.crm_deals
           where profile_id = $1 and crm_deal_stage_id = $2`,
          [this.profileId, input.stageId],
        );
        position = Number(max.rows[0]?.next ?? 0);
      }
      const result = await client.query<{ id: string }>(
        `insert into public.crm_deals
          (profile_id, name, price, commission, close_date, earnest_money_due, mutual_acceptance,
           due_diligence, final_walk_through, possession, property_address, description,
           client_type, crm_deal_stage_id, position)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         returning id`,
        [
          this.profileId,
          input.name,
          input.price ?? null,
          input.commission ?? null,
          input.closeDate ?? null,
          input.earnestMoneyDue ?? null,
          input.mutualAcceptance ?? null,
          input.dueDiligence ?? null,
          input.finalWalkThrough ?? null,
          input.possession ?? null,
          input.propertyAddress ?? null,
          input.description ?? null,
          input.clientType,
          input.stageId,
          position,
        ],
      );
      const id = result.rows[0]!.id;
      await this.setDealContacts(client, id, input.contactIds);
      await this.setDealPartners(client, id, input.partnerIds);
      await client.query("commit");
      return await this.getDeal(id);
    } catch (error) {
      await client.query("rollback");
      pgError(error);
    } finally {
      client.release();
    }
  }

  async updateDeal(id: string, input: Partial<DealInput>) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const existing = await this.getDeal(id, client) as { clientType: DealClientType; stageId: string | null };
      const clientType = input.clientType ?? existing.clientType;
      if (input.stageId) await this.requireDealStage(input.stageId, clientType, client);
      const { contactIds, partnerIds, ...changes } = input;
      const query = updateSql("crm_deals", "d", id, this.profileId, changes, {
        name: "name",
        price: "price",
        commission: "commission",
        closeDate: "close_date",
        earnestMoneyDue: "earnest_money_due",
        mutualAcceptance: "mutual_acceptance",
        dueDiligence: "due_diligence",
        finalWalkThrough: "final_walk_through",
        possession: "possession",
        propertyAddress: "property_address",
        description: "description",
        clientType: "client_type",
        stageId: "crm_deal_stage_id",
        position: "position",
      }, "d.id");
      if (query) await client.query(query.text, query.values);
      if (contactIds) await this.setDealContacts(client, id, contactIds);
      if (partnerIds) await this.setDealPartners(client, id, partnerIds);
      await client.query("commit");
      return await this.getDeal(id);
    } catch (error) {
      await client.query("rollback");
      pgError(error);
    } finally {
      client.release();
    }
  }

  async deleteDeal(id: string) {
    const result = await this.db.query(
      "delete from public.crm_deals where id = $1 and profile_id = $2 returning id",
      [id, this.profileId],
    );
    if (!result.rows[0]) throw new CrmAccessError("Deal not found.");
  }

  async listDealStages(clientType?: DealClientType) {
    await this.ensureDealStages();
    const values: unknown[] = [this.profileId];
    const where = ["s.profile_id = $1"];
    if (clientType) {
      values.push(clientType);
      where.push(`s.client_type = $${values.length}`);
    }
    const result = await this.db.query(
      `select ${this.dealStageColumns()}
       from public.crm_deal_stages s
       where ${where.join(" and ")}
       order by s.client_type, s.position, s.id`,
      values,
    );
    return result.rows;
  }

  async createDealStage(input: DealStageInput) {
    try {
      let position = input.position;
      if (position == null || Number.isNaN(position)) {
        const max = await this.db.query<{ next: number }>(
          `select coalesce(max(position), -1) + 1 as next
           from public.crm_deal_stages
           where profile_id = $1 and client_type = $2`,
          [this.profileId, input.clientType],
        );
        position = Number(max.rows[0]?.next ?? 0);
      }
      const result = await this.db.query(
        `insert into public.crm_deal_stages (profile_id, name, client_type, color, position)
         values ($1,$2,$3,$4,$5)
         returning id, profile_id as "profileId", name, client_type as "clientType", color, position`,
        [this.profileId, input.name, input.clientType, input.color, position],
      );
      return result.rows[0];
    } catch (error) {
      pgError(error);
    }
  }

  async updateDealStage(id: string, input: Partial<Omit<DealStageInput, "clientType">>) {
    try {
      const query = updateSql("crm_deal_stages", "s", id, this.profileId, input, {
        name: "name", color: "color", position: "position",
      }, this.dealStageColumns("s"));
      if (!query) {
        const result = await this.db.query(
          `select ${this.dealStageColumns()} from public.crm_deal_stages s where s.id=$1 and s.profile_id=$2`,
          [id, this.profileId],
        );
        if (!result.rows[0]) throw new CrmAccessError("Deal stage not found.");
        return result.rows[0];
      }
      const result = await this.db.query(query.text, query.values);
      if (!result.rows[0]) throw new CrmAccessError("Deal stage not found.");
      return result.rows[0];
    } catch (error) {
      pgError(error);
    }
  }

  async deleteDealStage(id: string) {
    try {
      const result = await this.db.query(
        "delete from public.crm_deal_stages where id=$1 and profile_id=$2 returning id",
        [id, this.profileId],
      );
      if (!result.rows[0]) throw new CrmAccessError("Deal stage not found.");
    } catch (error) {
      pgError(error);
    }
  }
}

export function repositoryUsesTenantScope(sql: string) {
  return /profile_id\s*=\s*\$\d+/i.test(sql) || /profile_id\s*=\s*[^\s]+\.profile_id/i.test(sql);
}

export type CrmRow = QueryResultRow;
