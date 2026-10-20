import type { PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";

export const UNTITLED_PROJECT_NAME = "Untitled social post";
export const MAX_PROJECT_MEDIA = 10;
export const MAX_PROJECT_NAME_LENGTH = 120;

export type PostProjectDocument = Record<string, unknown>;

export type PostProjectMedia = {
  id: string;
  created_at: string;
  display_order: number;
  image_design: PostProjectDocument | null;
};

export type PostProject = {
  id: string;
  created_at: string;
  name: string | null;
  profile_id: string;
  media: PostProjectMedia[];
};

export type PostProjectListItem = {
  id: string;
  created_at: string;
  name: string | null;
  profile_id: string;
  preview_image_design: PostProjectDocument | null;
};

export type PostProjectCursor = {
  createdAt: string;
  id: string;
};

export type PostProjectErrorCode =
  | "not_found"
  | "last_slide"
  | "max_slides";

export class PostProjectError extends Error {
  constructor(
    message: string,
    readonly code: PostProjectErrorCode,
  ) {
    super(message);
    this.name = "PostProjectError";
  }
}

type ProjectRow = {
  id: string;
  created_at: string;
  name: string | null;
  profile_id: string;
};

type MediaDatabaseRow = {
  id: string;
  created_at: string;
  display_order: number | null;
  image_design: unknown;
};

const PROJECT_COLUMNS = `
  id,
  created_at::text as created_at,
  name,
  profile_id
`;

const MEDIA_COLUMNS = `
  id,
  created_at::text as created_at,
  display_order,
  image_design
`;

export function displayProjectName(name: string | null | undefined) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : UNTITLED_PROJECT_NAME;
}

export function normalizeProjectName(name: unknown) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim().slice(0, MAX_PROJECT_NAME_LENGTH);
  return trimmed || null;
}

export function toFabricImageDesign(value: PostProjectDocument) {
  const design = { ...value };
  delete design.projectName;
  return design;
}

function isProjectDocument(value: unknown): value is PostProjectDocument {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeMedia(row: MediaDatabaseRow): PostProjectMedia {
  return {
    id: row.id,
    created_at: row.created_at,
    display_order:
      typeof row.display_order === "number" && row.display_order > 0
        ? row.display_order
        : 1,
    image_design: isProjectDocument(row.image_design) ? row.image_design : null,
  };
}

async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    try {
      await client.query("rollback");
    } catch {
      // Preserve the original failure; the pool discards broken connections.
    }
    throw error;
  } finally {
    client.release();
  }
}

async function listMediaForProject(
  client: PoolClient | ReturnType<typeof getDbPool>,
  projectId: string,
) {
  const result = await client.query<MediaDatabaseRow>(
    `
      select ${MEDIA_COLUMNS}
      from public.media
      where post_project_id = $1::uuid
      order by display_order asc nulls last, created_at asc, id asc
    `,
    [projectId],
  );

  return result.rows.map(normalizeMedia);
}

async function ensureProjectMedia(
  client: PoolClient | ReturnType<typeof getDbPool>,
  projectId: string,
) {
  const media = await listMediaForProject(client, projectId);
  if (media.length > 0) return media;

  try {
    await client.query(
      `
        insert into public.media (post_project_id, display_order, image_design)
        values ($1::uuid, 1, null)
      `,
      [projectId],
    );
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "";
    if (code !== "23505") {
      throw error;
    }
  }

  return listMediaForProject(client, projectId);
}

export async function createPostProject(profileId: string) {
  return withTransaction(async (client) => {
    const projectResult = await client.query<
      Pick<ProjectRow, "id" | "created_at">
    >(
      `
        insert into public.post_projects (profile_id)
        values ($1::uuid)
        returning id, created_at::text as created_at
      `,
      [profileId],
    );
    const project = projectResult.rows[0];
    if (!project) {
      throw new Error("Project insert did not return a row.");
    }

    await client.query(
      `
        insert into public.media (post_project_id, display_order, image_design)
        values ($1::uuid, 1, null)
      `,
      [project.id],
    );

    return project;
  });
}

export async function getPostProjectForProfile(
  projectId: string,
  profileId: string,
): Promise<PostProject | null> {
  const result = await getDbPool().query<ProjectRow>(
    `
      select ${PROJECT_COLUMNS}
      from public.post_projects
      where id = $1::uuid
        and profile_id = $2::uuid
      limit 1
    `,
    [projectId, profileId],
  );
  const project = result.rows[0];
  if (!project) return null;

  return {
    ...project,
    media: await ensureProjectMedia(getDbPool(), project.id),
  };
}

