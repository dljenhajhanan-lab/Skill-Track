import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { createItem, getItems, deleteItem, updateItem } from "../../services/profileItems.js";
import { AppError } from "../../utils/appError.js";
import Skill from "../../models/skill.js";
import Project from "../../models/project.js";
import Achievement from "../../models/achievement.js";
import Badge from "../../models/badge.js";
import CourseLink from "../../models/courseLink.js";
import { createProjectService } from "../../services/projectService.js";

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
  successResponse(res, null, result.message, 200);
});

export const updateProfileItem = catchAsync(async (req, res) => {
  const { type, id } = req.params;
  const Model = models[type];
  if (!Model) throw new AppError("Invalid type", 400);
  if (type === "Achievement" && req.files?.avatar) {
    req.body.certificate = req.files.avatar[0].path;
  }
  const result = await updateItem(Model, id, req.profileId, req.body);

  successResponse(res, result.data, result.message, 200);
});
