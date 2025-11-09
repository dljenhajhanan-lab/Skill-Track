import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Tag from "../models/tag.js";
import { extractTagsFromQuestion, createTagsForQuestion } from "./tagService.js";
import { AppError } from "../utils/appError.js";

const canCreateMap = {
  student: ["post", "question"],
  professor: ["post"],
  company: ["post", "task"]
};

export const createQuestionWithTags = async (user, payload) => {
  const { type, title, description, link, file } = payload;
  if (!canCreateMap[user.role]?.includes(type)) throw new AppError("Not allowed to create this type", 403);
  const post = await Post.create({
    authorId: user._id,
    type,
    title,
    description,
    link,
    file,
    visibility: user.role === "student" ? { scope: "followers_only" } : { scope: "public" }
  });
  if (type === "question") {
    try {
      const tags = await extractTagsFromQuestion(title, description);
      if (tags.length) await createTagsForQuestion(post._id, tags);
    } catch {}
  }
  return post;
};

//todo
export const listQuestions = async () => {
  const questions = await Post.find({ type: "question", deletedAt: null })
    .sort({ createdAt: -1 })
    .populate("authorId", "name role")
    .lean();
  const ids = questions.map(q => q._id);
  const countsAgg = await Comment.aggregate([
    { $match: { postId: { $in: ids }, deletedAt: null } },
    { $group: { _id: "$postId", count: { $sum: 1 } } }
  ]);
  const mapCounts = Object.fromEntries(countsAgg.map(c => [String(c._id), c.count]));
  const tagDocs = await Tag.find({ post: { $in: ids } }).lean();
  const mapTags = Object.fromEntries(tagDocs.map(t => [String(t.post), t.tags]));
  return questions.map(q => ({
    _id: q._id,
    title: q.title,
    author: q.authorId,
    createdAt: q.createdAt,
    commentCount: mapCounts[String(q._id)] || 0,
    tags: mapTags[String(q._id)] || []
  }));
};

export const getQuestionDetails = async (postId) => {
  const post = await Post.findById(postId).populate("authorId", "name role").lean();
  if (!post || post.type !== "question" || post.deletedAt) throw new AppError("Question not found", 404);
  const comments = await Comment.find({ postId, deletedAt: null })
    .populate("authorId", "name role")
    .sort({ createdAt: 1 })
    .lean();
  const tagDoc = await Tag.findOne({ post: postId }).lean();
  const reactions = {
    postReactions: post?.counters?.reactions || 0,
    commentReactions: comments.reduce((a, c) => a + (c?.counters?.reactions || 0), 0)
  };
  return { question: post, tags: tagDoc?.tags || [], comments, reactions };
};
