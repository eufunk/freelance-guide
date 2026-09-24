import "server-only";

import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

import type { Json, Tables } from "./database.types";

export type Calculator = "hourly-rate" | "project-price";
export type CalculatorResult = Tables<"calculator_results">;

/** The current user's latest result for a calculator, or null. */
export async function getCalculatorResult(
  calculator: Calculator,
  returnPath: string,
): Promise<CalculatorResult | null> {
  const user = await requireUser(returnPath);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calculator_results")
    .select("*")
    .eq("user_id", user.id)
    .eq("calculator", calculator)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Saves the latest result, replacing the previous one. */
export async function saveCalculatorResult(
  calculator: Calculator,
  inputs: { [key: string]: Json },
  result: number,
  returnPath: string,
): Promise<void> {
  const user = await requireUser(returnPath);
  const supabase = await createClient();
  const { error } = await supabase
    .from("calculator_results")
    .upsert({ user_id: user.id, calculator, inputs, result });
  if (error) throw error;
}
