import CompetencyEvaluation from "../models/competencyEvaluation.js";
import { AppError } from "../utils/appError.js";
import ProfessorActivity from "../models/ProfessorActivity.js";
import { sendNotification } from "./notification.service.js";
import user from "../models/user.js";

export const evaluateStudentCompetencies = async (professorId, data) => {
  if (!data.student)
    throw new AppError("Student is required", 400);

  const evaluation = await CompetencyEvaluation.create({
    student: data.student,
    professor: professorId,
    competencies: data.competencies,
    overallComment: data.overallComment,
  });

  await ProfessorActivity.findOneAndUpdate(
    { professor: professorId },
    {
      $inc: {
        evaluationsCount: 1,
        totalPoints: 5,
      },
    },
    { upsert: true }
  );

  const student = await user.findById(data.student);
  if (student?.fcmToken) {
    await sendNotification({
      senderId: professorId,
      receiverId: student._id,
      receiverFcmToken: student.fcmToken,
      title: "Competency Evaluation Completed",
      body: "Your competencies have been evaluated by your professor. You can view the details now",
      data: {
        type: "COMPETENCY_EVALUATION",
        evaluationId: evaluation._id.toString(),
      },
    });
  }

  return {
    message: "Student competencies evaluated successfully",
    data: evaluation,
  };
};

export const getMyCompetencyEvaluations = async (studentId) =>{
  const evaluations = await CompetencyEvaluation.find({ student: studentId }) .populate("professor", "name email avatar");
  return { message: "Competency evaluations fetched successfully", data: evaluations, };
};
