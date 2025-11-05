import Company from "../models/company.js";
import Professor from "../models/professor.js";
import { AppError } from "../utils/appError.js";
import { sendEmail } from "../utils/sendEmail.js";

export const requestCreation = async (role, data) => {
  let Model;
  if (role === "company") Model = Company;
  else if (role === "professor") Model = Professor;
  else throw new AppError("Invalid role", 400);

  const created = await Model.create(data);
  return {
    message: `${role} created successfully, awaiting admin approval`,
    data: created,
  };
};

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

export const listAllPending = async () => {
  const [companies, professors] = await Promise.all([
    Company.find().populate("user", "name email"),
    Professor.find().populate("user", "name email specialization"),
  ]);

  return {
    message: "All approvals",
    data: {
      companies: companies.map((c) => ({
        id: c._id,
        name: c.companyName,
        email: c.user?.email,
        bio: c.bio,
        approvalStatus: c.approvalStatus,
      })),
      professors: professors.map((p) => ({
        id: p._id,
        name: p.user?.name,
        email: p.user?.email,
        specialization: p.specialization,
        bio: p.bio,
        approvalStatus: p.approvalStatus,
      })),
    },
  };
};

