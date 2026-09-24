// Placeholders in content that must be filled before going live, written as
// [[PLATZHALTER: what to fill in]].

const PLACEHOLDER = /\[\[PLATZHALTER:\s*([^\]]*?)\s*\]\]/g;

/** Descriptions of all placeholders in a value (strings, arrays and objects, recursively). */
export function findPlaceholders(value: unknown): string[] {
  if (typeof value === "string") {
    return [...value.matchAll(PLACEHOLDER)].map((match) => match[1] ?? "");
  }
  if (Array.isArray(value)) return value.flatMap(findPlaceholders);
  if (value && typeof value === "object") return Object.values(value).flatMap(findPlaceholders);
  return [];
}

export type TextSegment = { text: string; placeholder: boolean };

/** Splits text into plain parts and placeholders, so placeholders can be highlighted. */
export function splitPlaceholders(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(PLACEHOLDER)) {
    if (match.index > last)
      segments.push({ text: text.slice(last, match.index), placeholder: false });
    segments.push({ text: match[1] ?? "", placeholder: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), placeholder: false });
  return segments;
}

/** True for a site URL that other people can reach, i.e. not localhost. */
export function isPublicSiteUrl(siteUrl: string | undefined): boolean {
  if (!siteUrl) return false;
  try {
    const { hostname } = new URL(siteUrl);
    return !["localhost", "127.0.0.1", "[::1]", "::1"].includes(hostname);
  } catch {
    return false;
  }
}
