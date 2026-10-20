import type { Pool, PoolClient } from "pg";

import { PostingError, toErrorMessage } from "./errors";
import type {
  MediaRow,
  PostContent,
  PostingRun,
  ScheduleRow,
  TemplateRow,
} from "./types";

type PostingRunDatabaseRow = Omit<PostingRun, "acquired" | "media_urls"> & {
  acquired: boolean;
  media_urls: unknown;
};

function databaseError(operation: string, error: unknown): PostingError {
  return new PostingError(
    `PostgreSQL ${operation} failed: ${toErrorMessage(error)}`,
    true,
  );
}

function normalizeMediaUrls(value: unknown): string[] | null {
  if (value === null) {
    return null;
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }

  throw new PostingError(
    "A posting run contains invalid media_urls data",
    false,
  );
}

function normalizePostingRun(row: PostingRunDatabaseRow): PostingRun {
  return {
    ...row,
    media_urls: normalizeMediaUrls(row.media_urls),
  };
}

function validateMedia(media: MediaRow[]): MediaRow[] {
  if (media.length === 0) {
    throw new PostingError("The post has no media rows", false);
  }

  const displayOrders = new Set<number>();
  for (const item of media) {
    if (
      item.display_order === null ||
      !Number.isInteger(item.display_order) ||
      item.display_order < 1
    ) {
      throw new PostingError(
        `Media ${item.id} must have a positive integer display_order`,
        false,
      );
    }
    if (displayOrders.has(item.display_order)) {
      throw new PostingError(
        `The post has duplicate media display_order ${item.display_order}`,
        false,
      );
    }
    if (item.image_design === null) {
      throw new PostingError(
        `Media ${item.id} does not have an image_design`,
        false,
      );
    }
    displayOrders.add(item.display_order);
  }

  return [...media].sort(
    (left, right) => left.display_order! - right.display_order!,
  );
}

function assertUpdated(operation: string, rowCount: number | null): void {
  if (rowCount !== 1) {
    throw new PostingError(
      `PostgreSQL ${operation} could not update the active posting run`,
      true,
    );
  }
}

export class PostingRepository {
  constructor(private readonly database: Pool) {}

  async getSchedule(id: string): Promise<ScheduleRow> {
    try {
      const result = await this.database.query<ScheduleRow>(
        `select
          id,
          created_at::text as created_at,
          profile_id,
          delete_after_use,
          platform,
          platform_account_id,
          uses_template,
          text
        from public.schedules
        where id = $1::uuid
        limit 1`,
        [id],
      );
      const schedule = result.rows[0];
      if (!schedule) {
        throw new PostingError(`Schedule ${id} was not found`, false);
      }
      return schedule;
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("schedule lookup", error);
    }
  }

  async acquireRun(input: {
    scheduleId: string;
    occurrenceAt: string;
    triggerRunId: string;
    requestId: string;
    leaseSeconds: number;
  }): Promise<PostingRun> {
    try {
      const result = await this.database.query<PostingRunDatabaseRow>(
        `select
          id,
          schedule_id,
          occurrence_at::text as occurrence_at,
          trigger_run_id,
          status,
          template_id,
          zernio_request_id,
          zernio_post_id,
          media_urls,
          acquired
        from public.acquire_posting_run(
          $1::uuid,
          $2::timestamptz,
          $3::text,
          $4::uuid,
          $5::integer
        )`,
        [
          input.scheduleId,
          input.occurrenceAt,
          input.triggerRunId,
          input.requestId,
          input.leaseSeconds,
        ],
      );
      const run = result.rows[0];
      if (!run) {
        throw new PostingError(
          "The posting-run acquisition returned no row",
          true,
        );
      }
      return normalizePostingRun(run);
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("posting-run acquisition", error);
    }
  }

  async getContent(
    schedule: ScheduleRow,
    postingRun: PostingRun,
  ): Promise<PostContent> {
    if (schedule.uses_template === null) {
      throw new PostingError(
        `Schedule ${schedule.id} must set uses_template`,
        false,
      );
    }

    if (!schedule.uses_template) {
      const media = await this.getMedia("schedule_id", schedule.id);
      return {
        caption: schedule.text,
        media,
        templateId: null,
      };
    }

    const template = postingRun.template_id
      ? await this.getTemplate(postingRun.template_id)
      : await this.chooseAndSaveRandomTemplate(postingRun.id);
    const media = await this.getMedia("template_id", template.id);

    return {
      caption: template.text,
      media,
      templateId: template.id,
    };
  }

  private async getTemplate(id: string): Promise<TemplateRow> {
    try {
      const result = await this.database.query<TemplateRow>(
        `select id, created_at::text as created_at, text
        from public.templates
        where id = $1::uuid
        limit 1`,
        [id],
      );
      const template = result.rows[0];
      if (!template) {
        throw new PostingError(`Template ${id} was not found`, false);
      }
      return template;
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("template lookup", error);
    }
  }

