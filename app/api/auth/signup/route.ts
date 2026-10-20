import { NextResponse } from 'next/server';

import { createProfileForUser } from '@/lib/auth/profiles';
import { runAccountSetup } from '@/lib/onboarding/account-setup';
import {
  SESSION_LONG_SECONDS,
  createSupabaseAuthClient,
  setSupabaseSessionCookies,
} from '@/lib/auth/token_control';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type SignupBody = {
  email?: unknown;
  password?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !EMAIL_PATTERN.test(email)) {
    return jsonError('Enter a valid email address.', 400);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return jsonError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400);
  }

  try {
    const supabase = createSupabaseAuthClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return jsonError(error.message || 'Unable to create account.', 400);
    }

    if (!data.user) {
      return jsonError('Unable to create account.', 500);
    }

    try {
      await createProfileForUser({ userId: data.user.id, email });
      await runAccountSetup({
        profileId: data.user.id,
        email,
        emailVerified: Boolean(data.user.email_confirmed_at),
      });
    } catch (profileError) {
      console.error('Failed to create profile after signup:', profileError);
      return jsonError('Account created, but profile setup failed. Please contact support.', 500);
    }

    const response = NextResponse.json({
      ok: true,
      requiresEmailConfirmation: !data.session,
    });

    if (data.session) {
      setSupabaseSessionCookies(response, data.session, SESSION_LONG_SECONDS);
    }

    return response;
  } catch (error) {
    console.error('Signup failed:', error);
    return jsonError('Unable to create account right now.', 500);
  }
}
