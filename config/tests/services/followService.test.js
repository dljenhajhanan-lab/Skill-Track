import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/follow.js", () => ({
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const { getFollowers } = await import("../../../services/followservice.js");
const Follow = (await import("../../../models/follow.js")).default;

describe("getFollowers", () => {
  it("returns paginated followers", async () => {
    const mockQuery = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([
        { _id: 1, followerId: { name: "User 1" } },
      ]),
    };

    Follow.countDocuments.mockResolvedValue(5);
    Follow.find.mockReturnValue(mockQuery);

    const pagination = { skip: 0, limit: 2 };

    const result = await getFollowers("userId", pagination);

    expect(Follow.find).toHaveBeenCalled();
    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(5);
  });
});
