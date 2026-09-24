"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { getCurrentUser } from "./dal";
import { authErrorMessage } from "./errors";
import type { AuthFormState } from "./form-state";
import { AFTER_LOGIN_PATH, safeNextPath } from "./paths";
import {
  fieldErrorsOf,
  newPasswordSchema,
  passwordResetRequestSchema,
  signInSchema,
  signUpSchema,
} from "./validation";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signUp(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsOf(parsed.error),
      email: field(formData, "email"),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(parsed.data);
  if (error) {
    return { status: "error", message: authErrorMessage(error.code), email: parsed.data.email };
  }

  // Same answer whether or not the address is already registered, so the form
  // doesn't reveal who has an account.
  return {
    status: "success",
    message: `Fast geschafft! Wir haben dir eine E-Mail an ${parsed.data.email} geschickt. Klicke auf den Link darin, um dein Konto zu bestätigen.`,
  };
}

export async function signIn(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: field(formData, "email"),
    password: field(formData, "password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsOf(parsed.error),
      email: field(formData, "email"),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { status: "error", message: authErrorMessage(error.code), email: parsed.data.email };
  }

  redirect(safeNextPath(field(formData, "next")));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = passwordResetRequestSchema.safeParse({ email: field(formData, "email") });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrorsOf(parsed.error),
      email: field(formData, "email"),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);
  if (error?.code === "over_email_send_rate_limit" || error?.code === "over_request_rate_limit") {
    return { status: "error", message: authErrorMessage(error.code), email: parsed.data.email };
  }

  // Same answer for unknown addresses, so the form doesn't reveal who has an account.
  return {
    status: "success",
    message: `Falls es ein Konto für ${parsed.data.email} gibt, haben wir dir einen Link zum Zurücksetzen geschickt.`,
  };
}

export async function updatePassword(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Der Link ist abgelaufen. Bitte fordere einen neuen an.",
    };
  }

  const parsed = newPasswordSchema.safeParse({
    password: field(formData, "password"),
    passwordConfirmation: field(formData, "passwordConfirmation"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsOf(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: authErrorMessage(error.code) };

  redirect(AFTER_LOGIN_PATH);
}
