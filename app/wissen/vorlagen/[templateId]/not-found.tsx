import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function TemplateNotFound() {
  return (
    <PageContainer title="Vorlage nicht gefunden" description="Diese Vorlage gibt es nicht.">
      <Link href="/wissen/vorlagen" className={buttonVariants()}>
        Alle Vorlagen
      </Link>
    </PageContainer>
  );
}
