import User from "../models/user.js";
import Profile from "../models/profile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";
import Professor from "../models/professor.js";
import Company from "../models/company.js";

export const loginAdmin = async (email, password) => {
  const user = await User.findOne({ email , role:"admin" });
  if (!user) throw new AppError("Admin not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid password", 401);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    message: "Login successful",
    data: {
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("User already exists", 400);

  const user = await User.create({ name, email, password, role: "student" });

  await Profile.create({
    user: user._id,
    fullName: name,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    message: "Student registered successfully",
    data: {
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email, role: "student" });
  if (!user) throw new AppError("User not found", 404);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid password", 401);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

export const registerProfessor = async ({ name, email, password, bio, specialization }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already exists", 400);

  const user = await User.create({ name, email, password, role: "professor" });
  await Professor.create({
    user: user._id,
    bio,
    specialization,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    message: "Professor registered successfully (awaiting approval)",
    data: { token, user },
  };
};

export const loginProfessor = async (email, password) => {
  const user = await User.findOne({ email, role: "professor" });
  if (!user) throw new AppError("Professor not found", 404);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const professor = await Professor.findOne({ user: user._id });
  if (!professor) throw new AppError("Professor profile missing", 404);

  if (professor.approvalStatus === "pending")
    throw new AppError("Account awaiting admin approval", 403);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { message: "Login successful", data: { token, user, professor } };
};

export const registerCompany = async ({ name, email, password, companyName, bio }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already exists", 400);

  const user = await User.create({ name, email, password, role: "company" });
  await Company.create({
    user: user._id,
    companyName,
    bio,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    message: "Company registered successfully (awaiting approval)",
    data: { token, user },
  };
};

export const loginCompany = async (email, password) => {
  const user = await User.findOne({ email, role: "company" });
  if (!user) throw new AppError("Company not found", 404);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid password", 401);

  const company = await Company.findOne({ user: user._id });
  if (!company) throw new AppError("Company profile missing", 404);

  if (company.approvalStatus === "pending")
    throw new AppError("Account awaiting admin approval", 403);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { message: "Login successful", data: { token, user, company } };
};


export const logoutUser = async (req) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("Invalid Token", 400);
  }
  
  return {
    message: "logout Successful",
  };
};
