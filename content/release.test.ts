import { describe, expect, it } from "vitest";

import { imprint, privacyPolicy, siteOperator } from "@/content/legal-pages";
import { findPlaceholders, isPublicSiteUrl } from "@/lib/content/placeholders";

// Blocks going live with unfinished legal pages. Runs before every build
// (npm run content:check). It only applies when the site URL of the build is a
// public address, so local development and CI (localhost) are not affected.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const legalPages = { siteOperator, privacyPolicy, imprint };

describe.runIf(isPublicSiteUrl(siteUrl))(`release checks for ${siteUrl}`, () => {
  it("has no placeholders left in the imprint and privacy policy", () => {
    expect(findPlaceholders(legalPages)).toEqual([]);
  });

  it("has a reviewed privacy policy (draft: false)", () => {
    expect(privacyPolicy.draft).toBe(false);
  });
});
