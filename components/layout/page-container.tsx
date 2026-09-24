import { cn } from "@/lib/utils";

type PageContainerProps = {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

/** Consistent page width, padding and heading for every page. */
export function PageContainer({ title, description, className, children }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 py-6 md:py-10", className)}>
      {title && (
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
