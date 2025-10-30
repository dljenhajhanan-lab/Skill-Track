import axios from "axios";
import Profile from "../models/profile.js";
import CourseLink from "../models/courseLink.js";
import { AppError } from "../utils/appError.js";

const AXIOS_OPTS = {
  timeout: 12000,
  headers: { "User-Agent": "SkillTrack/1.0" },
};

function isCourseraUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.includes("coursera.org");
  } catch {
    return false;
  }
}

function extractTitle(html = "") {
  const m = html.match(/<title>(.*?)<\/title>/i);
  return m ? m[1] : "Coursera Certificate";
}

function normalize(s = "") {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function nameAppearsInHtml(studentName, html) {
  if (!studentName) return false;
  return normalize(html).includes(normalize(studentName));
}

async function getProfileByUser(userId) {
  const p = await Profile.findOne({ user: userId });
  if (!p) throw new AppError("Profile not found", 404);
  return p;
}

function nameAppearsInHtml(studentName, html) {
  if (!studentName) return false;
  const parts = normalize(studentName).split(" ");
  const normHtml = normalize(html);
  return parts.some(p => normHtml.includes(p));
}

export const verifyCourseraCertificate = async (userId, shareUrl) => {
  if (!isCourseraUrl(shareUrl)) throw new AppError("Invalid Coursera URL", 400);
  const profile = await getProfileByUser(userId);
  const resp = await axios.get(shareUrl, AXIOS_OPTS);
  const html = String(resp.data || "");
  const title = extractTitle(html);
  const studentName = profile.fullName;
  const nameFound = nameAppearsInHtml(studentName, html);
  const link = await CourseLink.create({
    profile: profile._id,
    title,
    certificate: shareUrl,
  });

  if (!nameFound) {
    return {
      message: `Certificate saved but name mismatch — Coursera page doesn’t fully match "${studentName}". Please verify manually.`,
      data: link,
    };
  }

  return {
    message: "Certificate verified and saved successfully",
    data: link,
  };
};


export const listMyCertificates = async (userId) => {
  const profile = await getProfileByUser(userId);
  const list = await CourseLink.find({ profile: profile._id }).sort({ createdAt: -1 });
  return { message: "Certificates fetched successfully", data: list };
};
