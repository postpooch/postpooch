import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";

import { getDbPool } from "@/lib/db/client";
import { createPlannerModel } from "@/lib/social-media/context/mutation-planner";
import {
  ContextRecordNotFoundError,
  SocialMediaContextRepository,
} from "@/lib/social-media/context/repository";

const dispositionSchema = z.object({
  dispositions: z.array(z.object({
    contextHandle: z.string().regex(/^CTX_[1-9][0-9]*$/),
    action: z.enum(["delete_instruction", "detach_asset_keep_instruction", "update_instruction_and_detach"]),
    replacementText: z.string().trim().min(1).max(500).nullable(),
  }).strict()).max(100),
}).strict();

type LinkedContext = {
  type: "preference" | "frequency" | "temporary";
  id: string;
  text: string;
};

export async function retireSocialMediaAsset(input: {
  profileId: string;
  assetId: string;
  submissionKey: string;
}) {
  const repository = new SocialMediaContextRepository(input.profileId);
  const noteText = `Delete my uploaded social-media image (${input.assetId}).`;
  const note = await repository.createNote(noteText, input.submissionKey, [input.assetId]);
  if (!note.created && note.outcome) return note.outcome;
  const claim = await repository.claimNote(note.noteId);
  if (!claim) return { state: "processing" as const, noteId: note.noteId };

  const pool = getDbPool();
  let revision: number | null = null;
  try {
    const loaded = await pool.query<{
      revision: string; storage_key: string; purpose: string; original_filename: string;
    }>(
      `select s.revision::text,a.storage_key,a.purpose,a.original_filename
       from public.social_media_assets a
       join public.social_media_context_states s on s.profile_id=a.profile_id
       where a.id=$1::uuid and a.profile_id=$2::uuid and a.deleted_at is null`,
      [input.assetId, input.profileId],
    );
    const asset = loaded.rows[0];
    if (!asset) throw new ContextRecordNotFoundError("That image is unavailable.");
    revision = Number(asset.revision);
    const links = await loadLinkedContext(input.profileId, input.assetId);
    const dispositions = links.length ? await planDispositions(asset, links) : [];
    validateCompleteDispositions(links, dispositions);

    const client = await pool.connect();
    try {
      await client.query("begin");
      const fence = await client.query(
        `select 1 from public.social_media_note_processing
         where note_id=$1 and profile_id=$2 and status='processing'
           and lease_token=$3 and lease_expires_at>now() for update`,
        [claim.noteId, input.profileId, claim.leaseToken],
      );
      if (!fence.rowCount) throw new Error("Asset-retirement processing lease was superseded.");
      const bumped = await client.query<{ revision: string }>(
        `update public.social_media_context_states set revision=revision+1,updated_at=now()
         where profile_id=$1 and revision=$2 returning revision`, [input.profileId, revision]);
      if (!bumped.rows[0]) {
        await client.query(
          `insert into public.social_media_note_outcomes
            (profile_id,note_id,attempt_number,result_state,snapshot_revision,reason_code,detail)
           values ($1,$2,$3,'conflict',$4,'stale_context_revision',$5::jsonb)`,
          [input.profileId, claim.noteId, claim.attemptNumber, revision, JSON.stringify({ action: "asset_retirement" })],
        );
        await finishProcessing(client, input.profileId, claim.noteId, claim.leaseToken);
        await client.query("commit");
        return { state: "conflict" as const, noteId: claim.noteId, attemptNumber: claim.attemptNumber,
          snapshotRevision: revision, committedRevision: null, reasonCode: "stale_context_revision" };
      }
      const outcomeId = randomUUID();
      const committedRevision = Number(bumped.rows[0].revision);
      await client.query(
        `insert into public.social_media_note_outcomes
          (id,profile_id,note_id,attempt_number,result_state,snapshot_revision,committed_revision,classification,mutation_plan,detail)
         values ($1,$2,$3,$4,'applied',$5,$6,$7::jsonb,$8::jsonb,$9::jsonb)`,
        [outcomeId, input.profileId, claim.noteId, claim.attemptNumber, revision, committedRevision,
          JSON.stringify({ kind: "asset_retirement" }), JSON.stringify({ dispositions }),
          JSON.stringify({ assetId: input.assetId })],
      );

      for (const [index, link] of links.entries()) {
        const disposition = dispositions.find((item) => item.contextHandle === `CTX_${index + 1}`)!;
        const effect = await applyDisposition(client, input.profileId, input.assetId, link, disposition);
        await client.query(
          `insert into public.social_media_context_changes
            (profile_id,note_id,outcome_id,category,operation,target_type,target_id,before_value,after_value)
           values ($1,$2,$3,$4,$5,'instruction',$6,$7::jsonb,$8::jsonb)`,
          [input.profileId, claim.noteId, outcomeId, link.type, effect.operation, link.id,
            JSON.stringify(effect.before), effect.after === null ? null : JSON.stringify(effect.after)],
        );
      }
      const retired = await client.query(
        `update public.social_media_assets set deleted_at=now()
         where id=$1::uuid and profile_id=$2::uuid and deleted_at is null`, [input.assetId, input.profileId]);
      if (retired.rowCount !== 1) throw new ContextRecordNotFoundError("That image is unavailable.");
      await client.query(
        `insert into public.social_media_context_changes
          (profile_id,note_id,outcome_id,category,operation,target_type,target_id,before_value,after_value)
         values ($1,$2,$3,'asset','delete','social_media_asset',$4,$5::jsonb,null)`,
        [input.profileId, claim.noteId, outcomeId, input.assetId,
          JSON.stringify({ storageKey: asset.storage_key, purpose: asset.purpose, originalFilename: asset.original_filename })],
      );
      await finishProcessing(client, input.profileId, claim.noteId, claim.leaseToken);
      await client.query("commit");
      return { state: "applied" as const, noteId: claim.noteId, attemptNumber: claim.attemptNumber,
        snapshotRevision: revision, committedRevision, reasonCode: null };
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw error;
    } finally { client.release(); }
  } catch (error) {
    const latest = await repository.getLatestOutcome(claim.noteId);
    if (latest) return latest;
    await repository.finishWithoutMutation(claim, {
      state: "infrastructure_failure",
      snapshotRevision: revision,
      reasonCode: "ASSET_RETIREMENT_FAILURE",
      detail: { retryable: true },
    }).catch(() => undefined);
    throw error;
  }
}

