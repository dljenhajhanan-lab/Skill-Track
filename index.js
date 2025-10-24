import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js" 
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profile.js"
import approvalRoutes from "./routes/approvalRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/profile",profileRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
