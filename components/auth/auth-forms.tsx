"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { requestPasswordReset, signIn, signUp, updatePassword } from "@/lib/auth/actions";
import { initialAuthFormState, type AuthFormState } from "@/lib/auth/form-state";
import { PASSWORD_HINT } from "@/lib/auth/validation";

function errorsOf(state: AuthFormState, field: string) {
  return state.status === "error" ? state.fieldErrors?.[field] : undefined;
}

function emailOf(state: AuthFormState) {
  return state.status === "error" ? state.email : undefined;
}

function StateMessage({ state }: { state: AuthFormState }) {
  if (state.status === "error" && state.message) {
    return <FormMessage type="error">{state.message}</FormMessage>;
  }
  if (state.status === "success") return <FormMessage type="success">{state.message}</FormMessage>;
  return null;
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialAuthFormState);

  if (state.status === "success") return <StateMessage state={state} />;

  return (
    <form action={action} className="space-y-5" noValidate>
      <StateMessage state={state} />
      <FormField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={emailOf(state)}
        errors={errorsOf(state, "email")}
      />
      <FormField
        name="password"
        label="Passwort"
        type="password"
        autoComplete="new-password"
        required
        hint={PASSWORD_HINT}
        errors={errorsOf(state, "password")}
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird registriert …" : "Konto erstellen"}
      </Button>
    </form>
  );
}

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, initialAuthFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      <StateMessage state={state} />
      {next && <input type="hidden" name="next" value={next} />}
      <FormField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={emailOf(state)}
        errors={errorsOf(state, "email")}
      />
      <div className="space-y-2">
        <FormField
          name="password"
          label="Passwort"
          type="password"
          autoComplete="current-password"
          required
          errors={errorsOf(state, "password")}
        />
        <Link
          href="/passwort-vergessen"
          className="inline-block py-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Passwort vergessen?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird angemeldet …" : "Anmelden"}
      </Button>
    </form>
  );
}

export function PasswordResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialAuthFormState);

  if (state.status === "success") return <StateMessage state={state} />;

  return (
    <form action={action} className="space-y-5" noValidate>
      <StateMessage state={state} />
      <FormField
        name="email"
        label="E-Mail-Adresse"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={emailOf(state)}
        errors={errorsOf(state, "email")}
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird gesendet …" : "Link senden"}
      </Button>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialAuthFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      <StateMessage state={state} />
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
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Wird gespeichert …" : "Passwort speichern"}
      </Button>
    </form>
  );
}
