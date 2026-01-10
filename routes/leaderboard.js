import express from "express";
import { getProfessorsLeaderboardController } from "../controllers/leaderboard/leaderboard.js";
import { getLeaderboardController } from "../controllers/leaderboard/studentLeaderBoard.js";

const router = express.Router();

router.get("/professors", getProfessorsLeaderboardController);
router.get("/", getLeaderboardController);

export default router;
