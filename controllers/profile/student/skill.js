import { catchAsync } from "../../../utils/catchAsync.js";
import { successResponse } from "../../../utils/responseHandler.js";
import { createSkillService, linkSkillItemService, getMySkillsService } from "../../../services/skillService.js";

export const createSkill = catchAsync(async (req, res) => {
  const skill = await createSkillService(req.profileId, req.body);
  successResponse(res, skill, "Skill created successfully", 201);
});

export const linkSkillItem = catchAsync(async (req, res) => {
  const { skillId } = req.params;
  const { itemId, type } = req.body;
  const result = await linkSkillItemService(req.profileId, skillId, itemId, type);
  successResponse(res, result, "Skill linked and badge updated", 200);
});

export const getMySkills = catchAsync(async (req, res) => {
  const skills = await getMySkillsService(req.profileId);
  successResponse(res, skills, "Skills fetched successfully", 200);
});
