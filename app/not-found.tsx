import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer
      title="Seite nicht gefunden"
      description="Diese Seite gibt es nicht (mehr). Vielleicht hat sich die Adresse geändert."
    >
      <Link href="/" className={buttonVariants()}>
        Zur Startseite
      </Link>
    </PageContainer>
  );
}
