import { openai } from "../config/openai.js";
import Tag from "../models/tag.js";

export const extractTagsFromQuestion = async (title, description = "") => {
  const prompt = `
    Extract 5 to 8 short topic tags (English or Arabic) that describe the following question.
    Return only a JSON array of strings.
    Title: "${title}"
    Description: "${description}"
  `.trim();


  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You extract concise topic tags as a JSON array." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  let tags = [];
  const content = response.choices?.[0]?.message?.content?.trim() || "[]";
  try {
    tags = JSON.parse(content);
  } catch {
    tags = content.split(/[,،؛\n]/).map(s => s.trim()).filter(Boolean);
  }
  tags = [...new Set(tags.map(t => t.toLowerCase()))].filter(t => t.length > 1).slice(0, 10);
  return tags;
};

export const createTagsForQuestion = async (postId, tags) => {
  return Tag.findOneAndUpdate(
    { post: postId },
    { $set: { tags, source: "openai" } },
    { new: true, upsert: true }
  );
};

export const getTagsByPost = async (postId) => {
  const doc = await Tag.findOne({ post: postId }).lean();
  return doc?.tags || [];
};

export const getSimilarQuestionsByTags = async (tags, excludePostId = null, limit = 10) => {
  const query = excludePostId ? { post: { $ne: excludePostId }, tags: { $in: tags } } : { tags: { $in: tags } };
  const rows = await Tag.find(query).limit(limit).lean();
  return rows.map(r => r.post);
};
