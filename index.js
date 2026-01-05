import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profile.js";
import otpRouter from "./routes/otpRoutes.js";
import courseraRoutes from "./routes/coursera.js";
import approvalRoutes from "./routes/approvalRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import followRoutes from "./routes/followroutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reactionRoutes from "./routes/reactionRoutes.js";
import questionRoutes from"./routes/questionRoutes.js";
import leaderboardRoutes from "./routes/leaderboard.js"
import taskRoutes from "./routes/companyTask.js"
import recommendationsRoutes from "./routes/recommendation.js"
import competencyEvaluation from "./routes/competencyEvaluation.js"
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/otp", otpRouter);
app.use("/api/coursera", courseraRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/evaluate",competencyEvaluation)
app.use("/api/recommendations",recommendationsRoutes)
app.use('/uploads', express.static('uploads'))
app.use(errorHandler);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
