// German display formats.

/** "ca. 20 Min.", "ca. 1 Std.", "ca. 1,5 Std.", "ca. 8 Std." */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `ca. ${minutes} Min.`;
  const hours = Math.round((minutes / 60) * 2) / 2;
  return `ca. ${hours.toLocaleString("de-DE")} Std.`;
}

/** "26.09.2026" for an ISO timestamp or date, in German time. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}
