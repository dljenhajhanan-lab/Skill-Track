import bcrypt from "bcrypt";
import User from "../models/user.js";
import OtpToken from "../models/otp.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import { AppError } from "../utils/appError.js";

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
export const requestResetService = async (email) => {
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user)
    return { message: "If the email exists, an OTP was sent." };

  const code = generateOTP(6);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await OtpToken.create({ userId: user._id, code, expiresAt });

  await sendEmail({
    to: user.email,
    subject: "SkillTrack password reset code",
    html: `<p>Your SkillTrack reset code:</p>
           <div style="font-size:22px;font-weight:bold;letter-spacing:4px">${code}</div>
           <p>Expires in ${OTP_TTL_MINUTES} minutes.</p>`,
  });

  return { message: "OTP sent to email." };
};

export const verifyAndResetService = async (email, code, newPassword) => {
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) throw new AppError("Invalid code", 400);

  const token = await OtpToken.findOne({
    userId: user._id,
    code,
    purpose: "RESET_PASSWORD",
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });
  if (!token) throw new AppError("Invalid or expired code", 400);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  token.usedAt = new Date();
  await token.save();

  return { message: "Password updated." };
};
