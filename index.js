import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js" 
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profile.js"
import otpRouter from "./routes/otpRoutes.js"
import courseraRoutes from "./routes/coursera.js";
import approvalRoutes from "./routes/approvalRoutes.js"
import badgeRoutes from "./routes/badgeRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import followRoutes from "./routes/followroutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/profile",profileRoutes)
app.use("/api/otp",otpRouter)
app.use("/api/coursera", courseraRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
