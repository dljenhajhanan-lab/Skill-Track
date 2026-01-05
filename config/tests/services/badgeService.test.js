import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/skill.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/badge.js", () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const { checkAndAssignBadge, recalculateSkillBadge } = await import(
  "../../../services/badgeService.js"
);

const Skill = (await import("../../../models/skill.js")).default;
const Badge = (await import("../../../models/badge.js")).default;

describe("badgeService", () => {
  it("creates new badge if not exists", async () => {
    const mockSkill = {
      _id: "skill1",
      name: "JavaScript",
      linkedProjects: [1, 2, 3, 4],
      linkedAchievements: [1, 2, 3, 4],
      linkedCertificates: [1],
    };

    Skill.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSkill),
    });

    Badge.findOne.mockResolvedValue(null);

    Badge.create.mockResolvedValue({
      level: "gold",
    });

    const badge = await checkAndAssignBadge("profile1", "skill1");

    expect(Badge.create).toHaveBeenCalled();
    expect(badge.level).toBe("gold");
  });

  it("updates badge level when changed", async () => {
    const mockSkill = {
      _id: "skill1",
      name: "Node",
      linkedProjects: [1, 2],
      linkedAchievements: [1, 2],
      linkedCertificates: [],
    };

    Skill.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockSkill),
    });

    const badge = {
      level: "bronze",
      save: jest.fn(),
    };

    Badge.findOne.mockResolvedValue(badge);

    await recalculateSkillBadge("profile1", "skill1");

    expect(badge.save).toHaveBeenCalled();
    expect(badge.level).toBe("silver");
  });
});
