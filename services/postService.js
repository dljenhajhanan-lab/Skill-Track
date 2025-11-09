import Post from "../models/post.js";
import { AppError } from "../utils/appError.js";

const roleMap = {
  student: ["post", "question"],
  professor: ["post"],
  company: ["post", "task"]
};

export const createPost = async (user, payload) => {
  const { type, title, description, link, file } = payload;
  if (!roleMap[user.role]?.includes(type)) throw new AppError("Not allowed", 403);
  const post = await Post.create({
    authorId: user._id,
    type,
    title,
    description,
    link,
    file,
    visibility: user.role === "student" ? { scope: "followers_only" } : { scope: "public" }
  });
  return post;
};

export const deletePost = async (user, id) => {
  const post = await Post.findById(id);
  if (!post) throw new AppError("Not found", 404);
  if (String(post.authorId) !== String(user._id) && user.role !== "admin") throw new AppError("Not allowed", 403);
  post.deletedAt = new Date();
  await post.save();
  return true;
};

export const getPost = async (id) => {
  const post = await Post.findById(id).populate("authorId", "name role").lean();
  if (!post || post.deletedAt) throw new AppError("Not found", 404);
  return post;
};
