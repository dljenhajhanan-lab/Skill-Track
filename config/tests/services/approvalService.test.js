import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/ModelName.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../utils/someUtil.js", () => ({
  someUtil: jest.fn(),
}));

const { functionToTest } = await import("../../../services/fileService.js");
const Model = (await import("../../../models/ModelName.js")).default;

describe("functionToTest", () => {
  it("should do something", async () => {
    Model.find.mockResolvedValue([]);
    const result = await functionToTest();
    expect(Model.find).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
