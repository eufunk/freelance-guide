"use client";

import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { changePassword, deleteAccount } from "@/lib/auth/actions";
import { initialAuthFormState, type AuthFormState } from "@/lib/auth/form-state";
import { PASSWORD_HINT } from "@/lib/auth/validation";

function errorsOf(state: AuthFormState, field: string) {
  return state.status === "error" ? state.fieldErrors?.[field] : undefined;
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initialAuthFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.status === "success" && <FormMessage type="success">{state.message}</FormMessage>}
      {state.status === "error" && state.message && (
        <FormMessage type="error">{state.message}</FormMessage>
      )}
      <FormField
        name="currentPassword"
        label="Aktuelles Passwort"
        type="password"
        autoComplete="current-password"
        required
        errors={errorsOf(state, "currentPassword")}
      />
      <FormField
        name="password"
        label="Neues Passwort"
        type="password"
        autoComplete="new-password"
        required
        hint={PASSWORD_HINT}
        errors={errorsOf(state, "password")}
      />
      <FormField
        name="passwordConfirmation"
        label="Neues Passwort wiederholen"
        type="password"
        autoComplete="new-password"
        required
        errors={errorsOf(state, "passwordConfirmation")}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Wird gespeichert …" : "Passwort ändern"}
      </Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, initialAuthFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.status === "error" && state.message && (
        <FormMessage type="error">{state.message}</FormMessage>
      )}
      <FormField
        name="currentPassword"
        label="Zur Bestätigung: dein Passwort"
        type="password"
        autoComplete="current-password"
        required
        errors={errorsOf(state, "currentPassword")}
      />
      <Button type="submit" variant="destructive" disabled={pending}>
        {pending ? "Wird gelöscht …" : "Konto endgültig löschen"}
      </Button>
    </form>
  );
}
