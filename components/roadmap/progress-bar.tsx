type ProgressBarProps = { value: number; max: number; label: string };

/** Progress bar with its value readable by screen readers. */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={`${value} von ${max} (${percent} %)`}
      className="h-2 overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full rounded-full bg-foreground" style={{ width: `${percent}%` }} />
    </div>
  );
}
