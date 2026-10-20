import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';

import { getProfileById, type Profile } from '@/lib/auth/profiles';
import { createSupabaseAuthClient } from '@/lib/auth/token_control';

export type AuthenticatedProfile = {
  user: User;
  profile: Profile;
};

export class AuthenticationError extends Error {
  constructor(message = 'Sign in required.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class MissingProfileError extends Error {
  constructor() {
    super('No profile exists for this user.');
    this.name = 'MissingProfileError';
  }
}

export class ProfileAccessError extends Error {
  constructor() {
    super('You can only view your own profile.');
    this.name = 'ProfileAccessError';
  }
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('yn-sb-access-token')?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseAuthClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

export async function getAuthenticatedProfile(): Promise<AuthenticatedProfile | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const profile = await getProfileById(user.id);

  if (!profile) {
    return null;
  }

  return { user, profile };
}

export async function requireAuthenticatedProfile(): Promise<AuthenticatedProfile> {
  const user = await requireAuthenticatedUser();
  const profile = await getProfileById(user.id);

  if (!profile) {
    throw new MissingProfileError();
  }

  return { user, profile };
}

export async function requireAuthorizedProfile(profileId: string): Promise<AuthenticatedProfile> {
  const user = await requireAuthenticatedUser();

  if (user.id !== profileId) {
    throw new ProfileAccessError();
  }

  const profile = await getProfileById(profileId);

  if (!profile) {
    throw new MissingProfileError();
  }

  return { user, profile };
}