export async function listPostProjectsForProfile(input: {
  profileId: string;
  limit: number;
  cursor?: PostProjectCursor;
}) {
  const result = await getDbPool().query<
    Omit<PostProjectListItem, "preview_image_design"> & {
      preview_image_design: unknown;
    }
  >(
    `
      select
        p.id,
        p.created_at::text as created_at,
        p.name,
        p.profile_id,
        m.image_design as preview_image_design
      from public.post_projects as p
      left join lateral (
        select image_design
        from public.media
        where post_project_id = p.id
        order by display_order asc nulls last, created_at asc, id asc
        limit 1
      ) as m on true
      where p.profile_id = $1::uuid
        and (
          $2::timestamptz is null
          or p.created_at < $2::timestamptz
          or (p.created_at = $2::timestamptz and p.id < $3::uuid)
        )
      order by p.created_at desc, p.id desc
      limit $4::integer
    `,
    [
      input.profileId,
      input.cursor?.createdAt ?? null,
      input.cursor?.id ?? null,
      input.limit + 1,
    ],
  );

  const hasMore = result.rows.length > input.limit;
  const projects = hasMore ? result.rows.slice(0, input.limit) : result.rows;
  const lastProject = projects.at(-1);

  return {
    projects: projects.map((project) => ({
      ...project,
      preview_image_design: isProjectDocument(project.preview_image_design)
        ? project.preview_image_design
        : null,
    })),
    nextCursor:
      hasMore && lastProject
        ? { createdAt: lastProject.created_at, id: lastProject.id }
        : null,
  };
}

export async function updatePostProjectSlide(input: {
  projectId: string;
  profileId: string;
  mediaId: string;
  name: string | null;
  imageDesign: PostProjectDocument;
}) {
  return withTransaction(async (client) => {
    const projectResult = await client.query<{ id: string }>(
      `
        update public.post_projects
        set name = $1
        where id = $2::uuid
          and profile_id = $3::uuid
        returning id
      `,
      [input.name, input.projectId, input.profileId],
    );
    if (!projectResult.rows[0]) return null;

    const mediaResult = await client.query<{ id: string }>(
      `
        update public.media as m
        set image_design = $1::jsonb
        from public.post_projects as p
        where m.id = $2::uuid
          and m.post_project_id = p.id
          and p.id = $3::uuid
          and p.profile_id = $4::uuid
        returning m.id
      `,
      [
        JSON.stringify(input.imageDesign),
        input.mediaId,
        input.projectId,
        input.profileId,
      ],
    );

    return mediaResult.rows[0] ?? null;
  });
}

export async function addPostProjectMedia(
  projectId: string,
  profileId: string,
) {
  return withTransaction(async (client) => {
    const owned = await client.query<{ id: string }>(
      `
        select id
        from public.post_projects
        where id = $1::uuid
          and profile_id = $2::uuid
        limit 1
        for update
      `,
      [projectId, profileId],
    );
    if (!owned.rows[0]) {
      throw new PostProjectError("Project not found.", "not_found");
    }

    const stats = await client.query<{ n: number; max_order: number }>(
      `
        select
          count(*)::int as n,
          coalesce(max(display_order), 0)::int as max_order
        from public.media
        where post_project_id = $1::uuid
      `,
      [projectId],
    );
    const count = stats.rows[0]?.n ?? 0;
    if (count >= MAX_PROJECT_MEDIA) {
      throw new PostProjectError(
        `A project can have at most ${MAX_PROJECT_MEDIA} slides.`,
        "max_slides",
      );
    }

    const inserted = await client.query<MediaDatabaseRow>(
      `
        insert into public.media (post_project_id, display_order, image_design)
        values ($1::uuid, $2::integer, null)
        returning ${MEDIA_COLUMNS}
      `,
      [projectId, (stats.rows[0]?.max_order ?? 0) + 1],
    );
    const row = inserted.rows[0];
    if (!row) {
      throw new Error("Media insert did not return a row.");
    }

    return normalizeMedia(row);
  });
}

export async function deletePostProjectMedia(input: {
  projectId: string;
  profileId: string;
  mediaId: string;
}) {
  return withTransaction(async (client) => {
    const owned = await client.query<{ id: string }>(
      `
        select id
        from public.post_projects
        where id = $1::uuid
          and profile_id = $2::uuid
        limit 1
        for update
      `,
      [input.projectId, input.profileId],
    );
    if (!owned.rows[0]) {
      throw new PostProjectError("Project not found.", "not_found");
    }

    const stats = await client.query<{ n: number }>(
      `
        select count(*)::int as n
        from public.media
        where post_project_id = $1::uuid
      `,
      [input.projectId],
    );
    if ((stats.rows[0]?.n ?? 0) <= 1) {
      throw new PostProjectError("Keep at least one slide.", "last_slide");
    }

    const deleted = await client.query<{ id: string }>(
      `
        delete from public.media
        where id = $1::uuid
          and post_project_id = $2::uuid
        returning id
      `,
      [input.mediaId, input.projectId],
    );
    if (!deleted.rows[0]) {
      throw new PostProjectError("Project not found.", "not_found");
    }

    return deleted.rows[0];
  });
}
