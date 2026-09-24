import type { Metadata } from "next";

import { AuthHeading } from "@/app/(auth)/auth-heading";
import { NewPasswordForm } from "@/components/auth/auth-forms";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Neues Passwort" };

// Reached through the link in the password reset email, which logs the user in.
export default async function NewPasswordPage() {
  await requireUser("/passwort-neu");

  return (
    <>
      <AuthHeading title="Neues Passwort festlegen" />
      <NewPasswordForm />
    </>
  );
}
