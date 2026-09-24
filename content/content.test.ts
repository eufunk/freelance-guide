import { describe, expect, it } from "vitest";

import { content, getAllTasks } from "@/lib/content";

// Runs before every build (npm run content:check), so broken content never ships.
describe("content", () => {
  it("has the 15 roadmap stages in the planned order", () => {
    expect(content.roadmap.map((stage) => stage.id)).toEqual([
      "define-skills",
      "choose-service",
      "define-target-customer",
      "build-portfolio",
      "define-pricing",
      "prepare-profile",
      "business-basics",
      "find-clients",
      "contact-clients",
      "create-offer",
      "close-project",
      "deliver-project",
      "invoice-client",
      "collect-testimonial",
      "improve-repeat",
    ]);
  });

  // User progress in the database refers to these IDs. If this test fails
  // because an ID was renamed or removed, add a new ID instead and keep the old
  // one, or plan a data migration. Only update the snapshot for added IDs.
  it("keeps all task IDs stable", () => {
    expect(getAllTasks().map((task) => `${task.stageId}/${task.id}`)).toMatchSnapshot();
  });
});
