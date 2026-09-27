"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { countOpenGaps } from "@/lib/templates/fill";
import { recordTemplateCopy } from "@/lib/tracking/actions";

type CopyState = "idle" | "copied" | "failed";

/** Edit a template in the browser and copy it. Nothing is saved. */
export function TemplateEditor({
  templateId,
  initialText,
}: {
  templateId: string;
  initialText: string;
}) {
  const [text, setText] = useState(initialText);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaId = useId();
  const statusId = useId();

  const openGaps = countOpenGaps(text);
  const changed = text !== initialText;

  // Show the copy feedback for a few seconds.
  useEffect(() => {
    if (copyState !== "copied") return;
    const timeout = setTimeout(() => setCopyState("idle"), 4000);
    return () => clearTimeout(timeout);
  }, [copyState]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      void recordTemplateCopy(templateId);
    } catch {
      // No clipboard access (e.g. denied permission): select the text for manual copying.
      textareaRef.current?.focus();
      textareaRef.current?.select();
      setCopyState("failed");
    }
  }

  function reset() {
    if (!window.confirm("Deine Änderungen an diesem Text gehen verloren. Zurücksetzen?")) return;
    setText(initialText);
    setCopyState("idle");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={textareaId} className="font-medium">
          Dein Text
        </label>
        <p id={statusId} aria-live="polite" className="text-sm text-muted-foreground">
          {openGaps === 0
            ? "Keine offenen Stellen in Klammern mehr"
            : `Noch ${openGaps} ${openGaps === 1 ? "Stelle" : "Stellen"} in Klammern anzupassen`}
        </p>
      </div>

      <textarea
        ref={textareaRef}
        id={textareaId}
        aria-describedby={statusId}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (copyState !== "idle") setCopyState("idle");
        }}
        spellCheck
        lang="de"
        className="field-sizing-content min-h-80 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-base leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
      />

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={copy}>
          {copyState === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copyState === "copied" ? "Kopiert" : "Text kopieren"}
        </Button>
        <Button type="button" variant="outline" onClick={reset} disabled={!changed}>
          <RotateCcw aria-hidden />
          Zurücksetzen
        </Button>
      </div>

      <p role="status" className="text-sm">
        {copyState === "copied" && "Der Text ist in der Zwischenablage."}
        {copyState === "failed" &&
          "Kopieren hat nicht geklappt. Der Text ist markiert – kopiere ihn mit Strg+C (Mac: Cmd+C) oder über das Menü deines Handys."}
      </p>
    </div>
  );
}
