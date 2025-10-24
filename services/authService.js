import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError.js";

export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = "student";

  const user = await User.create({ name, email, password: hashedPassword, role });

  return {
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid password", 401);

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

export const registerCompany = async ({ name, email, password, companyName, bio }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already exists", 400);
  const user = await User.create({
    name,
    email,
    password,
    role: "company",
  });
  const company = await Company.create({
    user: user._id,
    companyName,
    bio,
    approvalStatus: "pending",
  });

  return {
    message: "Company account created successfully. Awaiting admin approval.",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      company,
    },
  };
};

export const loginCompany = async (email, password) => {
  const user = await User.findOne({ email, role: "company" });
  if (!user) throw new AppError("Company not found", 404);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid email or password", 401);

  const company = await Company.findOne({ user: user._id });
  if (!company) throw new AppError("Company record not found", 404);

  if (company.approvalStatus === "pending")
    throw new AppError("Your company account is awaiting admin approval", 403);

  if (company.approvalStatus === "rejected")
    throw new AppError("Your company account has been rejected by admin", 403);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    message: "Company login successful",
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      company: {
        id: company._id,
        companyName: company.companyName,
        bio: company.bio,
        approvalStatus: company.approvalStatus,
      },
    },
  };
};

export const registerProfessor = async ({ name, email, password, bio, specialization }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already exists", 400);
  const user = await User.create({
    name,
    email,
    password,
    role: "professor",
  });
  const professor = await Professor.create({
    user: user._id,
    bio,
    specialization,
    approvalStatus: "pending",
  });

  return {
    message: "Professor account created successfully. Awaiting admin approval.",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      professor,
    },
  };
};

export const loginProfessor = async (email, password) => {
  const user = await User.findOne({ email, role: "professor" });
  if (!user) throw new AppError("Professor not found", 404);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid email or password", 401);

  const professor = await Professor.findOne({ user: user._id });
  if (!professor) throw new AppError("Professor record not found", 404);

  if (professor.approvalStatus === "pending")
    throw new AppError("Your professor account is awaiting admin approval", 403);

  if (professor.approvalStatus === "rejected")
    throw new AppError("Your professor account has been rejected by admin", 403);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    message: "Professor login successful",
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      professor: {
        id: professor._id,
        bio: professor.bio,
        specialization: professor.specialization,
        approvalStatus: professor.approvalStatus,
      },
    },
  };
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
