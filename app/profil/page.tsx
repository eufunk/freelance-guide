import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Profil" };

// Account basics. Profile editing, re-running onboarding and account deletion
// follow in Phase 4.
export default async function ProfilePage() {
  const user = await requireUser("/profil");

  return (
    <PageContainer title="Profil">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Angemeldet als</p>
          <p className="font-medium break-all">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Abmelden
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
