import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading } from "@/app/(auth)/auth-heading";
import { SignUpForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Registrieren" };

export default function SignUpPage() {
  return (
    <>
      <AuthHeading
        title="Konto erstellen"
        description="Kostenlos. Danach zeigen wir dir Schritt für Schritt, was als Nächstes zu tun ist."
      />
      <SignUpForm />
      <p className="mt-6 text-sm text-muted-foreground">
        Schon registriert?{" "}
        <Link
          href="/anmelden"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Anmelden
        </Link>
      </p>
    </>
  );
}
