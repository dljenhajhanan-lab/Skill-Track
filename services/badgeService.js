import Badge from "../models/badge.js";
import Skill from "../models/skill.js";

function determineBadgeLevel(skill) {
  const projectsCount = skill.linkedProjects.length;
  const achievementsCount = skill.linkedAchievements.length;
  const certificatesCount = skill.linkedCertificates.length;

  if (
    projectsCount >= 5 &&
    achievementsCount >= 5 &&
    certificatesCount >= 1
  ) {
    return "diamond";
  }

  if (
    projectsCount >= 4 &&
    achievementsCount >= 4 &&
    certificatesCount >= 1
  ) {
    return "gold";
  }

  if (
    projectsCount >= 2 &&
    achievementsCount >= 2
  ) {
    return "silver";
  }

  return "bronze";
}

export const checkAndAssignBadge = async (profileId, skillId) => {
  const skill = await Skill.findById(skillId)
    .populate("linkedProjects linkedAchievements linkedCertificates");

  if (!skill) return;

  const level = determineBadgeLevel(skill);

  let badge = await Badge.findOne({ profile: profileId, skill: skillId });

  if (!badge) {
    badge = await Badge.create({
      profile: profileId,
      name: `${skill.name} Badge`,
      description: `Awarded for progress in ${skill.name}`,
      type: "skill",
      skill: skillId,
      level,
      awardedBy: "system",
    });
  } else if (badge.level !== level) {
    badge.level = level;
    badge.awardedAt = new Date();
    await badge.save();
  }

  return badge;
};

export const recalculateSkillBadge = async (profileId, skillId) => {
  const skill = await Skill.findById(skillId)
    .populate("linkedProjects linkedAchievements linkedCertificates");

  if (!skill) return;

  const level = determineBadgeLevel(skill);

  const badge = await Badge.findOne({ profile: profileId, skill: skillId });
  if (!badge) return;

  if (badge.level !== level) {
    badge.level = level;
    badge.awardedAt = new Date();
    await badge.save();
  }
};
