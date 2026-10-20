import { getDbPool } from '@/lib/db/client';
import { createZernioSocialProfile } from '@/lib/zernio/create-social-profile';

type CreateProfileInput = {
  userId: string;
  email?: string;
};

export type Profile = {
  id: string;
  created_at: string;
  social_profile_id: string | null;
  instagram_account_id: string | null;
  facebook_account_id: string | null;
};

const PROFILE_COLUMNS = `
  id,
  created_at::text as created_at,
  social_profile_id,
  instagram_account_id,
  facebook_account_id
`;

export async function createProfileForUser({ userId, email }: CreateProfileInput) {
  await ensureProfileForUser({ userId });

  try {
    const socialProfileId = await createZernioSocialProfile({ userId, email });
    await updateSocialProfileId(userId, socialProfileId);
  } catch (error) {
    console.error('Optional social profile setup failed after account creation:', {
      userId,
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
  }
}

export async function ensureProfileForUser({ userId }: Pick<CreateProfileInput, 'userId'>) {
  await getDbPool().query(
    `
      insert into public.profiles (id, social_profile_id)
      values ($1, $2)
      on conflict (id) do nothing
    `,
    [userId, null],
  );
}

export async function getProfileById(profileId: string) {
  const result = await getDbPool().query<Profile>(
    `
      select ${PROFILE_COLUMNS}
      from public.profiles
      where id = $1
      limit 1
    `,
    [profileId],
  );

  return result.rows[0] ?? null;
}

export async function updateSocialProfileId(
  profileId: string,
  socialProfileId: string | null,
) {
  const result = await getDbPool().query<Profile>(
    `
      update public.profiles
      set social_profile_id = $2
      where id = $1
      returning ${PROFILE_COLUMNS}
    `,
    [profileId, socialProfileId],
  );

  return result.rows[0] ?? null;
}

export async function updateInstagramAccountId(
  profileId: string,
  instagramAccountId: string | null,
) {
  const result = await getDbPool().query<Profile>(
    `
      update public.profiles
      set instagram_account_id = $2
      where id = $1
      returning ${PROFILE_COLUMNS}
    `,
    [profileId, instagramAccountId],
  );

  return result.rows[0] ?? null;
}

export async function updateFacebookAccountId(
  profileId: string,
  facebookAccountId: string | null,
) {
  const result = await getDbPool().query<Profile>(
    `
      update public.profiles
      set facebook_account_id = $2
      where id = $1
      returning ${PROFILE_COLUMNS}
    `,
    [profileId, facebookAccountId],
  );

  return result.rows[0] ?? null;
}
