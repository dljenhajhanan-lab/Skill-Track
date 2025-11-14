import Company from "../models/company.js";
import Professor from "../models/professor.js";
import { AppError } from "../utils/appError.js";
import { sendEmail } from "../utils/sendEmail.js";

export const updateStatus = async (role, id, status) => {
  let Model;
  if (role === "company") Model = Company;
  else if (role === "professor") Model = Professor;
  else throw new AppError("Invalid role", 400);

  const doc = await Model.findById(id).populate("user", "name email");
  if (!doc) throw new AppError(`${role} not found`, 404);

  doc.approvalStatus = status;
  await doc.save();

  if (doc.user?.email) {
    try {
      if (status === "approved") {
        await sendEmail({
          to: doc.user.email,
          subject: "Your account has been approved",
          html: `
            <h2>Hello ${doc.user.name}</h2>
            <p>Your account as a <b>${role}</b> has been <b>approved</b> by the admin.</p>
            <p>You can now log in to your account</p>
            <p>Best regards,<br/>Skill Track Team</p>
          `,
        });
      } else if (status === "rejected") {
        await sendEmail({
          to: doc.user.email,
          subject: "Your account request has been rejected",
          html: `
            <h2>Hello ${doc.user.name}</h2>
            <p>We regret to inform you that your account request as a <b>${role}</b> has been <b>rejected</b>.</p>
            <p>This may be due to missing information or not meeting the required criteria.</p>
            <br/><br/>
            <p>Best regards,<br/>Skill Track Team</p>
          `,
        });
      }
    } catch (error) {
      console.error("Failed to send status email:", error);
    }
  }

  return { message: `${role} ${status}`, data: doc };
};

export const listAllPending = async (type, page, limit) => {
  const skip = (page - 1) * limit;

  let items, total;

  if (type === "company") {
    [items, total] = await Promise.all([
      Company.find()
        .populate("user", "name email")
        .skip(skip)
        .limit(limit),
      Company.countDocuments(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items.map((c) => ({
        id: c._id,
        name: c.companyName,
        email: c.user?.email,
        bio: c.bio,
        approvalStatus: c.approvalStatus,
      })),
    };
  }

  if (type === "professor") {
    [items, total] = await Promise.all([
      Professor.find()
        .populate("user", "name email specialization")
        .skip(skip)
        .limit(limit),
      Professor.countDocuments(),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: items.map((p) => ({
        id: p._id,
        name: p.user?.name,
        email: p.user?.email,
        specialization: p.specialization,
        bio: p.bio,
        approvalStatus: p.approvalStatus,
      })),
    };
  }
};
