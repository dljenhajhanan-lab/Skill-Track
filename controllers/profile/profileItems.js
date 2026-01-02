import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createItem, getItems, deleteItem, updateItem, deleteSkillCascadeService } from "../../services/profileItems.js";
import { AppError } from "../../utils/appError.js";
import Skill from "../../models/skill.js";
import Project from "../../models/project.js";
import Achievement from "../../models/achievement.js";
import Badge from "../../models/badge.js";
import CourseLink from "../../models/courseLink.js";
import { createProjectService } from "../../services/projectService.js";
import { recalculateSkillBadge } from "../../services/badgeService.js";

const models = { Skill, Project, Achievement, Badge, CourseLink };

export const createProfileItem = catchAsync(async (req, res) => {
  const { type } = req.params;

  if (type === "Project") {
    const result = await createProjectService(req.profileId, req.body);
    return successResponse(res, result.data, result.message, 201);
  }
  const Model = models[type];

  if (!Model) throw new AppError("Invalid type", 400);
  const result = await createItem(Model, req.profileId, req.body);
  successResponse(res, result.data, result.message, 201);
});

export const getProfileItems = catchAsync(async (req, res) => {
  const { type } = req.params;
  const Model = models[type];
  if (!Model) throw new AppError("Invalid type", 400);
  const result = await getItems(Model, req.profileId);
  successResponse(res, result.data, result.message, 200);
});

export const deleteProfileItem = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const Model = models[type];
  if (!Model) throw new AppError("Invalid type", 400);

  const result = await deleteItem(Model, id, req.profileId);
  if (type === "Project") {
    const skills = await Skill.find({
      profile: req.profileId,
      linkedProjects: id,
    });

    for (const skill of skills) {
      await Skill.updateOne(
        { _id: skill._id },
        { $pull: { linkedProjects: id } }
      );
      await recalculateSkillBadge(req.profileId, skill._id);
    }
  }

  if (type === "Skill") {
    throw new AppError("Use dedicated skill delete endpoint",400);
  }

  if (type === "Achievement") {
    const skills = await Skill.find({
      profile: req.profileId,
      linkedAchievements: id,
    });

    for (const skill of skills) {
      await Skill.updateOne(
        { _id: skill._id },
        { $pull: { linkedAchievements: id } }
      );
      await recalculateSkillBadge(req.profileId, skill._id);
    }
  }

  if (type === "CourseLink") {
    const skills = await Skill.find({
      profile: req.profileId,
      linkedCertificates: id,
    });

    for (const skill of skills) {
      await Skill.updateOne(
        { _id: skill._id },
        { $pull: { linkedCertificates: id } }
      );
      await recalculateSkillBadge(req.profileId, skill._id);
    }
  }

  successResponse(res, null, result.message, 200);
});

export const updateProfileItem = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const Model = models[type];
  if (!Model) throw new AppError("Invalid type", 400);
  if (type === "Achievement" && req.files?.certificate) {
    req.body.certificate = req.files.certificate[0].path;
  }
  const result = await updateItem(Model, id, req.profileId, req.body);

  successResponse(res, result.data, result.message, 200);
});

export const deleteSkill = catchAsync(async (req, res) => {
  const { skillId } = req.params;
  const result = await deleteSkillCascadeService(req.profileId, skillId);
  successResponse(res, null, result.message, 200);
});