import { jest } from "@jest/globals";
import { AppError } from "../../../utils/appError.js";

const Question = (await import("../../../models/question.js")).default;

await jest.unstable_mockModule("../../../models/question.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/comment.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/tag.js", () => ({
  default: {
    findOne: jest.fn(),
  },
}));

const {
  deleteQuestion,
  getQuestionDetails,
} = await import("../../../services/questionService.js");

describe("questionService", () => {
  describe("deleteQuestion", () => {
    it("allows owner to delete question", async () => {
      const mockQuestion = {
        authorId: "user1",
        deletedAt: null,
        save: jest.fn(),
      };

      Question.findById.mockResolvedValue(mockQuestion);

      const result = await deleteQuestion(
        { _id: "user1", role: "student" },
        "q1"
      );

      expect(mockQuestion.deletedAt).toBeInstanceOf(Date);
      expect(result).toBe(true);
    });

    it("allows admin to delete question", async () => {
      const mockQuestion = {
        authorId: "user1",
        deletedAt: null,
        save: jest.fn(),
      };

      Question.findById.mockResolvedValue(mockQuestion);

      const result = await deleteQuestion(
        { _id: "admin1", role: "admin" },
        "q1"
      );

      expect(result).toBe(true);
    });
  });

  describe("getQuestionDetails", () => {
    it("throws error if question not found", async () => {
    Question.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });

    await expect(getQuestionDetails("invalid-id"))
      .rejects
      .toThrow(AppError);
  });

  });
});
