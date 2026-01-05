import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/companyTask.js", () => ({
  CompanyTask: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const { getAllTasks } = await import(
  "../../../services/companyTask.js"
);
const { CompanyTask } = await import("../../../models/companyTask.js");

describe("getAllTasks", () => {
  it("returns paginated tasks", async () => {
    CompanyTask.countDocuments.mockResolvedValue(1);

    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([
        { _id: "t1", title: "Task 1" },
      ]),
    };

    CompanyTask.find.mockReturnValue(mockQuery);

    const result = await getAllTasks({ page: 1, limit: 10 });

    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(1);
  });
});
