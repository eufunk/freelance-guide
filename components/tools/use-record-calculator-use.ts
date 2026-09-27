import { useEffect, useRef } from "react";

import { recordCalculatorUse } from "@/lib/tracking/actions";
import type { TrackedCalculator } from "@/lib/tracking/events";

/**
 * Records calculator_used once per page view, as soon as `used` is true (the user
 * entered something and got a valid result). Prefilled values alone do not count.
 */
export function useRecordCalculatorUse(calculator: TrackedCalculator, used: boolean) {
  const recorded = useRef(false);
  useEffect(() => {
    if (!used || recorded.current) return;
    recorded.current = true;
    void recordCalculatorUse(calculator);
  }, [calculator, used]);
}
