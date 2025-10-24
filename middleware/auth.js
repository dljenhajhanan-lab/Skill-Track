import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  next();
};
