import Link from "next/link";

import { legalNavigation } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Freelance Guide</p>
        <ul className="flex gap-4">
          {legalNavigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="inline-block py-2 hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
