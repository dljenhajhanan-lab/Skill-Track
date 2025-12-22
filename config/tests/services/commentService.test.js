import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/comment.js", () => ({
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const { getChildComments } = await import("../../../services/commentService.js");
const Comment = (await import("../../../models/comment.js")).default;

describe("getChildComments service", () => {
  it("should return paginated child comments", async () => {
    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([
        { _id: "1", content: "reply 1" },
        { _id: "2", content: "reply 2" },
      ]),
    };

    Comment.find.mockReturnValue(mockQuery);
    Comment.countDocuments.mockResolvedValue(3);

    const pagination = { page: 1, limit: 2, skip: 0 };

    const result = await getChildComments("parentId", pagination);

    expect(Comment.find).toHaveBeenCalled();
    expect(result.data.length).toBe(2);
    expect(result.pagination.total).toBe(3);
  });
});
