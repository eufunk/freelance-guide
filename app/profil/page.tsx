import type { Metadata } from "next";
import Link from "next/link";

import { ChangePasswordForm, DeleteAccountForm } from "@/components/auth/account-forms";
import { PageContainer } from "@/components/layout/page-container";
import { SettingsSection } from "@/components/layout/settings-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const user = await requireUser("/profil");

  return (
    <PageContainer title="Profil">
      <div className="max-w-2xl space-y-6">
        <SettingsSection title="Konto">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Angemeldet als</p>
            <p className="font-medium break-all">{user.email}</p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Abmelden
            </Button>
          </form>
        </SettingsSection>

        <SettingsSection
          title="Deine Angaben"
          description="Hat sich etwas geändert – zum Beispiel dein Ziel oder deine Erfahrung? Beantworte die Fragen aus dem Onboarding neu. Aufgaben, die du selbst erledigt hast, bleiben dabei erhalten."
        >
          <Link href="/onboarding" className={buttonVariants({ variant: "outline" })}>
            Angaben ändern
          </Link>
        </SettingsSection>

        <SettingsSection title="Passwort ändern">
          <ChangePasswordForm />
        </SettingsSection>

        <SettingsSection
          title="Konto löschen"
          description="Dein Konto und alle deine Daten – Angaben, Fortschritt und gespeicherte Berechnungen – werden sofort und endgültig gelöscht. Das lässt sich nicht rückgängig machen."
          danger
        >
          <DeleteAccountForm />
        </SettingsSection>
      </div>
    </PageContainer>
  );
}
