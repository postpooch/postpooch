import { NextResponse } from 'next/server';

import {
  SESSION_LONG_SECONDS,
  SESSION_SHORT_SECONDS,
  createSupabaseAuthClient,
  setSupabaseSessionCookies,
} from '@/lib/auth/token_control';
import { ensureProfileForUser } from '@/lib/auth/profiles';
import { runAccountSetup } from '@/lib/onboarding/account-setup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginBody = {
  email?: unknown;
  password?: unknown;
  rememberMe?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const rememberMe = body.rememberMe === true;

  if (!email || !EMAIL_PATTERN.test(email)) {
    return jsonError('Enter a valid email address.', 400);
  }

  if (!password) {
    return jsonError('Enter your password.', 400);
  }

  try {
    const supabase = createSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return jsonError('Invalid email or password.', 401);
    }

    await ensureProfileForUser({ userId: data.user.id });
    await runAccountSetup({
      profileId: data.user.id,
      email: data.user.email ?? email,
      emailVerified: Boolean(data.user.email_confirmed_at),
    });

    const response = NextResponse.json({ ok: true });
    setSupabaseSessionCookies(
      response,
      data.session,
      rememberMe ? SESSION_LONG_SECONDS : SESSION_SHORT_SECONDS,
    );

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    return jsonError('Unable to sign in right now.', 500);
  }
}
