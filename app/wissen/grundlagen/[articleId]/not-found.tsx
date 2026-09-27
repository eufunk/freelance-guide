import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function ArticleNotFound() {
  return (
    <PageContainer title="Artikel nicht gefunden" description="Diesen Artikel gibt es nicht.">
      <Link href="/wissen/grundlagen" className={buttonVariants()}>
        Alle Grundlagen
      </Link>
    </PageContainer>
  );
}
