import Profile from "../models/profile.js";

export const attachProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    req.profileId = profile._id;
    next();
  } catch (e) {
    next(e);
  }
};
