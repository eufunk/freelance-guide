"use server";

import { z } from "zod";

import { getTemplate } from "@/lib/content";
import { recordEvent } from "@/lib/db/events";

import { trackedCalculators } from "./events";

// Called from the browser. Only logged-in users are recorded (see recordEvent);
// IDs are checked so no arbitrary data ends up in the events table.

export async function recordCalculatorUse(calculator: string): Promise<void> {
  const parsed = z.enum(trackedCalculators).safeParse(calculator);
  if (!parsed.success) return;
  await recordEvent("calculator_used", { calculator: parsed.data });
}

export async function recordTemplateCopy(templateId: string): Promise<void> {
  if (typeof templateId !== "string" || !getTemplate(templateId)) return;
  await recordEvent("template_copied", { templateId });
}
