import Skill from "../models/skill.js";
import { AppError } from "../utils/appError.js";
import { checkAndAssignBadge } from "./badgeService.js";

export const createSkillService = async (profileId, data) => {
  const { name, description, level } = data;

  const existing = await Skill.findOne({ profile: profileId, name: name.trim() });
  if (existing) throw new AppError("You already have this skill", 400);

  const skill = await Skill.create({
    profile: profileId,
    name: name.trim(),
    description,
    level,
  });

  return skill;
};

export const linkSkillItemService = async (
  profileId,
  skillIdParam,
  itemId,
  type,
  skillIdsBody = []
) => {
  const skillIds = [
    ...new Set([
      ...(skillIdsBody || []),
      ...(skillIdParam ? [skillIdParam] : []),
    ]),
  ];

  if (skillIds.length === 0) {
    throw new AppError("No skills provided", 400);
  }

  const updatedSkills = [];
  const badges = [];

  for (const skillId of skillIds) {
    const skill = await Skill.findOne({ _id: skillId, profile: profileId });
    if (!skill) continue;

    if (type === "project" && !skill.linkedProjects.includes(itemId)) {
      skill.linkedProjects.push(itemId);
    } else if (type === "achievement" && !skill.linkedAchievements.includes(itemId)) {
      skill.linkedAchievements.push(itemId);
    } else if (type === "certificate" && !skill.linkedCertificates.includes(itemId)) {
      skill.linkedCertificates.push(itemId);
    } else {
      continue;
    }

    await skill.save();

    const populatedSkill = await Skill.findById(skill._id)
      .populate("linkedProjects linkedAchievements linkedCertificates");

    const badge = await checkAndAssignBadge(profileId, skill._id);

    updatedSkills.push(populatedSkill);
    if (badge) badges.push(badge);
  }

  return { skills: updatedSkills, badges };
};


export const getMySkillsService = async (profileId) => {
  const skills = await Skill.find({ profile: profileId })
    .populate("linkedProjects linkedAchievements linkedCertificates");
  return skills;
};

export const getSkillByIdService = async (profileId, skillId) => {
  const skill = await Skill.findOne({
    _id: skillId,
    profile: profileId,
  }).populate("linkedProjects linkedAchievements linkedCertificates");

  if (!skill) {
    throw new AppError("Skill not found", 404);
  }
  return skill;
};
