import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function StageNotFound() {
  return (
    <PageContainer
      title="Stufe nicht gefunden"
      description="Diese Stufe gibt es in der Roadmap nicht."
    >
      <Link href="/roadmap" className={buttonVariants()}>
        Zur Roadmap
      </Link>
    </PageContainer>
  );
}
