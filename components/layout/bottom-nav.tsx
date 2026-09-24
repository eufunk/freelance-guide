"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navIcons } from "@/components/layout/nav-icons";
import { isActivePath, mainNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Mobile navigation, fixed to the bottom of the screen. Hidden from md upwards. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hauptnavigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {mainNavigation.map((item) => {
          const Icon = navIcons[item.href];
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground",
                  active && "text-foreground",
                )}
              >
                <Icon aria-hidden className="size-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
