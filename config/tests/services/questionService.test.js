await jest.unstable_mockModule("../../../models/question.js", () => ({
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const { listQuestions } = await import("../../../services/questionService.js");
const Question = (await import("../../../models/question.js")).default;

describe("listQuestions", () => {
  it("returns paginated questions", async () => {
    Question.countDocuments.mockResolvedValue(10);
    Question.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ title: "Q1" }]),
    });

    const result = await listQuestions({ skip: 0, limit: 1 });

    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(10);
  });
});
