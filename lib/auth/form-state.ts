import type { FieldErrors } from "./validation";

/** Result of an auth Server Function, shown by the form. */
export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; message?: string; fieldErrors?: FieldErrors; email?: string }
  | { status: "success"; message: string };

export const initialAuthFormState: AuthFormState = { status: "idle" };
