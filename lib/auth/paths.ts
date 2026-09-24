// Route rules for authentication. Pure functions, used by proxy.ts and the
// auth pages.

export const LOGIN_PATH = "/anmelden";
export const AFTER_LOGIN_PATH = "/dashboard";

/** Pages that require a logged-in user. */
const PROTECTED_PATHS = ["/dashboard", "/roadmap", "/profil", "/passwort-neu"];

/** Pages that make no sense when logged in; they redirect to the dashboard. */
const LOGGED_OUT_ONLY_PATHS = ["/anmelden", "/registrieren"];

function matches(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function isProtectedPath(pathname: string): boolean {
  return matches(pathname, PROTECTED_PATHS);
}

export function isLoggedOutOnlyPath(pathname: string): boolean {
  return matches(pathname, LOGGED_OUT_ONLY_PATHS);
}

/**
 * Returns `next` if it is a safe path inside this app, otherwise the fallback.
 * Prevents open redirects such as ?next=https://evil.example or ?next=//evil.example.
 */
export function safeNextPath(next: unknown, fallback = AFTER_LOGIN_PATH): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(next)) return fallback;
  return next;
}

/** Login URL that returns to `pathname` afterwards. */
export function loginPathFor(pathname: string): string {
  return `${LOGIN_PATH}?next=${encodeURIComponent(pathname)}`;
}
