/** Result of saving the onboarding, shown by the form. On success it redirects. */
export type OnboardingFormState =
  { status: "idle" } | { status: "error"; fieldErrors: Partial<Record<string, string[]>> };

export const initialOnboardingFormState: OnboardingFormState = { status: "idle" };
