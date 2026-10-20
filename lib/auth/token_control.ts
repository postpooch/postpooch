import type { Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

export const SESSION_SHORT_SECONDS = 60 * 60 * 24;
export const SESSION_LONG_SECONDS = 60 * 60 * 24 * 28;

const SESSION_MAX_AGE_COOKIE = 'yn-sb-session-max-age';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProduction,
  path: '/',
};

export function createSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase auth configuration.');
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function setSupabaseSessionCookies(
  response: NextResponse,
  session: Session,
  sessionMaxAgeSeconds: number,
) {
  response.cookies.set('yn-sb-access-token', session.access_token, {
    ...cookieOptions,
    maxAge: session.expires_in,
  });

  response.cookies.set('yn-sb-refresh-token', session.refresh_token, {
    ...cookieOptions,
    maxAge: sessionMaxAgeSeconds,
  });

  response.cookies.set(SESSION_MAX_AGE_COOKIE, String(sessionMaxAgeSeconds), {
    ...cookieOptions,
    maxAge: sessionMaxAgeSeconds,
  });
}

export function clearSupabaseSessionCookies(response: NextResponse) {
  response.cookies.set('yn-sb-access-token', '', {
    ...cookieOptions,
    maxAge: 0,
  });

  response.cookies.set('yn-sb-refresh-token', '', {
    ...cookieOptions,
    maxAge: 0,
  });

  response.cookies.set(SESSION_MAX_AGE_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  });
}

function getStoredSessionMaxAge(request: NextRequest) {
  const stored = Number(request.cookies.get(SESSION_MAX_AGE_COOKIE)?.value);

  if (stored === SESSION_SHORT_SECONDS || stored === SESSION_LONG_SECONDS) {
    return stored;
  }

  return SESSION_LONG_SECONDS;
}

export async function refreshSupabaseSessionIfNeeded(
  request: NextRequest,
) {
  let response = NextResponse.next({ request });
  const accessToken = request.cookies.get('yn-sb-access-token')?.value;
  const refreshToken = request.cookies.get('yn-sb-refresh-token')?.value;

  if (!refreshToken) {
    return response;
  }

  const sessionMaxAgeSeconds = getStoredSessionMaxAge(request);
  const supabase = createSupabaseAuthClient();

  if (accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (!error && data.user) {
      return response;
    }
  }

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    clearSupabaseSessionCookies(response);
    return response;
  }

  // Forward the rotated access token to the current route as well as the
  // browser. Without this, the request that triggered the refresh still sees
  // the expired token and incorrectly returns 401.
  request.cookies.set('yn-sb-access-token', data.session.access_token);
  request.cookies.set('yn-sb-refresh-token', data.session.refresh_token);
  request.cookies.set(SESSION_MAX_AGE_COOKIE, String(sessionMaxAgeSeconds));
  response = NextResponse.next({ request });
  setSupabaseSessionCookies(response, data.session, sessionMaxAgeSeconds);
  return response;
}
