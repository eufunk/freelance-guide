export type NavItem = {
  href: string;
  label: string;
};

/** Main navigation. Maximum 5 entries, because it is the bottom bar on mobile. */
export const mainNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/tools", label: "Tools" },
  { href: "/wissen", label: "Wissen" },
  { href: "/profil", label: "Profil" },
] as const satisfies readonly NavItem[];

export const legalNavigation = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
] as const satisfies readonly NavItem[];

/** True if the pathname is the nav item's page or one of its subpages. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
