import { Compass, LayoutDashboard, type LucideIcon, User, Wrench, FileText } from "lucide-react";

import type { mainNavigation } from "@/lib/navigation";

type MainHref = (typeof mainNavigation)[number]["href"];

export const navIcons: Record<MainHref, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/roadmap": Compass,
  "/tools": Wrench,
  "/vorlagen": FileText,
  "/profil": User,
};
