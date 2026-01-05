import { jest } from "@jest/globals";
import { AppError } from "../../../utils/appError.js";

await jest.unstable_mockModule("../../../models/company.js", () => ({
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/professor.js", () => ({
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../utils/sendEmail.js", () => ({
  sendEmail: jest.fn(),
}));

const { updateStatus } = await import(
  "../../../services/approvalService.js"
);

const Company = (await import("../../../models/company.js")).default;
const Professor = (await import("../../../models/professor.js")).default;

describe("approvalService", () => {
  it("approves company", async () => {
    const mockDoc = {
      user: { email: "c@test.com", name: "Company" },
      approvalStatus: "pending",
      save: jest.fn(),
    };

    Company.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockDoc),
    });

    const result = await updateStatus("company", "id1", "approved");

    expect(result.data.approvalStatus).toBe("approved");
  });

  it("approves professor", async () => {
    const mockDoc = {
      user: { email: "p@test.com", name: "Prof" },
      approvalStatus: "pending",
      save: jest.fn(),
    };

    Professor.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockDoc),
    });

    const result = await updateStatus("professor", "id2", "approved");

    expect(result.data.approvalStatus).toBe("approved");
  });

  it("throws error for invalid role", async () => {
    await expect(
      updateStatus("student", "id3", "approved")
    ).rejects.toThrow(AppError);
  });
});
