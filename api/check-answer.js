export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { correctAnswer, userAnswer, meaningJa } = req.body;

    if (!correctAnswer || !userAnswer) {
      return res.status(400).json({
        error: "correctAnswer and userAnswer are required"
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        input: [
          {
            role: "system",
            content:
              "You are an English vocabulary answer checker. Return only valid JSON."
          },
          {
            role: "user",
            content: `
Correct answer: ${correctAnswer}
Japanese meaning: ${meaningJa || ""}
User answer: ${userAnswer}

Judge if the user's answer is correct.
Be lenient for small capitalization mistakes.
Return JSON with:
{
  "isCorrect": true or false,
  "score": 0-100,
  "correctAnswer": "...",
  "userAnswer": "...",
  "shortFeedbackJa": "..."
}
`
          }
        ]
      })
    });

    const data = await response.json();

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        isCorrect: false,
        score: 0,
        correctAnswer,
        userAnswer,
        shortFeedbackJa: "AIの返答を読み取れませんでした。"
      };
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      detail: error.message
    });
  }
}