import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/ProfessorActivity.js", () => ({
  default: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

const { getProfessorsLeaderboard } = await import(
  "../../../services/leaderboardService.js"
);
const ProfessorActivity = (await import(
  "../../../models/ProfessorActivity.js"
)).default;

describe("getProfessorsLeaderboard", () => {
  it("returns leaderboard", async () => {
    ProfessorActivity.countDocuments.mockResolvedValue(1);

    const mockQuery = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([
        { professor: "p1", totalPoints: 10 },
      ]),
    };

    ProfessorActivity.find.mockReturnValue(mockQuery);

    const result = await getProfessorsLeaderboard({ page: 1, limit: 10 });

    expect(ProfessorActivity.countDocuments).toHaveBeenCalled();
    expect(ProfessorActivity.find).toHaveBeenCalled();
    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(1);
    expect(result.data[0].totalPoints).toBe(10);
  });
});
