import axios from "axios";

export const evaluateStudentProfileWithAI = async ({
  position,
  badges,
}) => {
  try {
    const prompt = `
You are a senior technical recruiter and backend software architect.

IMPORTANT:
- The student HAS earned the following badges.
- Each badge represents a VERIFIED technical skill.
- Projects and achievements listed are REAL and COMPLETED.
- Do NOT say "no badges" unless the badges array is empty.

Your task:
Evaluate the student based on ACTUAL evidence provided.

Position:
${position}

Badges and Evidence:
${JSON.stringify(badges, null, 2)}

Evaluation rules:
- Consider PHP and MySQL as backend skills.
- Analyze project difficulty from description (CRUD, validation, system design).
- Analyze achievement importance (security, data validation, architecture).
- Badge level reflects experience maturity.
- One strong backend project is better than many weak ones.

Respond ONLY with valid JSON:

{
  "overall_score": number (0-100),
  "level": "poor" | "average" | "good" | "excellent",
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string],
  "role_fit": {
    "position": string,
    "fit_score": number (0-100),
    "missing_skills": [string]
  }
}
`;


    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    const json = JSON.parse(text.slice(start, end));

    return json;
  } catch (error) {
    console.error(
      "AI Evaluation Error:",
      error.response?.data || error.message
    );

    return {
      overall_score: 0,
      level: "poor",
      strengths: [],
      weaknesses: ["AI service unavailable"],
      recommendations: ["Try again later"],
      role_fit: {
        fit_score: 0,
        missing_skills: [],
      },
    };
  }
};
