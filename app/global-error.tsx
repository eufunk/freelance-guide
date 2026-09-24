"use client"; // Error boundaries must be Client Components

// Replaces the root layout when it fails, so it cannot rely on globals.css
// or the layout components. Keep it self-contained.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: "2rem 1rem" }}>
        <title>Fehler | Freelance Guide</title>
        <h1 style={{ fontSize: "1.5rem" }}>Etwas ist schiefgelaufen</h1>
        <p>Bitte lade die Seite neu oder versuche es später noch einmal.</p>
        <button
          onClick={() => retry()}
          style={{ minHeight: 44, padding: "0 1.25rem", fontSize: "1rem" }}
        >
          Erneut versuchen
        </button>
        {error.digest && <p style={{ color: "#666" }}>Fehler-ID: {error.digest}</p>}
      </body>
    </html>
  );
}
