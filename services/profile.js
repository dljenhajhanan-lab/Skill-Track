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
  const profile = await Profile.findOne({ user: userId });

  if (!profile) throw new AppError("Profile not found", 404);
  const profileUrl = `${process.env.FRONTEND_URL}/profile/${userId}`;

  const qrCode = await generateQR(profileUrl);

  return {
    message: "QR Code generated successfully",
    data: {
      profileUrl,
      qrCode,
    },
  };
};
export const getFullProfile = async (userId) => {
  let profile = await Profile.findOne({ user: userId }).populate("user", "name email role avatar coverImage");
  if (!profile) {
    const user = await User.findById(userId).select("name email role avatar coverImage");
    if (!user) throw new AppError("User not found", 404);
    const [userPosts, userQuestions] = await Promise.all([
      Post.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 }),
      Question.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 })
    ]);

    return {
      profile: { user, fullName: user.name },
      skills: [],
      projects: [],
      achievements: [],
      badges: [],
      posts: userPosts,
      questions: userQuestions,
      professorExtra: null
    };
  }

  const profileId = profile._id;
  const userRole = profile.user.role;

  const [skills, projects, achievements, badges, posts, questions] = await Promise.all([
    Skill.find({ profile: profileId }),
    Project.find({ profile: profileId }),
    Achievement.find({ profile: profileId }),
    Badge.find({ profile: profileId }),
    Post.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 }),
    Question.find({ authorId: userId, deletedAt: null }).sort({ createdAt: -1 })
  ]);

  let professorData = null;
  if (userRole === "professor") {
    professorData = await Professor.findOne({ user: userId });
  }

  return {
    profile,
    skills,
    projects,
    achievements,
    badges,
    posts,
    questions,
    professorExtra: professorData 
  };
};
