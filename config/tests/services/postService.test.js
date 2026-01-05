import { jest } from "@jest/globals";

await jest.unstable_mockModule("../../../models/post.js", () => ({
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/follow.js", () => ({
  default: {
    find: jest.fn(),
  },
}));

await jest.unstable_mockModule("../../../models/ProfessorActivity.js", () => ({
  default: {
    findOneAndUpdate: jest.fn(),
  },
}));

const {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getVisiblePosts,
} = await import("../../../services/postService.js");

const Post = (await import("../../../models/post.js")).default;
const Follow = (await import("../../../models/follow.js")).default;
const ProfessorActivity = (await import("../../../models/ProfessorActivity.js")).default;

describe("postService", () => {

  it("creates post normally", async () => {
    Post.create.mockResolvedValue({ title: "Post" });

    const user = { _id: "u1", role: "student" };
    const req = { body: { title: "Post", content: "Content" }, files: {} };

    const result = await createPost(user, req);

    expect(Post.create).toHaveBeenCalled();
    expect(result.title).toBe("Post");
  });

  it("increments professor activity when role is professor", async () => {
    Post.create.mockResolvedValue({ title: "Post" });

    const user = { _id: "p1", role: "professor" };
    const req = { body: { title: "Post", content: "Content" }, files: {} };

    await createPost(user, req);

    expect(ProfessorActivity.findOneAndUpdate).toHaveBeenCalled();
  });

  it("returns post if exists", async () => {
    Post.findById.mockResolvedValue({ title: "Post" });

    const result = await getPostById("postId");

    expect(result.title).toBe("Post");
  });

  it("throws error if post not found", async () => {
    Post.findById.mockResolvedValue(null);

    await expect(getPostById("postId")).rejects.toThrow("Post not found");
  });

  it("updates post when user is owner", async () => {
    const post = {
      authorId: "u1",
      save: jest.fn(),
    };

    Post.findById.mockResolvedValue(post);

    const user = { _id: "u1" };

    const result = await updatePost(user, "postId", { title: "New" });

    expect(post.save).toHaveBeenCalled();
    expect(result).toBe(post);
  });

  it("throws error when user is not owner", async () => {
    Post.findById.mockResolvedValue({ authorId: "u2" });

    const user = { _id: "u1" };

    await expect(
      updatePost(user, "postId", { title: "New" })
    ).rejects.toThrow("Not allowed");
  });

  it("allows admin to delete post", async () => {
    const post = {
      authorId: "u1",
      save: jest.fn(),
    };

    Post.findById.mockResolvedValue(post);

    const user = { _id: "admin", role: "admin" };

    const result = await deletePost(user, "postId");

    expect(post.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("returns visible posts for student", async () => {
    Follow.find.mockReturnValue({
      distinct: jest.fn().mockResolvedValue(["f1"]),
    });

    Post.countDocuments.mockResolvedValue(1);

    Post.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([{ title: "Post" }]),
    });

    const user = { _id: "u1", role: "student" };

    const result = await getVisiblePosts(user, { page: 1, limit: 10 });

    expect(result.data.length).toBe(1);
    expect(result.pagination.total).toBe(1);
  });

  it("returns visible posts for professor", async () => {
    Follow.find.mockReturnValue({
      distinct: jest.fn().mockResolvedValue([]),
    });

    Post.countDocuments.mockResolvedValue(0);

    Post.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    });

    const user = { _id: "p1", role: "professor" };

    const result = await getVisiblePosts(user, { page: 1, limit: 10 });

    expect(result.data).toEqual([]);
  });
});
