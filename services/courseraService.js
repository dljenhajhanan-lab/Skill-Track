import axios from "axios";
import Profile from "../models/profile.js";
import CourseLink from "../models/courseLink.js";
import { AppError } from "../utils/appError.js";

const AXIOS_OPTS = {
  timeout: 12000,
  headers: { "User-Agent": "SkillTrack/1.0" },
};

function isCourseraUrl(u) {
  try {
    const url = new URL(u);
    return url.hostname === "www.coursera.org" || url.hostname === "coursera.org";
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

async function getProfileIdByUser(userId) {
  const p = await Profile.findOne({ user: userId });
  if (!p) throw new AppError("Profile not found", 404);
  return p._id;
}

export const verifyOneCertificateService = async (userId, shareUrl, studentName) => {
  if (!shareUrl) throw new AppError("shareUrl is required", 400);
  if (!isCourseraUrl(shareUrl)) throw new AppError("Invalid Coursera URL", 400);

  const profileId = await getProfileIdByUser(userId);
  const resp = await axios.get(shareUrl, AXIOS_OPTS);
  const html = String(resp.data || "");
  const title = extractTitle(html);

  let message = "Certificate verified and saved";
  let warning = null;

  if (studentName && !nameAppearsInHtml(studentName, html)) {
    warning = "The name on the certificate does not match your profile name.";
    message = "Certificate saved with warning (name mismatch).";
  }

  const item = await CourseLink.create({
    profile: profileId,
    title,
    link: "",
    certificate: shareUrl,
  });

  return { message, data: { ...item.toObject(), warning } };
};

export const importCertificatesByUrlsService = async (userId, studentName, urls = []) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new AppError("certificates array is required", 400);
  }

  const profileId = await getProfileIdByUser(userId);
  const results = [];

  for (const shareUrl of urls) {
    try {
      if (!isCourseraUrl(shareUrl)) {
        results.push({ shareUrl, ok: false, error: "Invalid Coursera URL" });
        continue;
      }

      const resp = await axios.get(shareUrl, AXIOS_OPTS);
      const html = String(resp.data || "");
      const title = extractTitle(html);

      let warning = null;
      if (studentName && !nameAppearsInHtml(studentName, html)) {
        warning = "⚠️ The name on the certificate does not match your profile name.";
      }

      const item = await CourseLink.create({
        profile: profileId,
        title,
        link: "",
        certificate: shareUrl,
      });

      results.push({
        shareUrl,
        ok: true,
        id: item._id,
        title,
        warning,
      });
    } catch (e) {
      results.push({ shareUrl, ok: false, error: e?.message || "Fetch failed" });
    }
  }

  const imported = results.filter(r => r.ok).length;
  const failed = results.length - imported;

  return {
    message: `Processed ${results.length} link(s): imported ${imported}, failed ${failed}`,
    data: results,
  };
};

export const listMyCourseraCertificatesService = async (userId) => {
  const profileId = await getProfileIdByUser(userId);
  const list = await CourseLink.find({ profile: profileId }).sort({ createdAt: -1 });
  return { message: "Certificates fetched successfully", data: list };
};
