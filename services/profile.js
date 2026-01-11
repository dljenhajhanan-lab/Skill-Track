import Profile from "../models/profile.js";
import User from "../models/user.js"
import { AppError } from "../utils/appError.js";
import { generateQR } from "../utils/qrGenerator.js";
import Skill  from "../models/skill.js";
import Project from "../models/project.js";
import Achievement from "../models/achievement.js";
import Badge from "../models/badge.js"
import Post from "../models/post.js"
import Question from "../models/question.js"
import CourseLink from "../models/courseLink.js";
import Professor from "../models/professor.js";
import Company from "../models/company.js";

export const getProfile = async (userId) => {
  const profile = await Profile.findOne({ user: userId })
    .populate("user", "name email role avatar coverImage");

  if (!profile) throw new AppError("Profile not found", 404);

  return {
    message: "Profile fetched successfully",
    data: {
      user: profile.user,

      fullName: profile.fullName,
      bio: profile.bio,
      university: profile.university,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      socialLinks: profile.socialLinks,
      postion: profile.postion
    },
  };
};

export const updateProfile = async (userId, updates, files) => {
  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!profile) throw new AppError("Profile not found", 404);

  const userUpdates = {};

  if (files?.avatar) {
    userUpdates.avatar = files.avatar[0].path.replace(/\\/g, "/");
  }

  if (files?.coverImage) {
    userUpdates.coverImage = files.coverImage[0].path.replace(/\\/g, "/");
  }

  let updatedUser = null;

  if (Object.keys(userUpdates).length > 0) {
    updatedUser = await User.findByIdAndUpdate(
      userId, 
      userUpdates, 
      { new: true }
    ).select("name email role avatar coverImage");
  } else {
    updatedUser = await User.findById(userId).select("name email role avatar coverImage");
  }

  return {
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
      fullName: profile.fullName,
      bio: profile.bio,
      university: profile.university,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      socialLinks: profile.socialLinks,
      postion: profile.postion
    }
  };
};

export const generateProfileQR = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  let profileData = null;
  let profilePath = "";
  switch (user.role) {
    case "student":
      profileData = await Profile.findOne({ user: userId });
      profilePath = "profile";
      break;

    case "professor":
      profileData = await Professor.findOne({ user: userId });
      profilePath = "professor";
      break;

    case "company":
      profileData = await Company.findOne({ user: userId });
      profilePath = "company";
      break;

    default:
      throw new AppError("Invalid user role for QR generation", 400);
  }
  if (!profileData) {
    throw new AppError(`${user.role} profile data not found`, 404);
  }
  const profileUrl = `${process.env.FRONTEND_URL}/${profilePath}/${userId}`;
  const qrCode = await generateQR(profileUrl);
  return {
    success: true,
    message: `${user.role} QR Code generated successfully`,
    data: {
      role: user.role,
      profileUrl,
      qrCode,
    },
  };
};

export const getFullProfile = async (userId) => {
  let profile = await Profile.findOne({ user: userId })
    .populate("user", "name email role avatar coverImage");

  let professorExtra = null;
  let companyExtra = null;

  const user =
    profile?.user ||
    (await User.findById(userId).select("name email role avatar coverImage"));

  if (!user) throw new AppError("User not found", 404);
  if (user.role === "professor") {
    professorExtra = await Professor.findOne({ user: userId });
  }
  if (user.role === "company") {
    companyExtra = await Company.findOne({ user: userId });
  }
  if (!profile) {
    const [userPosts, userQuestions] = await Promise.all([
      Post.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 }),
      Question.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 }),
    ]);

    return {
      profile: { user, fullName: user.name },
      skills: [],
      projects: [],
      courseLinks: [],
      achievements: [],
      badges: [],
      posts: userPosts,
      questions: userQuestions,
      professorExtra,
      companyExtra,
    };
  }

  const profileId = profile._id;

  const [
    skills,
    projects,
    courseLinks,
    achievements,
    badges,
    posts,
    questions,
  ] = await Promise.all([
    Skill.find({ profile: profileId }),
    Project.find({ profile: profileId }),
    CourseLink.find({ profile: profileId }),
    Achievement.find({ profile: profileId }),
    Badge.find({ profile: profileId }),
    Post.find({ authorId: userId, deletedAt: null }).populate("user", "name email role avatar coverImage").sort({ createdAt: -1 }),
    Question.find({ authorId: userId, deletedAt: null }).populate("user", "name email role avatar coverImage").sort({ createdAt: -1 }),
  ]);

  return {
    profile,
    skills,
    projects,
    courseLinks,
    achievements,
    badges,
    posts,
    questions,
    professorExtra,
    companyExtra,
  };
};

