export default async function handler(req, res) {
    console.log('ASK API HIT');
    console.log('method:', req.method);
    console.log('body:', req.body);
    console.log('apiKey exists:', !!process.env.OPENAI_API_KEY);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { targetLanguage, examType, level, focus, uiLang } = req.body;

        if (!targetLanguage || !examType || !level || !focus) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OpenAI API key not configured' });
        }

        const uiLangMap = {
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

        const prompt = `You are an expert language exam trainer.

Generate ONE Japanese sentence that could realistically appear in an essay written by a student preparing for the following exam:

Exam: {examType}
Level / Band: {level}
Focus: {focus}

Requirements:

1. The sentence should represent the level required for this exam level.
2. It should contain abstract or academic ideas typical in exam writing.
3. It should be suitable for translation practice into the target language.
4. Avoid extremely long sentences (20–35 Japanese characters is ideal).
5. Do NOT include explanations.
6. Output ONLY the Japanese sentence.

The sentence should reflect typical themes seen in language exams such as:
- education
- environment
- technology
- government policy
- economic development
- social change
- globalization

Return only the sentence.`;

        console.log('about to call OpenAI');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a language exam prompt generator.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });

        const raw = await response.text();
        console.log('OpenAI status:', response.status);
        console.log('OpenAI raw:', raw);

        let data = null;
        try {
            data = JSON.parse(raw);
        } catch {
            return res.status(500).json({
                error: `Failed to parse OpenAI response: ${raw}`
            });
        }

        if (!response.ok) {
            return res.status(500).json({
                error: data?.error?.message || raw || 'OpenAI API request failed'
            });
        }

        const text = data?.choices?.[0]?.message?.content?.trim();

        if (!text) {
            return res.status(500).json({
                error: `No prompt text found in OpenAI response: ${raw}`
            });
        }

        return res.status(200).json({ text });

    } catch (error) {
        console.error('ask.js Error:', error);
        return res.status(500).json({ error: error.message });
    }
}