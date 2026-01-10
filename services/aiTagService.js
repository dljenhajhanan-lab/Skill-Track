import axios from "axios";

export const extractTagsWithAI = async (title, content) => {
  const generateFallbackTags = () => {
    const text = `${title} ${content}`.toLowerCase();

    return [
      ...new Set(
        text
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 3)
          .slice(0, 6)
      ),
    ];
  };

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
        timeout: 8000,
      }
    );

    let text = response.data.choices[0].message.content;

    text = text
      .replace(/```json|```/g, "")
      .replace(/[\u2028\u2029]/g, "")
      .trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      return generateFallbackTags();
    }

    const parsed = JSON.parse(text.slice(start, end + 1));

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return generateFallbackTags();
    }

    return [...new Set(parsed.map(t => t.toLowerCase().trim()))];

  } catch (err) {
    return generateFallbackTags();
  }
};
