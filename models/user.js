import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true,unique:true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, trim: true ,required: false},
    coverImage: { type: String, trim: true ,required: false},
    role: {
      type: String,
      enum: ["student", "professor", "company", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
