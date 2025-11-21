import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, trim: true, required: [true, "Full name required"] },
    bio: { type: String, trim: true, maxlength: 500 },
    university: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    postion : { type: String, trim:true },
    gender: { type: String, enum: ["male", "female"] },
    dateOfBirth: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
