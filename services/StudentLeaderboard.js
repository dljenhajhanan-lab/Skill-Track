import Leaderboard from "../models/leaderboard.js";

export const getLeaderboard = async () => {
  return await Leaderboard.find()
    .sort({ totalPoints: -1 })
    .populate({
      path: "student",
      select: "fullName avatar email",
      match: { role: "student" },
    })
    .then(results =>
      results.filter(r => r.student !== null)
    );
};
