import CompetencyEvaluation from "../models/competencyEvaluation.js";
import { AppError } from "../utils/appError.js";

export const evaluateStudentCompetencies = async (professorId, data) => {
  if (!data.student)
    throw new AppError("Student is required", 400);
  const evaluation = await CompetencyEvaluation.create({student: data.student,professor: professorId,competencies: data.competencies,overallComment: data.overallComment});

  return {
    message: "Student competencies evaluated successfully",
    data: evaluation,
  };
};

export const getMyCompetencyEvaluations = async (studentId) => {
  const evaluations = await CompetencyEvaluation.find({ student: studentId })
    .populate("professor", "name email");

  return {
    message: "Competency evaluations fetched successfully",
    data: evaluations,
  };
};