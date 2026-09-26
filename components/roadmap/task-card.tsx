import { CheckCircle2, Circle, CircleDot, Clock } from "lucide-react";

import { SubmitButton } from "@/components/roadmap/submit-button";
import type { Task } from "@/lib/content/schema";
import { formatDate, formatDuration } from "@/lib/format";
import { changeTaskStatus } from "@/lib/progress/actions";
import type { TaskProgress } from "@/lib/progress/roadmap-progress";
import type { TaskStatus } from "@/lib/progress/task-progress";
import { cn } from "@/lib/utils";

function StatusAction({
  task,
  status,
  label,
  variant,
}: {
  task: Task;
  status: TaskStatus;
  label: string;
  variant?: "default" | "outline";
}) {
  return (
    <form action={changeTaskStatus}>
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="status" value={status} />
      {/* The accessible name starts with the visible label and adds the task. */}
      <SubmitButton variant={variant} aria-label={`${label}: ${task.title}`}>
        {label}
      </SubmitButton>
    </form>
  );
}

/** A task with its status and the actions start, complete and reopen. */
export function TaskCard({ task, progress }: { task: Task; progress: TaskProgress | undefined }) {
  const status = progress?.status ?? "todo";

  return (
    <li
      className={cn(
        "space-y-3 rounded-xl border p-4",
        status === "completed" && "bg-muted/40",
        status === "in_progress" && "border-foreground/40",
      )}
    >
      <div className="flex gap-3">
        {status === "completed" ? (
          <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        ) : status === "in_progress" ? (
          <CircleDot aria-hidden className="mt-0.5 size-5 shrink-0" />
        ) : (
          <Circle aria-hidden className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        )}
        <div className="flex-1 space-y-1">
          <h3 className={cn("font-medium", status === "completed" && "text-muted-foreground")}>
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" />
              {formatDuration(task.estimatedMinutes)}
            </span>
            <span className="font-medium text-foreground">
              {status === "completed"
                ? `Erledigt${progress?.completedAt ? ` am ${formatDate(progress.completedAt)}` : ""}`
                : status === "in_progress"
                  ? "In Arbeit"
                  : "Offen"}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pl-8">
        {status === "todo" && (
          <StatusAction task={task} status="in_progress" label="Starten" variant="outline" />
        )}
        {status !== "completed" && <StatusAction task={task} status="completed" label="Erledigt" />}
        {status === "completed" && (
          <StatusAction task={task} status="todo" label="Wieder öffnen" variant="outline" />
        )}
      </div>
    </li>
  );
}
