import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type InfoCardProps = {
  title: string;
  description: string;
  /** Without href the card is not clickable (e.g. "coming soon"). */
  href?: string;
  badge?: string;
};

/** A card for overview pages. The whole card is the link. */
export function InfoCard({ title, description, href, badge }: InfoCardProps) {
  const content = (
    <>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-medium">{title}</h2>
          {badge && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {href && <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />}
    </>
  );

  const className = cn(
    "flex items-center gap-4 rounded-xl border bg-card p-4 text-card-foreground",
    href && "transition-colors hover:bg-muted/50",
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
