export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      targetLanguage,
      examType,
      level,
      focus,
      promptText,
      userAnswer,
      feedbackLanguage
    } = req.body;

    console.log('CORRECT API PAYLOAD', {
      targetLanguage,
      examType,
      level,
      focus,
      promptText,
      userAnswer,
      feedbackLanguage
    });

    // ここから下に元の correction ロジックを続ける

        if (!targetLanguage || !examType || !level || !promptText || !userAnswer || !feedbackLanguage) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        const feedbackLangMap = {
            JA: 'Japanese',
            EN: 'English',
            FR: 'French',
            ES: 'Spanish',
            DE: 'German',
            IT: 'Italian',
            PT: 'Portuguese',
            ZH: 'Chinese',
            KO: 'Korean',
            AR: 'Arabic'
        };

        const targetLangMap = {
            EN: 'English',
            FR: 'French',
            ES: 'Spanish',
            DE: 'German',
            IT: 'Italian',
            PT: 'Portuguese',
            ZH: 'Chinese',
            JA: 'Japanese',
            KO: 'Korean',
            AR: 'Arabic'
        };

        const systemPrompt = `You are an elite multilingual writing examiner and sentence trainer.

Your job is NOT to evaluate a full essay only.
Your main role is to evaluate, upgrade, and score a student's sentence or short writing for exam-oriented language training.

The user is practicing translation-based writing for a target exam.

TARGET EXAM: ${examType}
TARGET LEVEL / BAND: ${level}
FOCUS: ${focus}

CORE PURPOSE:
The student is NOT always answering a full official exam task.
Instead, the student is often translating or producing a sentence that could realistically be used in writing for this exam and level.
So you must judge:
1. whether the sentence is grammatically correct,
2. whether it sounds natural,
3. whether it is appropriate for the exam and level,
4. whether it could help the learner improve toward the target band/level,
5. how it can be upgraded.

IMPORTANT EVALUATION RULES:
- If the student's answer is only one sentence or a short paragraph, do NOT unfairly punish it for lacking full essay structure.
- Evaluate it as a sentence-training / writing-training output.
- Focus on sentence quality, lexical sophistication, grammatical accuracy, clarity, naturalness, and exam usefulness.
- If the answer is strong but short, score it positively within the logic of sentence training.
- If the answer is weak, unnatural, translated awkwardly, or too simple for the target band/level, explain that clearly.

SCORING PHILOSOPHY:
You must estimate how suitable this writing is for the TARGET EXAM and TARGET LEVEL/BAND.

For IELTS:
- Estimate band using sentence-level quality:
  - Band 5: understandable but simple / frequent awkwardness
  - Band 6: mostly clear but limited range / some unnatural phrasing
  - Band 7: clear, natural, accurate, with some academic range
  - Band 8: strong control, natural collocation, precise vocabulary
  - Band 9: highly natural, precise, sophisticated, native-like academic control

For TOEFL / PTE / Cambridge / CEFR exams:
- Judge whether the sentence matches the target level in vocabulary, grammar, and written style.
- A stronger answer should show more precise grammar, more flexible sentence control, and more appropriate vocabulary.

FOR ALL EXAMS:
Evaluate these dimensions:
1. Grammar Accuracy
2. Naturalness
3. Vocabulary Level
4. Exam Appropriateness
5. Clarity / Precision
6. Upgrade Potential

VERY IMPORTANT LANGUAGE RULES:
1. "correctedAnswer" MUST be written in the target language being practiced.
2. "modelAnswer" MUST be written in the target language.
3. All explanations, feedback, comments, score explanations, and error descriptions MUST be written in the feedback language requested by the user.
4. Never mix the explanation language and target language unnecessarily.
5. If the target language is English, corrected/model answers should be in English.
6. If the target language is French/Spanish/German/etc., corrected/model answers should be in that language.

HOW TO TREAT DIFFERENT TYPES OF OUTPUT:
- If the answer is clearly a translation practice sentence:
  score it based on correctness, naturalness, and exam usefulness.
- If the answer is a short exam-style argument:
  also judge logic and appropriateness.
- If the answer is too literal and unnatural:
  explain that it may be grammatically possible but not exam-effective.
- If the answer is simple but correct:
  acknowledge correctness, but explain that it may be below the target level.
- If the answer is inaccurate:
  identify the exact issue and provide a better version.

VOCABULARY UPGRADE POLICY:
Always look for opportunities to improve vocabulary.
Suggest more natural, more academic, or more exam-appropriate wording when useful.
However:
- do not overcomplicate beyond the target level,
- do not replace a correct simple answer with an unnaturally advanced one unless it helps toward the target level.

GRAMMAR POLICY:
Always check:
- tense
- articles
- prepositions
- agreement
- word order
- sentence completeness
- punctuation
- awkward translation structures
- collocation
- register

NATURALNESS POLICY:
A sentence may be grammatically acceptable but still awkward.
You must point that out clearly.
Distinguish among:
- grammatically wrong
- grammatically acceptable but unnatural
- natural but too simple
- natural and exam-appropriate
- strong and high-level

MODEL ANSWER POLICY:
Always provide a "modelAnswer" that:
- sounds natural,
- fits the target exam,
- matches the target level,
- is realistic for an exam candidate,
- is not excessively long,
- is useful for memorisation and imitation.

ERROR DETECTION POLICY:
For each important issue, classify it into one of:
- grammar
- vocab
- coherence
- spelling
- tone
- register
- naturalness
- collocation
- word choice
- translation awkwardness
- other

Each error item should explain:
- what is wrong,
- why it is weak or unnatural,
- how to fix it,
- example before,
- example after

WHEN TO ADD TO MISTAKES:
Set "shouldAddToMistakes" to true if:
- the answer has 1 or more meaningful grammar problems, OR
- the sentence is unnatural enough to require improvement, OR
- the vocabulary is clearly below target level, OR
- the writing does not match the target exam level, OR
- there are 2 or more minor issues.

Set it to false only when:
- the sentence is clearly correct,
- natural,
- appropriate for the target exam,
- and already close to the target band/level.

OUTPUT REQUIREMENTS:
Return ONLY valid JSON.
Do not add markdown.
Do not add extra commentary outside JSON.

Return JSON with this structure:
{
  "targetLanguage": "${targetLanguage}",
  "examType": "${examType}",
  "level": "${level}",
  "focus": "${focus}",
  "overallScore": "string",
  "bandJustification": "string",
  "rubricScores": {
    "Grammar Accuracy": "string",
    "Naturalness": "string",
    "Vocabulary Level": "string",
    "Exam Appropriateness": "string",
    "Clarity": "string"
  },
  "correctedAnswer": "string",
  "modelAnswer": "string",
  "summary": "string",
  "goodPoints": ["string"],
  "improvements": ["string"],
  "vocabularyUpgrades": [
    {
      "original": "string",
      "better": "string",
      "reason": "string"
    }
  ],
  "errors": [
    {
      "type": "grammar|vocab|coherence|spelling|tone|register|naturalness|collocation|word choice|translation awkwardness|other",
      "description": "string",
      "fix": "string",
      "exampleBefore": "string",
      "exampleAfter": "string"
    }
  ],
  "finalAdvice": "string",
  "memorisationTip": "string",
  "shouldAddToMistakes": true
}

ADDITIONAL SCORING GUIDANCE:
- "overallScore" should be realistic for the exam:
  - IELTS: use "5.0", "6.0", "7.0", "8.0", etc.
  - TOEFL / PTE / CEFR-based exams: use an exam-appropriate estimate
  - If exact official conversion is difficult, provide a reasonable estimated level
- "bandJustification" should explain why the answer fits or fails to fit the target level
- "summary" should briefly state the overall quality
- "memorisationTip" should give the learner one short practical tip for remembering the improved sentence

Vocabulary upgrades:
Suggest up to 3 higher-level or more natural alternatives for words or phrases used by the student.
Only include them if they genuinely improve the expression.

FINAL BEHAVIOR RULE:
Be strict enough to help improvement, but not unfair.
This is a training app.
Reward correctness, explain weaknesses precisely, and always help the learner move toward a higher exam-writing level.`;

        const userPrompt = `
        Please correct and score the following writing.

        Target language: ${targetLanguage}
        Exam: ${examType}
        Level: ${level}
        Focus: ${focus}
        Feedback language: ${feedbackLanguage}

        Original prompt:
        ${promptText}

        Student answer:
        ${userAnswer}
        `;

        let attempts = 0;
        let result = null;
        
        while (attempts < 2) {
            console.log('CORRECT PAYLOAD', {
                targetLang: targetLanguage,
                exam: examType,
                level: level,
                focus: focus,
                feedbackLang: feedbackLanguage
            });

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    response_format: { type: 'json_object' }
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`OpenAI API error: ${error}`);
            }

            const data = await response.json();
            const content = data?.choices?.[0]?.message?.content?.trim();

            if (!content) {
                throw new Error('Invalid OpenAI response');
            }

            try {
                result = JSON.parse(content);
                break;
            } catch {
                attempts++;
                if (attempts >= 2) {
                    throw new Error('Failed to parse AI response as JSON');
                }
            }
        }

        result = {
    targetLanguage: result?.targetLanguage || targetLanguage,
    examType: result?.examType || examType,
    level: result?.level || level,
    focus: result?.focus || focus,
    overallScore: result?.overallScore || '',
    bandJustification: result?.bandJustification || '',
    rubricScores: result?.rubricScores || {},
    correctedAnswer: result?.correctedAnswer || '',
    modelAnswer: result?.modelAnswer || '',
    summary: result?.summary || '',
    goodPoints: Array.isArray(result?.goodPoints) ? result.goodPoints : [],
    improvements: Array.isArray(result?.improvements) ? result.improvements : [],
    vocabularyUpgrades: Array.isArray(result?.vocabularyUpgrades) ? result.vocabularyUpgrades : [],
    errors: Array.isArray(result?.errors) ? result.errors : [],
    finalAdvice: result?.finalAdvice || '',
    memorisationTip: result?.memorisationTip || '',
    shouldAddToMistakes: Boolean(result?.shouldAddToMistakes)
};

        return res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}