async function loadLinkedContext(profileId: string, assetId: string): Promise<LinkedContext[]> {
  const result = await getDbPool().query<LinkedContext>(
    `select 'preference'::text type,p.id,p.instruction text
     from public.social_media_preference_assets l join public.social_media_preferences p
       on p.id=l.preference_id and p.profile_id=l.profile_id
     where l.profile_id=$1 and l.asset_id=$2
     union all
     select 'frequency',f.id,f.instruction
     from public.social_media_frequency_instruction_assets l join public.social_media_frequency_based_instructions f
       on f.id=l.frequency_instruction_id and f.profile_id=l.profile_id
     where l.profile_id=$1 and l.asset_id=$2
     union all
     select 'temporary',t.id,t.instruction
     from public.social_media_temporary_instruction_assets l join public.social_media_temporary_instructions t
       on t.id=l.temporary_instruction_id and t.profile_id=l.profile_id
     where l.profile_id=$1 and l.asset_id=$2
     order by type,id`, [profileId, assetId]);
  return result.rows;
}

async function planDispositions(asset: { purpose: string; original_filename: string }, links: LinkedContext[]) {
  const model = await createPlannerModel();
  const structured = model.withStructuredOutput(dispositionSchema, { name: "asset_retirement_dispositions" });
  return (await structured.invoke([
    { role: "system", content: [
      "You are the attachment-aware Context Builder retirement planner.",
      "For every CTX handle, decide whether its meaning depends on this exact image.",
      "Delete exact-file instructions such as always use this logo, use this headshot next N times, or occasionally use this office photo.",
      "Detach and keep style/example guidance that remains meaningful without the image. Update and detach only when image-dependent wording must be removed for the remaining guidance to be coherent.",
      "Return exactly one disposition for every supplied handle and no others.",
    ].join("\n") },
    { role: "user", content: JSON.stringify({
      asset: { purpose: asset.purpose, originalFilename: asset.original_filename },
      linkedContext: links.map((link, index) => ({ handle: `CTX_${index + 1}`, type: link.type, instruction: link.text })),
    }) },
  ])).dispositions;
}

function validateCompleteDispositions(links: LinkedContext[], dispositions: z.infer<typeof dispositionSchema>["dispositions"]): void {
  const expected = links.map((_, index) => `CTX_${index + 1}`);
  const actual = dispositions.map((item) => item.contextHandle);
  if (actual.length !== expected.length || new Set(actual).size !== actual.length || expected.some((handle) => !actual.includes(handle))) {
    throw new Error("Asset-retirement planner did not cover every linked context row exactly once.");
  }
  for (const item of dispositions) {
    if ((item.action === "update_instruction_and_detach") !== (item.replacementText !== null)) {
      throw new Error("Asset-retirement replacement text does not match its action.");
    }
  }
}

async function applyDisposition(
  client: import("pg").PoolClient,
  profileId: string,
  assetId: string,
  link: LinkedContext,
  disposition: z.infer<typeof dispositionSchema>["dispositions"][number],
) {
  const config = link.type === "preference"
    ? { table: "public.social_media_preferences", linkTable: "public.social_media_preference_assets", idColumn: "preference_id" }
    : link.type === "frequency"
      ? { table: "public.social_media_frequency_based_instructions", linkTable: "public.social_media_frequency_instruction_assets", idColumn: "frequency_instruction_id" }
      : { table: "public.social_media_temporary_instructions", linkTable: "public.social_media_temporary_instruction_assets", idColumn: "temporary_instruction_id" };
  if (disposition.action === "delete_instruction") {
    const deleted = await client.query(`delete from ${config.table} where id=$1 and profile_id=$2`, [link.id, profileId]);
    if (deleted.rowCount !== 1) throw new ContextRecordNotFoundError();
    return { operation: "delete", before: { text: link.text, assetId }, after: null };
  }
  if (disposition.action === "update_instruction_and_detach") {
    const updated = await client.query(
      `update ${config.table} set instruction=$1,updated_at=now() where id=$2 and profile_id=$3`,
      [disposition.replacementText, link.id, profileId]);
    if (updated.rowCount !== 1) throw new ContextRecordNotFoundError();
  }
  const detached = await client.query(
    `delete from ${config.linkTable} where profile_id=$1 and ${config.idColumn}=$2 and asset_id=$3`,
    [profileId, link.id, assetId]);
  if (detached.rowCount !== 1) throw new ContextRecordNotFoundError();
  return { operation: "update", before: { text: link.text, assetId },
    after: { text: disposition.replacementText ?? link.text, assetId: null } };
}

async function finishProcessing(client: import("pg").PoolClient, profileId: string, noteId: string, leaseToken: string) {
  const result = await client.query(
    `update public.social_media_note_processing set status='finished',lease_token=null,
       lease_expires_at=null,updated_at=now()
     where note_id=$1 and profile_id=$2 and lease_token=$3`, [noteId, profileId, leaseToken]);
  if (result.rowCount !== 1) throw new Error("Asset-retirement processing lease was superseded.");
}
