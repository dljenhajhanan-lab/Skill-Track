import Project from "../models/project.js";
import Profile from "../models/profile.js";
import { AppError } from "../utils/appError.js";

function extractGithubUsername(githubUrl) {
  const regex = /github\.com\/([^\/]+)/;
  const match = githubUrl?.match(regex);
  return match ? match[1] : null;
}

async function verifyGithubOwnership(profile, githubUrl) {
  const githubUsername = extractGithubUsername(githubUrl);
  if (!githubUsername) return false;

    

  const userName = profile.user?.name;
  if (!userName) return false;

  return githubUsername.trim().toLowerCase() === userName.trim().toLowerCase();
}

export const createProjectService = async (profileId, data) => {
  const profile = await Profile.findById(profileId).populate("user");
  if (!profile) throw new AppError("Profile not found", 404);

  if (!data.github) {
    throw new AppError("GitHub URL is required", 400);
  }

  const githubUsername = extractGithubUsername(data.github);

  let warning = null;

  if (!githubUsername) {
    warning = "Invalid GitHub URL format";
  } else {
    const isOwner = await verifyGithubOwnership(profile, data.github);
    if (!isOwner) {
      warning = "Warning: This repository does NOT belong to your GitHub account.";
    }
  }

  const project = await Project.create({
    ...data,
    profile: profileId,
  });

  return {
    message: warning ? `${warning} But project added successfully.` : "Project created successfully",
    data: project,
    warning,
  };
};


