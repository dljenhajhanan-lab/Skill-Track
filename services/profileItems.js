import { AppError } from "../utils/appError.js";
import Skill from "../models/skill.js";
import Project from "../models/project.js"; 
import Achievement from "../models/achievement.js";
import CourseLink from "../models/CourseLink.js";
import Badge from "../models/badge.js";

export const createItem = async (Model, profileId, data) => {
  const item = await Model.create({ ...data, profile: profileId });
  return {
    message: `${Model.modelName} created successfully`,
    data: item,
  };
};

export const getItems = async (Model, profileId) => {
  const items = await Model.find({ profile: profileId });
  return {
    message: `${Model.modelName}s fetched successfully`,
    data: items,
  };
};

export const deleteItem = async (Model, id, profileId) => {
  const item = await Model.findOneAndDelete({ _id: id, profile: profileId });
  if (!item) throw new AppError(`${Model.modelName} not found`, 404);
  return {
    message: `${Model.modelName} deleted successfully`,
  };
};

export const updateItem = async (Model, id, profileId, updates) => {
  const item = await Model.findOneAndUpdate(
    { _id: id, profile: profileId },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!item) throw new AppError(`${Model.modelName} not found`, 404);

  return {
    message: `${Model.modelName} updated successfully`,
    data: item,
  };
};

export const deleteSkillCascadeService = async (profileId, skillId) => {
  const skill = await Skill.findOne({ _id: skillId, profile: profileId });

  if (!skill) {
    throw new AppError("Skill not found", 404);
  }
  await Project.deleteMany({
    _id: { $in: skill.linkedProjects },
    profile: profileId,
  });

  await Achievement.deleteMany({
    _id: { $in: skill.linkedAchievements },
    profile: profileId,
  });

  await CourseLink.deleteMany({
    _id: { $in: skill.linkedCertificates },
    profile: profileId,
  });

  await Badge.deleteMany({
    profile: profileId,
    skill: skillId,
  });

  await Skill.deleteOne({ _id: skillId });

  return {
    message: "Skill and all related data deleted successfully",
  };
};