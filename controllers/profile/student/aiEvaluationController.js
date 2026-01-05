import Profile from "../../../models/profile.js";
import Badge from "../../../models/badge.js";
import StudentAIEvaluation from "../../../models/studentAIEvaluation.js";
import { evaluateStudentProfileWithAI } from "../../../services/aiStudentEvaluationService.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { successResponse } from "../../../utils/responseHandler.js";
import { AppError } from "../../../utils/appError.js";

export const evaluateMyProfile = catchAsync(async (req, res) => {
 const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) throw new AppError("Profile not found", 404);

  const position = profile.postion;

  if (!position || position.trim().length === 0) {
    throw new AppError(
      "Please update your profile and set your position before evaluation.",
      400
    );
  }

  const badges = await Badge.find({ profile: profile._id }).populate({
    path: "skill",
    select: "name level linkedProjects linkedAchievements linkedCertificates",
    populate: [
      {
        path: "linkedProjects",
        select: "title description",
      },
      {
        path: "linkedAchievements",
        select: "title description",
      },
      {
        path: "linkedCertificates",
        select: "title",
      },
    ],
  });

  const formattedBadges = badges
  .filter(b => b.skill)
  .map(badge => ({
    badge: {
      name: badge.name,
      level: badge.level,
      description: badge.description,
    },
    skill: {
      name: badge.skill.name,
      level: badge.skill.level,
      category: "technical skill",
      projects: badge.skill.linkedProjects.map(p => ({
        title: p.title,
        description: p.description,
        difficultyHint: "Analyze complexity based on description",
      })),
      achievements: badge.skill.linkedAchievements.map(a => ({
        title: a.title,
        description: a.description,
        importanceHint: "Analyze technical depth",
      })),
      certificates: badge.skill.linkedCertificates.map(c => ({
        title: c.title,
      })),
    },
  }));


  const aiResult = await evaluateStudentProfileWithAI({
    position: profile.postion,
    badges: formattedBadges,
  });

  await StudentAIEvaluation.findOneAndUpdate(
    { profile: profile._id },
    {
      profile: profile._id,
      position: profile.postion,
      overallScore: aiResult.overall_score,
      level: aiResult.level,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      recommendations: aiResult.recommendations,
      roleFit: {
        fitScore: aiResult.role_fit.fit_score,
        missingSkills: aiResult.role_fit.missing_skills,
      },
      evaluatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  successResponse(
  res,
  {
    userId: req.user._id,
    profileId: profile._id,
    evaluation: aiResult,
  },
  "AI profile evaluation completed",
  200
);

});
