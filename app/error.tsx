"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer
      title="Etwas ist schiefgelaufen"
      description="Das lag nicht an dir. Bitte versuche es noch einmal."
    >
      <Button onClick={() => retry()}>Erneut versuchen</Button>
      {error.digest && (
        <p className="mt-4 text-sm text-muted-foreground">Fehler-ID: {error.digest}</p>
      )}
    </PageContainer>
  );
}
