import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading } from "@/app/(auth)/auth-heading";
import { PasswordResetRequestForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Passwort vergessen" };

export default function PasswordResetRequestPage() {
  return (
    <>
      <AuthHeading
        title="Passwort vergessen"
        description="Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link, mit dem du ein neues Passwort festlegen kannst."
      />
      <PasswordResetRequestForm />
      <p className="mt-6 text-sm text-muted-foreground">
        <Link
          href="/anmelden"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Zurück zur Anmeldung
        </Link>
      </p>
    </>
  );
}
