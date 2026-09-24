// German messages for Supabase Auth error codes.
// Codes: https://supabase.com/docs/guides/auth/debugging/error-codes

const messages: Record<string, string> = {
  invalid_credentials: "E-Mail-Adresse oder Passwort ist falsch.",
  email_not_confirmed:
    "Bitte bestätige zuerst deine E-Mail-Adresse. Den Link dazu haben wir dir per E-Mail geschickt.",
  weak_password: "Das Passwort ist zu schwach. Mindestens 8 Zeichen, mit Buchstaben und Zahlen.",
  same_password: "Das neue Passwort muss sich vom bisherigen unterscheiden.",
  over_email_send_rate_limit:
    "Wir haben dir gerade erst eine E-Mail geschickt. Bitte warte kurz und versuche es dann erneut.",
  over_request_rate_limit: "Zu viele Versuche. Bitte warte einen Moment und versuche es erneut.",
  signup_disabled: "Die Registrierung ist im Moment nicht möglich.",
  otp_expired: "Der Link ist abgelaufen. Bitte fordere einen neuen an.",
};

export const GENERIC_AUTH_ERROR = "Das hat leider nicht geklappt. Bitte versuche es erneut.";

export function authErrorMessage(code: string | undefined): string {
  return code !== undefined && Object.hasOwn(messages, code) ? messages[code]! : GENERIC_AUTH_ERROR;
}
