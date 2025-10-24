import mongoose from "mongoose";
const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: [true, "Full name required"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    avatar: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    university: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      website: { type: String, trim: true },
    },

    // skills: [{ type: String, trim: true }],

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
