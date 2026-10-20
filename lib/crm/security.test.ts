import type { QueryResult, QueryResultRow } from "pg";
import { describe, expect, it } from "vitest";

import { contactInput } from "@/lib/crm/input";
import { CrmAccessError, CrmRepository, repositoryUsesTenantScope } from "@/lib/crm/repository";

const CONTACT_ID = "11111111-1111-4111-8111-111111111111";
const PROFILE_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PROFILE_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function result<T extends QueryResultRow>(rows: T[]): QueryResult<T> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

describe("CRM tenant boundary", () => {
  it("does not accept a browser-supplied tenant identifier", () => {
    const parsed = contactInput.safeParse({
      firstName: "Taylor",
      profileId: PROFILE_B,
      profile_id: PROFILE_B,
    });
    expect(parsed.success).toBe(false);
  });

  it("places the authenticated profile in every owned contact lookup", async () => {
    const calls: { text: string; values?: readonly unknown[] }[] = [];
    const db = {
      query: async <R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>> => {
        calls.push({ text, values });
        const visible = values?.[0] === CONTACT_ID && values?.[1] === PROFILE_A;
        return result(visible ? [{ id: CONTACT_ID, firstName: "Taylor", tags: [], stage: null }] : []) as unknown as QueryResult<R>;
      },
    };

    await expect(new CrmRepository(PROFILE_A, db).getContact(CONTACT_ID)).resolves.toMatchObject({ id: CONTACT_ID });
    await expect(new CrmRepository(PROFILE_B, db).getContact(CONTACT_ID)).rejects.toBeInstanceOf(CrmAccessError);
    expect(calls.every((call) => repositoryUsesTenantScope(call.text))).toBe(true);
    expect(calls[0]?.values).toEqual([CONTACT_ID, PROFILE_A]);
    expect(calls[1]?.values).toEqual([CONTACT_ID, PROFILE_B]);
  });

  it("scopes deletes by both guessed record id and authenticated profile", async () => {
    const calls: { text: string; values?: readonly unknown[] }[] = [];
    const db = {
      query: async <R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>> => {
        calls.push({ text, values });
        return result(values?.[1] === PROFILE_A ? [{ id: CONTACT_ID }] : []) as unknown as QueryResult<R>;
      },
    };
    await new CrmRepository(PROFILE_A, db).deleteContact(CONTACT_ID);
    await expect(new CrmRepository(PROFILE_B, db).deleteContact(CONTACT_ID)).rejects.toBeInstanceOf(CrmAccessError);
    expect(calls.every((call) => /where id = \$1 and profile_id = \$2/i.test(call.text))).toBe(true);
  });

  it("rejects associating another tenant's contact with a transaction", async () => {
    const calls: string[] = [];
    const db = {
      query: async <R extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<QueryResult<R>> => {
        calls.push(text);
        if (text.includes("from public.crm_contacts")) return result([]) as unknown as QueryResult<R>;
        return result([]) as unknown as QueryResult<R>;
      },
    };

    await expect(new CrmRepository(PROFILE_B, db).createTransaction({
      title: "Cross-tenant attempt",
      contactId: CONTACT_ID,
      propertyId: null,
      partnerId: null,
      side: "buyer",
      status: "active",
      estimatedValue: null,
      offerAmount: null,
      expectedClosingDate: null,
      actualClosingDate: null,
      estimatedCommission: null,
      actualCommission: null,
      leadSource: null,
      description: null,
      position: 0,
    })).rejects.toBeInstanceOf(CrmAccessError);
    expect(calls.some((text) => /^\s*insert into public\.crm_transactions/i.test(text))).toBe(false);
  });
});
