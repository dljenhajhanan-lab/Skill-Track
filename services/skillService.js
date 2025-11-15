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

export const linkSkillItemService = async (profileId, skillId, itemId, type) => {
  const skill = await Skill.findOne({ _id: skillId, profile: profileId });
  if (!skill) throw new AppError("Skill not found", 404);
  if (type === "project" && !skill.linkedProjects.includes(itemId)) {
    skill.linkedProjects.push(itemId);
  } else if (type === "achievement" && !skill.linkedAchievements.includes(itemId)) {
    skill.linkedAchievements.push(itemId);
  } else if (type === "certificate" && !skill.linkedCertificates.includes(itemId)) {
    skill.linkedCertificates.push(itemId);
  } else {
    throw new AppError("Invalid or duplicate link type", 400);
  }

  await skill.save();
  const updatedSkill = await Skill.findById(skill._id)
    .populate("linkedProjects linkedAchievements linkedCertificates");
  const badge = await checkAndAssignBadge(profileId, updatedSkill._id);

  return { skill: updatedSkill, badge };
};


export const getMySkillsService = async (profileId) => {
  const skills = await Skill.find({ profile: profileId })
    .populate("linkedProjects linkedAchievements linkedCertificates");
  return skills;
};
