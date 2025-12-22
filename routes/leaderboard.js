import express from "express";
import { getProfessorsLeaderboardController } from "../controllers/leaderboard/leaderboard.js";

const router = express.Router();

router.get("/professors", getProfessorsLeaderboardController);

export default router;
