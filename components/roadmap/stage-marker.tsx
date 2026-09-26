import { Check } from "lucide-react";

import type { StageStatus } from "@/lib/progress/roadmap-progress";
import { cn } from "@/lib/utils";

/** Circle with the stage number, or a check mark when the stage is done. */
export function StageMarker({
  order,
  status,
  current,
}: {
  order: number;
  status: StageStatus;
  current: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
        status === "completed" && "border-emerald-600 bg-emerald-600 text-white",
        current && "border-foreground bg-foreground text-background",
      )}
    >
      {status === "completed" ? <Check className="size-4" /> : order}
    </span>
  );
}
