import { useId } from "react";

type RadioCardsProps = {
  name: string;
  legend: string;
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  /** Two columns from small screens up, for short options like Ja/Nein. */
  compact?: boolean;
};

/** A radio group shown as large, tappable cards. Uses native radios for accessibility. */
export function RadioCards({
  name,
  legend,
  options,
  value,
  onChange,
  errors,
  compact,
}: RadioCardsProps) {
  const errorId = `${useId()}-error`;

  return (
    <fieldset
      aria-describedby={errors?.length ? errorId : undefined}
      aria-invalid={errors?.length ? true : undefined}
      className="space-y-2"
    >
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className={compact ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 has-checked:border-foreground has-checked:bg-muted/60 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 size-4 shrink-0 accent-foreground"
            />
            <span className="space-y-0.5">
              <span className="block font-medium">{option.label}</span>
              {option.description && (
                <span className="block text-sm text-muted-foreground">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {errors?.length ? (
        <p id={errorId} className="text-sm text-destructive">
          {errors.join(" ")}
        </p>
      ) : null}
    </fieldset>
  );
}
