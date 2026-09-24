import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading } from "@/app/(auth)/auth-heading";
import { SignInForm } from "@/components/auth/auth-forms";
import { FormMessage } from "@/components/auth/form-message";
import { safeNextPath } from "@/lib/auth/paths";

export const metadata: Metadata = { title: "Anmelden" };

export default async function SignInPage({ searchParams }: PageProps<"/anmelden">) {
  const { next, fehler } = await searchParams;

  return (
    <>
      <AuthHeading title="Anmelden" description="Schön, dass du wieder da bist." />
      {fehler === "link" && (
        <div className="mb-5">
          <FormMessage type="error">
            Der Link ist ungültig oder abgelaufen. Melde dich an oder fordere einen neuen Link an.
          </FormMessage>
        </div>
      )}
      <SignInForm next={typeof next === "string" ? safeNextPath(next) : undefined} />
      <p className="mt-6 text-sm text-muted-foreground">
        Noch kein Konto?{" "}
        <Link
          href="/registrieren"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Jetzt registrieren
        </Link>
      </p>
    </>
  );
}
