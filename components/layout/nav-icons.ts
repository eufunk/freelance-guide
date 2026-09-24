import { BookOpen, Compass, LayoutDashboard, type LucideIcon, User, Wrench } from "lucide-react";

import type { mainNavigation } from "@/lib/navigation";

type MainHref = (typeof mainNavigation)[number]["href"];

export const navIcons: Record<MainHref, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/roadmap": Compass,
  "/tools": Wrench,
  "/wissen": BookOpen,
  "/profil": User,
};
