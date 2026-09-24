import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/dal";

/** Login link for logged-out visitors. Logged-in users find logout under "Profil". */
export async function HeaderAuth() {
  const user = await getCurrentUser();
  if (user) return null;

  return (
    <Link href="/anmelden" className={buttonVariants({ variant: "outline" })}>
      Anmelden
    </Link>
  );
}
