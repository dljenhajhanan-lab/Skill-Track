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
  const og = html.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i
  );
  if (og) return og[1];
  const t = html.match(/<title>(.*?)<\/title>/i);
  return t ? t[1] : "Coursera Certificate";
}


function decodeHtmlEntities(text = "") {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\/>$/g, "")
    .trim();
}
function extractDescription(html = "") {
  const og = html.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  );
  if (og) return decodeHtmlEntities(og[1]);

  const meta = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  );
  if (meta) return decodeHtmlEntities(meta[1]);

  const text = html.match(/This certificate verifies[^<]+/i);
  if (text) return decodeHtmlEntities(text[0]);

  return "";
}


function normalize(s = "") {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
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
  if (!isCourseraUrl(shareUrl)) {
    throw new AppError("Invalid Coursera URL", 400);
  }

  const profile = await getProfileByUser(userId);

  const resp = await axios.get(shareUrl, AXIOS_OPTS);
  const html = String(resp.data || "");

  const title = extractTitle(html);
  const description = extractDescription(html);

  const studentName = profile.fullName;
  const nameFound = nameAppearsInHtml(studentName, html);

  const link = await CourseLink.create({
    profile: profile._id,
    title,
    description,
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
