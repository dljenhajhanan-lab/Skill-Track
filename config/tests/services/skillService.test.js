import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/skill.js", () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../services/badgeService.js", () => ({
  checkAndAssignBadge: jest.fn(),
}));


const {
  createSkillService,
  linkSkillItemService,
  getMySkillsService,
  getSkillByIdService,
} = await import("../../../services/skillService.js");

const Skill = (await import("../../../models/skill.js")).default;
const { checkAndAssignBadge } = await import(
  "../../../services/badgeService.js"
);

describe("skillService", () => {
  it("creates new skill", async () => {
    Skill.findOne.mockResolvedValue(null);
    Skill.create.mockResolvedValue({ name: "React" });

    const skill = await createSkillService("profile1", {
      name: "React",
      description: "Frontend",
      level: "beginner",
    });

    expect(skill.name).toBe("React");
  });

  it("links project to skill and assigns badge", async () => {
    const skill = {
      _id: "skill1",
      profile: "profile1",
      linkedProjects: [],
      linkedAchievements: [],
      linkedCertificates: [],
      save: jest.fn(),
    };

    Skill.findOne.mockResolvedValue(skill);

    Skill.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(skill),
    });

    checkAndAssignBadge.mockResolvedValue({ level: "bronze" });

    const result = await linkSkillItemService(
      "profile1",
      "skill1",
      "project1",
      "project"
    );

    expect(skill.save).toHaveBeenCalled();
    expect(result.badge.level).toBe("bronze");
  });

  it("gets my skills", async () => {
    Skill.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ name: "Node" }]),
    });

    const skills = await getMySkillsService("profile1");

    expect(skills.length).toBe(1);
  });

  it("gets skill by id", async () => {
    Skill.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ name: "MongoDB" }),
    });

    const skill = await getSkillByIdService("profile1", "skill1");

    expect(skill.name).toBe("MongoDB");
  });
});
