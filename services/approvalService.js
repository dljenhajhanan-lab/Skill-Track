import Company from "../models/company.js";
import Professor from "../models/professor.js";
import { AppError } from "../utils/appError.js";

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
  return { message: `${role} ${status}`, data: doc };
};

export const listAllPending = async () => {
  const [companies, professors] = await Promise.all([
    Company.find({ approvalStatus: "pending" }).populate("user", "name email"),
    Professor.find({ approvalStatus: "pending" }).populate(
      "user",
      "name email specialization"
    ),
  ]);

  return {
    message: "Pending approvals",
    data: {
      companies: companies.map((c) => ({
        id: c._id,
        name: c.companyName,
        email: c.user?.email,
        bio: c.bio,
        createdAt: c.createdAt,
      })),
      professors: professors.map((p) => ({
        id: p._id,
        name: p.user?.name,
        email: p.user?.email,
        specialization: p.specialization,
        bio: p.bio,
        createdAt: p.createdAt,
      })),
    },
  };
};
