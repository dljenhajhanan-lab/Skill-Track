import PointLog from "../models/pointLog.js";
import Leaderboard from "../models/leaderboard.js";
import { AppError } from "../utils/appError.js";

export const addPoints = async ({
  studentId,
  type,
  points,
  reason,
  referenceId = null,
}) => {
  if (!studentId) {
    throw new AppError("Student ID is required", 400);
  }

  if (!points || points <= 0) {
    throw new AppError("Points must be greater than zero", 400);
  }

  if (!type || !reason) {
    throw new AppError("Type and reason are required", 400);
  }

  const pointLog = await PointLog.create({
    student: studentId,
    type,
    points,
    reason,
    referenceId,
  });

  const leaderboard = await Leaderboard.findOneAndUpdate(
    { student: studentId },
    {
      $inc: { totalPoints: points },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return {
    pointLog,
    leaderboard,
  };
};

export const getStudentTotalPoints = async (studentId) => {
  const leaderboard = await Leaderboard.findOne({ student: studentId });

  return leaderboard ? leaderboard.totalPoints : 0;
};

export const getStudentPointsHistory = async (studentId) => {
  return await PointLog.find({ student: studentId })
    .sort({ createdAt: -1 });
};
