import axios from "axios";

export const extractTagsWithAI = async (title, content) => {
  try {
    const prompt = `
Extract 5–8 short topic tags (Arabic or English).
Return ONLY a JSON array of strings.
No markdown. No explanation.

Title:
${title}

Content:
${content}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.choices[0].message.content.trim();

    text = text.replace(/```json|```/g, "").trim();

    const tags = JSON.parse(text);

    return [...new Set(tags.map(t => t.toLowerCase().trim()))];
  } catch (err) {
    console.error("AI Error:", err.message);
    return [];
  }
};
