import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  AFTER_LOGIN_PATH,
  isLoggedOutOnlyPath,
  isProtectedPath,
  loginPathFor,
} from "@/lib/auth/paths";
import type { Database } from "@/lib/db/database.types";
import { getPublicEnv, type PublicEnv } from "@/lib/env";

/**
 * Refreshes the Supabase session cookie on every request and redirects
 * optimistically: logged-out users away from protected pages, logged-in users
 * away from login/registration.
 *
 * This is not the security boundary. Pages and Server Functions check the user
 * again through lib/auth/dal.ts, and the database enforces Row Level Security.
 */
export async function updateSession(request: NextRequest) {
  let env: PublicEnv;
  try {
    env = getPublicEnv();
  } catch {
    // Without Supabase configured, pages that don't need it keep working.
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          // Responses that set auth cookies must not be cached.
          for (const [key, value] of Object.entries(headers ?? {})) {
            response.headers.set(key, value);
          }
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims: it refreshes the
  // session, and anything in between can log users out randomly.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  if (!isLoggedIn && isProtectedPath(pathname)) {
    return redirectKeepingCookies(request, response, loginPathFor(pathname + search));
  }
  if (isLoggedIn && isLoggedOutOnlyPath(pathname)) {
    return redirectKeepingCookies(request, response, AFTER_LOGIN_PATH);
  }

  return response;
}

/** A redirect that keeps refreshed session cookies, so the session isn't lost. */
function redirectKeepingCookies(request: NextRequest, from: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  for (const cookie of from.cookies.getAll()) redirect.cookies.set(cookie);
  return redirect;
}
