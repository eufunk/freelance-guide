// Reads the emails the local Supabase stack sends to Mailpit.
// Requires the local database: npm run db:start

const MAILPIT_URL = "http://127.0.0.1:54324";

type MailpitSummary = { ID: string; Subject: string };

async function search(to: string): Promise<MailpitSummary[]> {
  let response: Response;
  try {
    response = await fetch(
      `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`,
    );
  } catch {
    throw new Error("Mailpit is not reachable. Start the local database with: npm run db:start");
  }
  const body = (await response.json()) as { messages: MailpitSummary[] };
  return body.messages;
}

/** Waits for an email to `to` whose subject contains `subject` and returns its HTML. */
export async function waitForEmail(to: string, subject: string): Promise<string> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const message = (await search(to)).find((m) => m.Subject.includes(subject));
    if (message) {
      const response = await fetch(`${MAILPIT_URL}/api/v1/message/${message.ID}`);
      const body = (await response.json()) as { HTML: string };
      return body.HTML;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No email "${subject}" to ${to} arrived`);
}

/**
 * The path of the /auth/confirm link in an email. Emails link to the configured
 * site URL (port 3200); tests open the path on their own server instead.
 */
export function confirmPathFrom(html: string): string {
  const match = html.match(/href="([^"]*\/auth\/confirm[^"]*)"/);
  if (!match?.[1]) throw new Error("No confirmation link in email");
  const url = new URL(match[1].replaceAll("&amp;", "&"));
  return url.pathname + url.search;
}
