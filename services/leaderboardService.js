import ProfessorActivity from "../models/ProfessorActivity.js";

export const getProfessorsLeaderboard = async () => {
  const leaderboard = await ProfessorActivity.find()
    .populate("professor", "name avatar")
    .sort({ totalPoints: -1 })
    .limit(10);

  return {
    message: "Professors leaderboard fetched successfully",
    data: leaderboard,
  };
};