  private async chooseAndSaveRandomTemplate(
    postingRunId: string,
  ): Promise<TemplateRow> {
    const client = await this.connect("random template selection");

    try {
      await client.query("begin");
      const runResult = await client.query<{ template_id: string | null }>(
        `select template_id
        from public.posting_runs
        where id = $1::uuid
        for update`,
        [postingRunId],
      );
      const run = runResult.rows[0];
      if (!run) {
        throw new PostingError(
          `Posting run ${postingRunId} was not found`,
          false,
        );
      }

      let template: TemplateRow | undefined;
      if (run.template_id) {
        const result = await client.query<TemplateRow>(
          `select id, created_at::text as created_at, text
          from public.templates
          where id = $1::uuid
          limit 1`,
          [run.template_id],
        );
        template = result.rows[0];
      } else {
        const result = await client.query<TemplateRow>(
          `select id, created_at::text as created_at, text
          from public.templates
          offset (
            select floor(random() * count(*))::bigint
            from public.templates
          )
          limit 1`,
        );
        template = result.rows[0];

        if (template) {
          await client.query(
            `update public.posting_runs
            set template_id = $1::uuid, updated_at = now()
            where id = $2::uuid`,
            [template.id, postingRunId],
          );
        }
      }

      if (!template) {
        throw new PostingError("No templates are available", false);
      }

      await client.query("commit");
      return template;
    } catch (error) {
      try {
        await client.query("rollback");
      } catch {
        // Preserve the original failure; the pool discards broken connections.
      }

      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("random template selection", error);
    } finally {
      client.release();
    }
  }

  private async connect(operation: string): Promise<PoolClient> {
    try {
      return await this.database.connect();
    } catch (error) {
      throw databaseError(operation, error);
    }
  }

  private async getMedia(
    foreignKey: "schedule_id" | "template_id",
    id: string,
  ): Promise<MediaRow[]> {
    const foreignKeySql = foreignKey === "schedule_id"
      ? "schedule_id"
      : "template_id";

    try {
      const result = await this.database.query<MediaRow>(
        `select
          id,
          created_at::text as created_at,
          schedule_id,
          image_design,
          display_order,
          template_id,
          post_project_id,
          posting_run_id
        from public.media
        where ${foreignKeySql} = $1::uuid
        order by display_order asc nulls last, created_at asc`,
        [id],
      );
      return validateMedia(result.rows);
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("media lookup", error);
    }
  }

  async saveMediaUrls(
    postingRunId: string,
    triggerRunId: string,
    mediaUrls: string[],
  ): Promise<void> {
    try {
      const result = await this.database.query(
        `update public.posting_runs
        set media_urls = $1::jsonb, updated_at = now()
        where id = $2::uuid
          and trigger_run_id = $3::text
          and status = 'processing'`,
        [JSON.stringify(mediaUrls), postingRunId, triggerRunId],
      );
      assertUpdated("posting-run media update", result.rowCount);
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("posting-run media update", error);
    }
  }

  async markPublished(input: {
    postingRunId: string;
    triggerRunId: string;
    zernioPostId: string;
    mediaUrls: string[];
  }): Promise<void> {
    try {
      const result = await this.database.query(
        `update public.posting_runs
        set
          status = 'published',
          zernio_post_id = $1::text,
          media_urls = $2::jsonb,
          published_at = now(),
          lease_expires_at = null,
          last_error = null,
          updated_at = now()
        where id = $3::uuid
          and trigger_run_id = $4::text
          and status = 'processing'`,
        [
          input.zernioPostId,
          JSON.stringify(input.mediaUrls),
          input.postingRunId,
          input.triggerRunId,
        ],
      );
      assertUpdated("posting-run completion", result.rowCount);
    } catch (error) {
      if (error instanceof PostingError) {
        throw error;
      }
      throw databaseError("posting-run completion", error);
    }
  }

  async markFailed(
    postingRunId: string,
    triggerRunId: string,
    error: unknown,
  ): Promise<void> {
    try {
      await this.database.query(
        `update public.posting_runs
        set
          status = 'failed',
          lease_expires_at = null,
          last_error = $1::text,
          updated_at = now()
        where id = $2::uuid
          and trigger_run_id = $3::text
          and status = 'processing'`,
        [toErrorMessage(error).slice(0, 4_000), postingRunId, triggerRunId],
      );
    } catch (updateError) {
      throw databaseError("posting-run failure update", updateError);
    }
  }

  async deleteSchedule(id: string): Promise<void> {
    try {
      await this.database.query(
        "delete from public.schedules where id = $1::uuid",
        [id],
      );
    } catch (error) {
      throw databaseError("schedule deletion", error);
    }
  }
}

export { validateMedia };
