import type { OnboardingRulesInput } from "@/lib/content/schema";

// Which roadmap stages onboarding proposes as "already done" (see Phase 5 in
// guide/ToDo.docx). The user confirms or removes them. The entry stage is the
// first stage that is not done.
export const onboardingRules = {
  proposedDoneByGoal: {
    "become-freelancer": [],
    "first-client": ["define-skills", "choose-service", "define-target-customer"],
    "more-clients": [
      "define-skills",
      "choose-service",
      "define-target-customer",
      "build-portfolio",
      "define-pricing",
      "prepare-profile",
      "business-basics",
    ],
  },
  proposedDoneByFlag: {
    hasPortfolio: ["build-portfolio"],
    hasFreelanceExperience: ["business-basics"],
  },
} satisfies OnboardingRulesInput;
