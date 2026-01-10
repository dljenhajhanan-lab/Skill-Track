import User from "../models/user.js";
import Post from "../models/post.js";
import { AppError } from "../utils/appError.js";
import Follow from "../models/follow.js";
import ProfessorActivity from "../models/ProfessorActivity.js"
import { normalizePagination } from "../utils/paginate.js"
import { sendNotification } from "./notification.service.js";
import { addPoints } from "./points.js";
import Profile from "../models/profile.js";
import Comment from "../models/comment.js"

export const createPost = async (user, req) => {
  const imageUrl = req.files?.image?.[0]?.path || null;

  const newPost = await Post.create({
    title: req.body.title,
    content: req.body.content,
    imageUrl,
    linkUrl: req.body.linkUrl,
    authorId: user._id,
    authorRole: user.role,
  });

  await addPoints({
    studentId: user._id,
    type: "POST",
    points: 2,
    reason: "Created a new post",
    referenceId: newPost._id,
  });


  let receivers = [];

  switch (user.role) {
    case "student": {
      const followers = await Follow.find({ following: user._id })
        .select("follower");
      receivers = followers.map(f => f.follower);
      break;
    }

    case "professor": {
      const students = await User.find({ role: "student" }).select("_id");
      receivers = students.map(s => s._id);
      break;
    }

    case "company": {
      const students = await User.find({ role: "student" }).select("_id");
      receivers = students.map(s => s._id);
      break;
    }
  }

  const usersToNotify = await User.find({
    _id: { $in: receivers },
    fcmToken: { $ne: null },
  });

  for (const receiver of usersToNotify) {
    await sendNotification(
      user._id,
      receiver._id,
      "New Post Published",
      `${user.fullName} published a new post`,
      {
        postId: newPost._id.toString(),
        type: "POST",
      }
    );
  }

  if (user.role === "professor") {
    await ProfessorActivity.findOneAndUpdate(
      { professor: user._id },
      {
        $inc: {
          postsCount: 1,
          totalPoints: 3,
        },
      },
      { upsert: true }
    );
  }

  return newPost;
};


export const getAllPosts = async () => {
  return await Post.find({ deletedAt: null }).sort({ createdAt: -1 });
};

export const getPostById = async (postId) => {
  const post = await Post.findOne({
    _id: postId,
    deletedAt: null
  }).populate("authorId", "fullName role email avatar");

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const comments = await Comment.find({
    targetType: "post",
    targetId: postId,
    deletedAt: null
  })
    .sort({ createdAt: 1 })
    .populate("authorId", "fullName role avatar");

  return {
    post,
    comments
  };
};

export const updatePost = async (user, postId, data) => {
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (String(post.authorId) !== String(user._id))
    throw new AppError("Not allowed", 403);

  if (data.title) post.title = data.title;
  if (data.content) post.content = data.content;
  await post.save();
  return post;
};

export const deletePost = async (user, postId) => {
  const post = await Post.findById(postId);
  if (!post || post.deletedAt) throw new AppError("Post not found", 404);
  if (String(post.authorId) !== String(user._id) && user.role !== "admin")
    throw new AppError("Not allowed", 403);

  post.deletedAt = new Date();
  await post.save();
  return true;
};

export const getVisiblePosts = async (user, pagination = {}) => {
  const { page, limit, skip } = normalizePagination(pagination);

  const followingIds = await Follow.find({ followerId: user._id }).distinct("followingId");

  let filter = { deletedAt: null };
  switch (user.role) {
    case "student":
      filter.$or = [
        { authorId: user._id },
        { authorRole: "professor" },
        { authorRole: "company" },
        { authorRole: "student", authorId: { $in: followingIds } }
      ];
      break;
    case "professor":
      filter.$or = [
        { authorId: user._id },
        { authorRole: "student" },
        { authorRole: "professor" }
      ];
      break;
    case "company":
      filter.$or = [
        { authorId: user._id },
        { authorRole: "company" },
        { authorRole: "student" }
      ];
      break;
  }

  const total = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "fullName role email avatar");


  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
