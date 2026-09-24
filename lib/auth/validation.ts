import { z } from "zod";

// Form validation for authentication. Must match the password rules in
// supabase/config.toml (minimum_password_length, password_requirements).

const email = z
  .string()
  .trim()
  .min(1, "Bitte gib deine E-Mail-Adresse ein.")
  .pipe(z.email("Bitte gib eine gültige E-Mail-Adresse ein."));

export const PASSWORD_HINT = "Mindestens 8 Zeichen, mit Buchstaben und Zahlen.";

const newPassword = z
  .string()
  .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
  .max(72, "Das Passwort darf höchstens 72 Zeichen lang sein.")
  .regex(/\p{L}/u, "Das Passwort muss mindestens einen Buchstaben enthalten.")
  .regex(/\d/, "Das Passwort muss mindestens eine Zahl enthalten.");

export const signUpSchema = z.object({ email, password: newPassword });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Bitte gib dein Passwort ein."),
});

export const passwordResetRequestSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: newPassword, passwordConfirmation: z.string() })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["passwordConfirmation"],
  });

const currentPassword = z.string().min(1, "Bitte gib dein aktuelles Passwort ein.");

export const changePasswordSchema = z
  .object({ currentPassword, password: newPassword, passwordConfirmation: z.string() })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["passwordConfirmation"],
  });

export const deleteAccountSchema = z.object({ currentPassword });

export type FieldErrors = Partial<Record<string, string[]>>;

/** Field errors keyed by field name, for showing them next to the inputs. */
export function fieldErrorsOf(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors;
}
