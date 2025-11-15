import Project from "../models/project.js";
import Profile from "../models/profile.js";
import { AppError } from "../utils/appError.js";

async function verifyGithubOwnership(profile, githubUsernameFromUrl) {
  const storedGithubUsername =
    profile.githubUsername ||
    profile.socialLinks?.github ||
    profile.user?.email?.split("@")[0];
  return storedGithubUsername === githubUsernameFromUrl;
}

export const createProjectService = async (profileId, data) => {
  const profile = await Profile.findById(profileId).populate("user");
  if (!profile) throw new AppError("Profile not found", 404);
  if (!data.github) {
    throw new AppError("GitHub URL is required", 400);
  }
  function extractGithubInfo(githubUrl) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = githubUrl?.match(regex);

  if (!match) return null;

  return {
    username: match[1],
    repo: match[2]
  };
}

  const git = extractGithubInfo(data.github);
  if (!git) {
    throw new AppError("Invalid GitHub URL format", 400);
  }
  const isOwner = await verifyGithubOwnership(profile, git.username);
  if (!isOwner) {
    throw new AppError("This GitHub project does NOT belong to the authenticated user", 403);
  }
  const project = await Project.create({
    ...data,
    profile: profileId,
  });

  return {
    message: "Project created successfully",
    data: project,
  };
};
