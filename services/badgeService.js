import Badge from "../models/badge.js";
import Skill from "../models/skill.js";

function determineBadgeLevel(skill) {
  const hasProject = skill.linkedProjects.length > 0;
  const hasAchievement = skill.linkedAchievements.length > 0;
  const hasCertificate = skill.linkedCertificates.length > 0;

  if (hasProject && !hasCertificate && !hasAchievement) return "bronze";
  if (hasProject && hasCertificate && !hasAchievement) return "silver";
  if (hasProject && hasCertificate && hasAchievement) return "gold";
  if (hasProject && hasCertificate && hasAchievement && skill.level === "advanced")
    return "diamond";

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
