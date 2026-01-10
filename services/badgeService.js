import Badge from "../models/badge.js";
import Skill from "../models/skill.js";
import { addPoints } from "./points.js";
import Profile from "../models/profile.js";

const BADGE_POINTS = {
  bronze: 5,
  silver: 10,
  gold: 15,
  diamond: 25,
};

function determineBadgeLevel(skill) {
  const projectsCount = skill.linkedProjects.length;
  const achievementsCount = skill.linkedAchievements.length;
  const certificatesCount = skill.linkedCertificates.length;

  if (projectsCount >= 5 && achievementsCount >= 5 && certificatesCount >= 1) return "diamond";
  if (projectsCount >= 4 && achievementsCount >= 4 && certificatesCount >= 1) return "gold";
  if (projectsCount >= 2 && achievementsCount >= 2) return "silver";
  return "bronze";
}

export const checkAndAssignBadge = async (profileId, skillId) => {
  const profile = await Profile.findById(profileId);
  if (!profile) return;

  const skill = await Skill.findById(skillId)
    .populate("linkedProjects linkedAchievements linkedCertificates");
  if (!skill) return;

  const newLevel = determineBadgeLevel(skill);

  let badge = await Badge.findOne({ profile: profileId, skill: skillId });

  if (!badge) {
    badge = await Badge.create({
      profile: profileId,
      name: `${skill.name} Badge`,
      description: `Awarded for progress in ${skill.name}`,
      type: "skill",
      skill: skillId,
      level: newLevel,
      awardedBy: "system",
    });

    await addPoints({
      studentId: profile.user,
      type: "BADGE",
      points: BADGE_POINTS[newLevel],
      reason: `Earned ${newLevel} badge`,
      referenceId: badge._id,
    });

    return badge;
  }

  if (badge.level !== newLevel) {
    const oldLevel = badge.level;

    badge.level = newLevel;
    badge.awardedAt = new Date();
    await badge.save();

    const upgradePoints = BADGE_POINTS[newLevel] - BADGE_POINTS[oldLevel];

    if (upgradePoints > 0) {
      await addPoints({
        studentId: profile.user,
        type: "BADGE",
        points: upgradePoints,
        reason: `Upgraded badge from ${oldLevel} to ${newLevel}`,
        referenceId: badge._id,
      });
    }
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
