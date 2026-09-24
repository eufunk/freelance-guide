import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  title: string;
  description?: string;
  danger?: boolean;
  children: React.ReactNode;
};

/** A titled block on the settings page. */
export function SettingsSection({ title, description, danger, children }: SettingsSectionProps) {
  return (
    <section
      className={cn("space-y-4 rounded-xl border p-4 md:p-6", danger && "border-destructive/40")}
    >
      <div className="space-y-1">
        <h2 className={cn("text-lg font-semibold", danger && "text-destructive")}>{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}
