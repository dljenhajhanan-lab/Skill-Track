import { catchAsync } from "../../utils/catchAsync.js";
import { successResponse } from "../../utils/responseHandler.js";
import { evaluateStudentCompetencies,getMyCompetencyEvaluations } from "../../services/competencyEvaluation.js";

export const evaluateStudentCompetenciesController = catchAsync(async (req, res) => {
    const result = await evaluateStudentCompetencies(req.user._id, req.body);
    successResponse(res, result.data, result.message, 201);
  }
);

export const getMyCompetencyEvaluationsController = catchAsync(async (req, res) => {
    const result = await getMyCompetencyEvaluations(req.user._id);
    successResponse(res, result.data, result.message, 200);
  }
);