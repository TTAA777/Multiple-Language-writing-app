import React, { useEffect, useMemo, useRef, useState } from "react";

/*
  WriteVocab Beta - VS Code / Vite compatible version

  Paste this into: src/App.jsx

  Why this version exists:
  - No lucide-react dependency
  - No shadcn/ui dependency
  - No @/ path alias
  - No framer-motion dependency
  - Works as a normal React component in VS Code + Vite

  AI split:
  - OpenAI: /api/generate-pack  vocabulary + word questions + sentence prompts
  - Local JS: instant word marking and basic sentence checks
  - Claude: /api/check-sentence sentence feedback only
  - localStorage: generated packs, mistakes, history

  If the backend APIs do not exist yet, this app automatically uses mock data.
*/

const STORAGE_KEYS = {
  PACKS: "writevocab_packs_v2",
  MISTAKES: "writevocab_mistakes_v2",
  HISTORY: "writevocab_history_v2",
};

const LEVELS = {
  IELTS: ["Band 5.0", "Band 6.0", "Band 7.0", "Band 8.0"],
  TOEIC: ["400-550", "550-700", "700-850", "850+"],
  TOEFL: ["Basic", "Intermediate", "Advanced"],
  Eiken: ["準2級", "2級", "準1級", "1級"],
  Academic: ["Foundation", "Undergraduate", "Advanced"],
  Business: ["Basic", "Intermediate", "Advanced"],
  Daily: ["Beginner", "Intermediate", "Natural"],
  SuperAcademic: ["A-Level", "University", "Research"],
  Global: ["Standard", "Advanced", "Academic"],
};

const TOPICS = {
  IELTS: ["Education", "Environment", "Technology", "Health", "Work", "Society", "Crime", "Urbanisation", "Globalisation"],
  TOEIC: ["Office", "Marketing", "Finance", "Management", "Travel", "Meetings", "Email", "Customer Service"],
  TOEFL: ["Campus Life", "Science", "History", "Psychology", "Environment", "Literature", "Research"],
  Eiken: ["社会", "教育", "環境", "科学技術", "国際問題", "日常表現"],
  Academic: ["Argument", "Analysis", "Cause and Effect", "Evidence", "Evaluation", "Comparison"],
  Business: ["Negotiation", "Presentation", "Sales", "Finance", "Leadership", "Operations"],
  Daily: ["Travel", "Food", "Friends", "School", "Shopping", "Feelings", "Plans"],
  SuperAcademic: ["A-Level History", "A-Level Geography", "Political Geography", "Geopolitics", "Economics", "International Relations", "Research Writing", "Methodology"],
  Global: ["Climate Change", "Migration", "Conflict", "Development", "Trade", "Aid", "Tourism", "Inequality"],
};

const CATEGORIES = [
  { id: "IELTS", title: "IELTS", subtitle: "IELTS Writing Vocabulary", icon: "📘" },
  { id: "TOEIC", title: "TOEIC", subtitle: "Business & Test Vocabulary", icon: "💼" },
  { id: "TOEFL", title: "TOEFL", subtitle: "Academic English", icon: "🎓" },
  { id: "Eiken", title: "Eiken", subtitle: "英検", icon: "🏅" },
  { id: "Academic", title: "Academic", subtitle: "General Academic Vocabulary", icon: "📊" },
  { id: "Business", title: "Business", subtitle: "Business English", icon: "📈" },
  { id: "Daily", title: "Daily", subtitle: "Daily Conversation", icon: "💬" },
  { id: "SuperAcademic", title: "Super Academic", subtitle: "A-Level / University / Research", icon: "🏛️" },
  { id: "Global", title: "Global Issues", subtitle: "Politics / Geography / Society", icon: "🌍" },
];

const SEED_PACK = [
  {
    id: "seed-significant",
    word: "significant",
    meaningJa: "重要な / 大きな",
    example: "Education has a significant impact on future opportunities.",
    exampleJa: "教育は将来の機会に大きな影響を与える。",
    collocations: ["significant impact", "significant increase", "significant role"],
    wordQuestion: {
      type: "ja_to_en",
      promptJa: "『重要な / 大きな』を英語で書きなさい。",
      answer: "significant",
      acceptedAnswers: ["significant"],
    },
    sentencePrompt: "Use “significant” in one sentence about education.",
  },
  {
    id: "seed-sustainable",
    word: "sustainable",
    meaningJa: "持続可能な",
    example: "Governments should invest in sustainable transport.",
    exampleJa: "政府は持続可能な交通に投資すべきだ。",
    collocations: ["sustainable development", "sustainable transport", "sustainable future"],
    wordQuestion: {
      type: "fill_blank",
      promptJa: "空欄に入る英単語を書きなさい。",
      sentence: "Governments should promote ______ transport.",
      answer: "sustainable",
      acceptedAnswers: ["sustainable"],
    },
    sentencePrompt: "Use “sustainable” in one sentence about transport or the environment.",
  },
  {
    id: "seed-evaluate",
    word: "evaluate",
    meaningJa: "評価する / 判断する",
    example: "Students need to evaluate the reliability of historical evidence.",
    exampleJa: "生徒は歴史的証拠の信頼性を評価する必要がある。",
    collocations: ["evaluate evidence", "evaluate reliability", "critically evaluate"],
    wordQuestion: {
      type: "ja_to_en",
      promptJa: "『評価する / 判断する』を英語で書きなさい。",
      answer: "evaluate",
      acceptedAnswers: ["evaluate"],
    },
    sentencePrompt: "Use “evaluate” in one academic sentence about history, geography, or research.",
  },
  {
    id: "seed-mitigation",
    word: "mitigation",
    meaningJa: "緩和 / 軽減",
    example: "Hazard mitigation can reduce the impact of tropical storms.",
    exampleJa: "災害の軽減策は熱帯低気圧の影響を減らせる。",
    collocations: ["hazard mitigation", "climate mitigation", "mitigation strategy"],
    wordQuestion: {
      type: "fill_blank",
      promptJa: "空欄に入る英単語を書きなさい。",
      sentence: "Hazard ______ can reduce the impact of natural disasters.",
      answer: "mitigation",
      acceptedAnswers: ["mitigation"],
    },
    sentencePrompt: "Use “mitigation” in one sentence about natural hazards or climate change.",
  },
  {
    id: "seed-coherent",
    word: "coherent",
    meaningJa: "一貫した / 筋の通った",
    example: "A coherent argument is essential in academic writing.",
    exampleJa: "学術的な文章では一貫した議論が不可欠である。",
    collocations: ["coherent argument", "coherent structure", "coherent explanation"],
    wordQuestion: {
      type: "ja_to_en",
      promptJa: "『一貫した / 筋の通った』を英語で書きなさい。",
      answer: "coherent",
      acceptedAnswers: ["coherent"],
    },
    sentencePrompt: "Use “coherent” in one academic sentence about essay writing.",
  },
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can fail in private browsing. The app should not crash.
  }
}

function normalizeText(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’]/g, "")
    .replace(/\s+/g, " ");
}

function checkWordAnswer(userAnswer, acceptedAnswers = []) {
  const normalized = normalizeText(userAnswer);
  return acceptedAnswers.map(normalizeText).includes(normalized);
}

function basicSentenceCheck(userSentence, targetWord) {
  const text = normalizeText(userSentence);
  const word = normalizeText(targetWord);
  if (!text) return { passed: false, reasonJa: "英文を入力してください。" };
  if (!text.includes(word)) return { passed: false, reasonJa: `ターゲット単語 “${targetWord}” が入っていません。` };
  if (text.split(" ").length < 5) return { passed: false, reasonJa: "短すぎます。最低5語以上で書いてください。" };
  return { passed: true, reasonJa: "基本チェックOK。自然さをAIで確認できます。" };
}

function runRuntimeTests() {
  console.assert(checkWordAnswer(" Significant! ", ["significant"]), "Test failed: punctuation/case should be accepted");
  console.assert(!checkWordAnswer("significance", ["significant"]), "Test failed: wrong word should be rejected");
  console.assert(basicSentenceCheck("This is a significant change today", "significant").passed, "Test failed: valid sentence should pass");
  console.assert(!basicSentenceCheck("This is useful", "significant").passed, "Test failed: missing target word should fail");
}
runRuntimeTests();

async function openAIGeneratePack(selection) {
  const res = await fetch("/api/generate-pack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...selection, count: 12, provider: "openai" }),
  });
  if (!res.ok) throw new Error("OpenAI generation failed");
  return res.json();
}

async function claudeCheckSentence({ targetWord, prompt, userSentence, exam, level, category }) {
  const res = await fetch("/api/check-sentence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetWord, prompt, userSentence, exam, level, category, provider: "claude" }),
  });
  if (!res.ok) throw new Error("Claude sentence check failed");
  return res.json();
}

async function mockGeneratePack(selection) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    source: "mock-openai",
    items: SEED_PACK.map((item, index) => ({
      ...item,
      id: `${selection.exam}-${selection.level}-${selection.category}-${item.word}-${index}`,
      exam: selection.exam,
      level: selection.level,
      category: selection.category,
    })),
  };
}

async function mockClaudeCheck({ targetWord, userSentence }) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const basic = basicSentenceCheck(userSentence, targetWord);
  if (!basic.passed) {
    return {
      score: 0,
      grammarScore: 0,
      naturalnessScore: 0,
      targetWordUsedCorrectly: false,
      feedbackJa: basic.reasonJa,
      correctedSentence: "",
      betterSentence: "",
      tipJa: "まずターゲット単語を入れて、5語以上の文にしましょう。",
    };
  }
  return {
    score: 8,
    grammarScore: 8,
    naturalnessScore: 8,
    targetWordUsedCorrectly: true,
    feedbackJa: `“${targetWord}” は文の中で使えています。よりacademicにするなら、具体的な名詞や強い動詞と組み合わせると良いです。`,
    correctedSentence: userSentence.trim().replace(/\s+/g, " "),
    betterSentence: `This issue has a ${targetWord} impact on future opportunities.`,
    tipJa: "単語単体ではなく、collocationで覚えるとWritingで使いやすくなります。",
  };
}

function addHistory(entry) {
  const history = loadJSON(STORAGE_KEYS.HISTORY, []);
  saveJSON(STORAGE_KEYS.HISTORY, [{ id: makeId(), createdAt: new Date().toISOString(), ...entry }, ...history].slice(0, 500));
}

function addMistake(entry) {
  const mistakes = loadJSON(STORAGE_KEYS.MISTAKES, []);
  saveJSON(STORAGE_KEYS.MISTAKES, [{ id: makeId(), createdAt: new Date().toISOString(), status: "active", ...entry }, ...mistakes].slice(0, 300));
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function AppButton({ children, onClick, variant = "primary", disabled = false, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn ${variant}`}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Header({ view, setView }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setView("home")}>
        <span className="brandIcon">✍️</span>
        <span>
          <strong>WriteVocab</strong>
          <small>AI vocabulary notebook for iPad</small>
        </span>
        <em>Beta</em>
      </button>
      <nav className="nav">
        <button className={view === "mistakes" ? "navActive" : ""} onClick={() => setView("mistakes")}>ミスリスト</button>
        <button className={view === "plan" ? "navActive" : ""} onClick={() => setView("plan")}>プラン</button>
      </nav>
    </header>
  );
}

function HomeScreen({ onSelect, setView }) {
  return (
    <main className="page">
      <section className="hero">
        <h1>WriteVocab <span>Beta</span></h1>
        <p>手で書いて覚える英単語アプリ。OpenAIが問題を作り、単語は即時採点、短文だけClaudeが自然さまで添削します。</p>
        <AppButton onClick={() => document.getElementById("categoryGrid")?.scrollIntoView({ behavior: "smooth" })}>練習を始める →</AppButton>
      </section>

      <section id="categoryGrid" className="section">
        <h2>試験・カテゴリを選ぶ</h2>
        <div className="grid">
          {CATEGORIES.map((item) => (
            <button className="categoryCard" key={item.id} onClick={() => onSelect(item.id)}>
              <span className="categoryIcon">{item.icon}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="featureGrid">
        <button className="featureCard green" onClick={() => setView("mistakes")}>
          <strong>✨ 復習モード</strong>
          <span>間違えた単語だけを集中的に練習</span>
        </button>
        <div className="featureCard">
          <strong>🤖 AI分担</strong>
          <span>OpenAIで生成、Claudeで短文添削、JSで即時採点。</span>
        </div>
        <div className="featureCard">
          <strong>✏️ iPad Writing</strong>
          <span>Apple Pencil / touch対応の手書きキャンバス。</span>
        </div>
      </section>
    </main>
  );
}

function SelectionScreen({ exam, onBack, onStart }) {
  const [level, setLevel] = useState(LEVELS[exam]?.[0] || "Standard");
  const [category, setCategory] = useState(TOPICS[exam]?.[0] || "General");
  const levels = LEVELS[exam] || ["Standard"];
  const topics = TOPICS[exam] || ["General"];

  return (
    <main className="page narrow">
      <AppButton variant="ghost" onClick={onBack}>← 戻る</AppButton>
      <Card>
        <div className="cardHeader">
          <div>
            <p className="eyebrow">Practice Setup</p>
            <h2>{exam} の練習を作る</h2>
            <p>レベルと分野を選ぶと、OpenAIが単語・問題・短文プロンプトを生成します。</p>
          </div>
          <span className="bigIcon">🧠</span>
        </div>

        <div className="twoCols">
          <ChoiceGroup title="Level" items={levels} value={level} onChange={setLevel} />
          <ChoiceGroup title="Category / Topic" items={topics} value={category} onChange={setCategory} />
        </div>

        <div className="setupFooter">
          <div>
            <strong>{exam} / {level} / {category}</strong>
            <small>Word Mode + Sentence Mode + Mistake Notebook</small>
          </div>
          <AppButton onClick={() => onStart({ exam, level, category })}>AIで練習を作る ✨</AppButton>
        </div>
      </Card>
    </main>
  );
}

function ChoiceGroup({ title, items, value, onChange }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="choiceList">
        {items.map((item) => (
          <button key={item} className={value === item ? "choice active" : "choice"} onClick={() => onChange(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function usePack(selection) {
  const [packs, setPacks] = useState(() => loadJSON(STORAGE_KEYS.PACKS, {}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const key = selection ? `${selection.exam}__${selection.level}__${selection.category}` : "";
  const items = key ? packs[key]?.items || [] : [];

  async function generate(force = false) {
    if (!selection) return [];
    if (!force && packs[key]?.items?.length) return packs[key].items;
    setLoading(true);
    setError("");
    try {
      let data;
      try {
        data = await openAIGeneratePack(selection);
      } catch {
        data = await mockGeneratePack(selection);
      }
      const next = {
        ...packs,
        [key]: { items: data.items || [], source: data.source || "openai", createdAt: new Date().toISOString() },
      };
      setPacks(next);
      saveJSON(STORAGE_KEYS.PACKS, next);
      return data.items || [];
    } catch {
      setError("問題生成に失敗しました。もう一度試してください。");
      return [];
    } finally {
      setLoading(false);
    }
  }

  return { items, loading, error, generate };
}

function PracticeScreen({ selection, onBack }) {
  const { items, loading, error, generate } = usePack(selection);
  const [mode, setMode] = useState("word");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [wordResult, setWordResult] = useState(null);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);
  const [checking, setChecking] = useState(false);
  const writingRef = useRef(null);

  useEffect(() => {
    generate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.exam, selection.level, selection.category]);

  const current = items[index] || null;
  const progress = items.length ? Math.round(((index + 1) / items.length) * 100) : 0;

  function reset() {
    setAnswer("");
    setWordResult(null);
    setSentenceFeedback(null);
    writingRef.current?.clearCanvas?.();
  }

  function next() {
    setIndex((old) => (items.length ? (old + 1) % items.length : 0));
    reset();
  }

  function markWord() {
    if (!current) return;
    const acceptedAnswers = current.wordQuestion?.acceptedAnswers || [current.word];
    const ok = checkWordAnswer(answer, acceptedAnswers);
    const result = { correct: ok, correctAnswer: current.wordQuestion?.answer || current.word };
    setWordResult(result);
    addHistory({ type: "word", selection, item: current, userAnswer: answer, result });
    if (!ok) addMistake({ type: "word", selection, item: current, userAnswer: answer, correctAnswer: result.correctAnswer });
  }

  async function checkSentence() {
    if (!current) return;
    const basic = basicSentenceCheck(answer, current.word);
    if (!basic.passed) {
      const feedback = {
        score: 0,
        grammarScore: 0,
        naturalnessScore: 0,
        targetWordUsedCorrectly: false,
        feedbackJa: basic.reasonJa,
        correctedSentence: "",
        betterSentence: "",
        tipJa: "まずターゲット単語を入れた文にしましょう。",
      };
      setSentenceFeedback(feedback);
      addMistake({ type: "sentence", selection, item: current, userAnswer: answer, feedback });
      return;
    }

    setChecking(true);
    setSentenceFeedback(null);
    try {
      let feedback;
      try {
        feedback = await claudeCheckSentence({
          targetWord: current.word,
          prompt: current.sentencePrompt,
          userSentence: answer,
          ...selection,
        });
      } catch {
        feedback = await mockClaudeCheck({ targetWord: current.word, userSentence: answer });
      }
      setSentenceFeedback(feedback);
      addHistory({ type: "sentence", selection, item: current, userAnswer: answer, result: feedback });
      if ((feedback.score || 0) < 8) addMistake({ type: "sentence", selection, item: current, userAnswer: answer, feedback });
    } finally {
      setChecking(false);
    }
  }

  if (loading && !items.length) {
    return (
      <main className="page loadingPage">
        <div className="spinner" />
        <h2>OpenAIが練習セットを生成中...</h2>
        <p>APIがない場合は自動でmockデータに切り替わります。</p>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="page narrow">
        <AppButton variant="ghost" onClick={onBack}>← 戻る</AppButton>
        <Card>
          <p className="error">問題がありません。もう一度生成してください。</p>
          <AppButton onClick={() => generate(true)}>再生成</AppButton>
        </Card>
      </main>
    );
  }

  const question = current.wordQuestion || { promptJa: current.meaningJa, answer: current.word, acceptedAnswers: [current.word] };

  return (
    <main className="page practicePage">
      <div className="practiceTop">
        <AppButton variant="ghost" onClick={onBack}>← 戻る</AppButton>
        <div className="modeSwitch">
          <button className={mode === "word" ? "active" : ""} onClick={() => { setMode("word"); reset(); }}>Word</button>
          <button className={mode === "sentence" ? "active" : ""} onClick={() => { setMode("sentence"); reset(); }}>Sentence</button>
        </div>
      </div>

      <div className="progress"><span style={{ width: `${progress}%` }} /></div>

      <div className="practiceGrid">
        <section className="leftCol">
          <Card>
            <div className="tags">
              <span>{selection.exam}</span>
              <span>{selection.level}</span>
              <span>{selection.category}</span>
            </div>
            <h2 className="wordTitle">{current.word}</h2>
            <p className="meaning">{current.meaningJa}</p>
            <div className="exampleBox">
              <small>Example</small>
              <p>{current.example}</p>
              <em>{current.exampleJa}</em>
            </div>
            <div className="chips">
              {(current.collocations || []).map((item) => <span key={item}>{item}</span>)}
            </div>
          </Card>

          <Card>
            <h3>{mode === "word" ? "Word Question" : "Sentence Challenge"}</h3>
            {mode === "word" ? (
              <>
                <p className="questionText">{question.promptJa}</p>
                {question.sentence && <p className="sentenceBlank">{question.sentence}</p>}
              </>
            ) : (
              <>
                <p className="questionText">{current.sentencePrompt}</p>
                <p className="note">短文はまずローカルで基本チェックし、その後Claudeで自然さを添削します。</p>
              </>
            )}
          </Card>
        </section>

        <section className="rightCol">
          <WritingInput ref={writingRef} answer={answer} setAnswer={setAnswer} />
          <div className="buttonRow">
            {mode === "word" ? (
              <AppButton onClick={markWord}>一瞬で採点</AppButton>
            ) : (
              <AppButton onClick={checkSentence} disabled={checking}>{checking ? "添削中..." : "Claudeで短文添削"}</AppButton>
            )}
            <AppButton variant="secondary" onClick={reset}>リセット</AppButton>
            <AppButton variant="secondary" onClick={next}>次へ →</AppButton>
            <AppButton variant="secondary" onClick={() => generate(true)}>再生成</AppButton>
          </div>
          {wordResult && <WordResult result={wordResult} />}
          {sentenceFeedback && <SentenceFeedback feedback={sentenceFeedback} />}
          {error && <p className="error">{error}</p>}
        </section>
      </div>
    </main>
  );
}

const WritingInput = React.forwardRef(function WritingInput({ answer, setAnswer }, ref) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pen");
  const [size, setSize] = useState(4);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  React.useImperativeHandle(ref, () => ({ clearCanvas }));

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  function resizeCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const image = canvas.toDataURL();
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
    img.src = image;
  }

  function getPoint(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function start(event) {
    event.preventDefault();
    drawingRef.current = true;
    lastRef.current = getPoint(event);
    canvasRef.current.setPointerCapture?.(event.pointerId);
  }

  function move(event) {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const nextPoint = getPoint(event);
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = tool === "eraser" ? size * 5 : size;
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.stroke();
    lastRef.current = nextPoint;
  }

  function end() {
    drawingRef.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  return (
    <Card>
      <div className="writeHeader">
        <h3>✏️ Write by hand / type</h3>
        <span>Apple Pencil Ready</span>
      </div>
      <div className="canvasWrap">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        <div className="pencilToolbar">
          <button className={tool === "pen" ? "active" : ""} onClick={() => setTool("pen")}>✒️</button>
          <button className={tool === "eraser" ? "active" : ""} onClick={() => setTool("eraser")}>🧽</button>
          <input aria-label="pen size" type="range" min="2" max="10" value={size} onChange={(event) => setSize(Number(event.target.value))} />
          <button onClick={clearCanvas}>🗑️</button>
        </div>
      </div>
      <textarea
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder="手書きで覚えたあと、ここに答えを入力してください。iPadならScribble入力も使えます。"
      />
      <p className="smallNote">Web版ではApple純正Notesの完全なペンUIは出せないため、Pencil風ツールバーで代替しています。</p>
    </Card>
  );
});

function WordResult({ result }) {
  return (
    <div className={result.correct ? "result correct" : "result wrong"}>
      <strong>{result.correct ? "✅ Correct!" : "❌ Not yet"}</strong>
      {!result.correct && <span>正解: {result.correctAnswer}</span>}
    </div>
  );
}

function SentenceFeedback({ feedback }) {
  return (
    <div className="feedback">
      <div className="feedbackTop">
        <h3>✨ Claude Feedback</h3>
        <span>Score {feedback.score ?? "-"}/10</span>
      </div>
      <div className="scoreGrid">
        <div><small>Grammar</small><strong>{feedback.grammarScore ?? "-"}/10</strong></div>
        <div><small>Naturalness</small><strong>{feedback.naturalnessScore ?? "-"}/10</strong></div>
      </div>
      <p>{feedback.feedbackJa}</p>
      {feedback.correctedSentence && <div className="miniBox"><small>Correction</small><strong>{feedback.correctedSentence}</strong></div>}
      {feedback.betterSentence && <div className="miniBox greenBox"><small>Better Academic Sentence</small><strong>{feedback.betterSentence}</strong></div>}
      {feedback.tipJa && <em>Tip: {feedback.tipJa}</em>}
    </div>
  );
}

function MistakeScreen({ setView }) {
  const [mistakes, setMistakes] = useState(() => loadJSON(STORAGE_KEYS.MISTAKES, []));

  function clearAll() {
    saveJSON(STORAGE_KEYS.MISTAKES, []);
    setMistakes([]);
  }

  function remove(id) {
    const next = mistakes.filter((item) => item.id !== id);
    saveJSON(STORAGE_KEYS.MISTAKES, next);
    setMistakes(next);
  }

  return (
    <main className="page narrow">
      <div className="screenTop">
        <AppButton variant="ghost" onClick={() => setView("home")}>← Home</AppButton>
        <AppButton variant="secondary" onClick={clearAll}>全削除</AppButton>
      </div>
      <Card>
        <h2>Mistake Notebook</h2>
        <p>間違えた単語・短文だけを保存します。</p>
        {!mistakes.length ? (
          <div className="empty">まだミスはありません。</div>
        ) : (
          <div className="mistakeList">
            {mistakes.map((m) => (
              <div className="mistakeItem" key={m.id}>
                <div>
                  <div className="tags"><span>{m.type}</span><span>{m.selection?.exam}</span><span>{m.selection?.category}</span></div>
                  <strong>{m.item?.word}</strong>
                  <p>{m.item?.meaningJa}</p>
                  <p>Your answer: {m.userAnswer || "empty"}</p>
                  {m.correctAnswer && <p className="greenText">Correct: {m.correctAnswer}</p>}
                  {m.feedback?.feedbackJa && <p className="mistakeFeedback">{m.feedback.feedbackJa}</p>}
                </div>
                <button onClick={() => remove(m.id)}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  );
}

function PlanScreen({ setView }) {
  return (
    <main className="page narrow">
      <AppButton variant="ghost" onClick={() => setView("home")}>← Home</AppButton>
      <Card>
        <h2>AI Architecture</h2>
        <div className="featureGrid inside">
          <div className="featureCard"><strong>🤖 OpenAI</strong><span>単語生成・問題生成・短文プロンプト生成</span></div>
          <div className="featureCard"><strong>⚡ Local JS</strong><span>単語採点・穴埋め採点・基本チェックを一瞬で処理</span></div>
          <div className="featureCard"><strong>✨ Claude</strong><span>短文だけ自然さ・文法・collocationを添削</span></div>
        </div>
      </Card>
    </main>
  );
}

function StyleTag() {
  return (
    <style>{`
      :root {
        --bg: #f8fafc;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --line: #e2e8f0;
        --blue: #3b82f6;
        --blueDark: #2563eb;
        --green: #10b981;
        --red: #ef4444;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--text); }
      button, textarea, input { font: inherit; }
      button { cursor: pointer; }
      button:disabled { cursor: not-allowed; opacity: 0.65; }
      .topbar {
        position: sticky; top: 0; z-index: 20;
        display: flex; align-items: center; justify-content: space-between;
        padding: 12px 24px; background: rgba(255,255,255,0.88); backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--line);
      }
      .brand { display: flex; align-items: center; gap: 12px; border: 0; background: transparent; text-align: left; color: inherit; }
      .brandIcon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 18px; background: #eff6ff; }
      .brand strong { display: block; font-size: 18px; font-weight: 900; }
      .brand small { display: block; color: #94a3b8; font-size: 12px; font-weight: 700; }
      .brand em { padding: 3px 8px; border-radius: 999px; background: #eff6ff; color: var(--blue); font-style: normal; font-size: 12px; font-weight: 900; }
      .nav { display: flex; gap: 8px; }
      .nav button { border: 0; background: transparent; color: var(--muted); padding: 10px 14px; border-radius: 14px; font-weight: 800; }
      .nav .navActive { background: var(--blue); color: white; }
      .page { max-width: 1180px; margin: 0 auto; padding: 32px 20px 80px; }
      .page.narrow { max-width: 980px; }
      .hero { text-align: center; padding: 34px 0 24px; }
      .hero h1 { margin: 0; font-size: clamp(46px, 8vw, 78px); line-height: 0.95; letter-spacing: -0.06em; font-weight: 950; }
      .hero h1 span { color: var(--blue); }
      .hero p { max-width: 720px; margin: 22px auto; color: var(--muted); font-size: 18px; line-height: 1.8; font-weight: 700; }
      .btn { border: 0; border-radius: 18px; padding: 13px 22px; font-weight: 900; box-shadow: 0 10px 25px rgba(59,130,246,0.18); }
      .btn.primary { background: var(--blue); color: white; }
      .btn.primary:hover { background: var(--blueDark); }
      .btn.secondary { background: white; color: #334155; border: 1px solid var(--line); box-shadow: none; }
      .btn.ghost { background: transparent; color: #334155; box-shadow: none; border: 0; }
      .section h2 { text-align: center; font-size: 26px; font-weight: 950; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      .categoryCard {
        display: flex; align-items: center; gap: 16px; min-height: 94px;
        border: 1px solid #dbeafe; border-radius: 26px; padding: 22px; background: linear-gradient(135deg, #ffffff, #eff6ff);
        text-align: left; box-shadow: 0 6px 18px rgba(15,23,42,0.04); transition: 0.18s ease;
      }
      .categoryCard:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(15,23,42,0.08); }
      .categoryIcon { display: grid; place-items: center; flex: 0 0 48px; width: 48px; height: 48px; border-radius: 18px; background: white; font-size: 22px; }
      .categoryCard strong { display: block; font-size: 18px; font-weight: 950; }
      .categoryCard small { color: var(--muted); font-weight: 700; }
      .featureGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 34px; }
      .featureGrid.inside { margin-top: 20px; }
      .featureCard { display: flex; flex-direction: column; gap: 8px; min-height: 130px; border: 1px solid var(--line); border-radius: 28px; padding: 24px; background: white; text-align: left; color: inherit; }
      .featureCard.green { background: linear-gradient(135deg, #ecfdf5, #eff6ff); border-color: #bbf7d0; }
      .featureCard strong { font-size: 18px; font-weight: 950; }
      .featureCard span { color: var(--muted); font-weight: 700; line-height: 1.6; }
      .card { background: var(--card); border: 1px solid var(--line); border-radius: 32px; padding: 28px; box-shadow: 0 8px 30px rgba(15,23,42,0.045); }
      .cardHeader { display: flex; justify-content: space-between; gap: 18px; }
      .cardHeader h2, .card h2 { margin: 0; font-size: 32px; letter-spacing: -0.03em; font-weight: 950; }
      .cardHeader p, .card > p { color: var(--muted); font-weight: 700; line-height: 1.7; }
      .eyebrow { margin: 0 0 8px; color: var(--blue) !important; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 950 !important; }
      .bigIcon { font-size: 44px; }
      .twoCols { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 26px; }
      .choiceList { display: grid; gap: 10px; }
      .choice { border: 1px solid var(--line); border-radius: 18px; padding: 15px; background: white; text-align: left; font-weight: 850; color: #475569; }
      .choice.active { border-color: var(--blue); background: #eff6ff; color: var(--blueDark); }
      .setupFooter { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-top: 28px; padding: 18px; border-radius: 24px; background: #f8fafc; }
      .setupFooter strong, .setupFooter small { display: block; }
      .setupFooter small { color: var(--muted); font-weight: 700; margin-top: 4px; }
      .practiceTop, .screenTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
      .modeSwitch { display: flex; gap: 4px; padding: 5px; background: #e2e8f0; border-radius: 999px; }
      .modeSwitch button { border: 0; background: transparent; border-radius: 999px; padding: 10px 18px; font-weight: 950; color: var(--muted); }
      .modeSwitch .active { background: white; color: var(--blueDark); box-shadow: 0 3px 10px rgba(15,23,42,0.08); }
      .progress { height: 10px; background: #e2e8f0; border-radius: 999px; padding: 2px; margin-bottom: 18px; }
      .progress span { display: block; height: 100%; border-radius: 999px; background: var(--blue); transition: width 0.2s ease; }
      .practiceGrid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 22px; }
      .leftCol, .rightCol { display: grid; gap: 16px; align-content: start; }
      .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
      .tags span { background: #eff6ff; color: var(--blueDark); border-radius: 999px; padding: 5px 10px; font-size: 12px; font-weight: 950; }
      .wordTitle { margin: 0; font-size: 48px; font-weight: 950; letter-spacing: -0.04em; }
      .meaning { margin: 8px 0 0; font-size: 18px; color: var(--muted); font-weight: 850; }
      .exampleBox { margin-top: 22px; padding: 18px; border-radius: 22px; background: #f8fafc; }
      .exampleBox small, .miniBox small, .scoreGrid small { display: block; color: #94a3b8; font-weight: 950; font-size: 12px; }
      .exampleBox p { margin: 8px 0; font-size: 17px; line-height: 1.7; font-weight: 800; }
      .exampleBox em { color: var(--muted); font-style: normal; font-weight: 700; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
      .chips span { padding: 7px 11px; border-radius: 999px; background: white; border: 1px solid var(--line); font-weight: 800; color: #475569; }
      .questionText { font-size: 18px; line-height: 1.7; font-weight: 850; color: #334155; }
      .sentenceBlank, .note { padding: 16px; border-radius: 18px; background: #eff6ff; color: #1e3a8a; font-weight: 900; }
      .writeHeader { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
      .writeHeader h3 { margin: 0; }
      .writeHeader span { border-radius: 999px; padding: 6px 10px; background: #f1f5f9; color: #64748b; font-size: 12px; font-weight: 950; }
      .canvasWrap { position: relative; height: 270px; overflow: hidden; border: 1px solid var(--line); border-radius: 26px; background-image: linear-gradient(#f8fafc 31px, #dbeafe 32px); background-size: 100% 32px; touch-action: none; }
      canvas { width: 100%; height: 100%; display: block; touch-action: none; }
      .pencilToolbar { position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 999px; background: rgba(255,255,255,0.92); border: 1px solid var(--line); box-shadow: 0 14px 35px rgba(15,23,42,0.16); backdrop-filter: blur(12px); }
      .pencilToolbar button { width: 42px; height: 42px; border-radius: 16px; border: 0; background: transparent; }
      .pencilToolbar button.active { background: var(--blue); color: white; }
      .pencilToolbar input { width: 90px; }
      textarea { width: 100%; min-height: 115px; resize: vertical; margin-top: 14px; padding: 16px; border-radius: 24px; border: 1px solid var(--line); background: #f8fafc; font-size: 17px; font-weight: 750; outline: none; }
      textarea:focus { border-color: var(--blue); background: white; }
      .smallNote { margin: 8px 0 0; color: #94a3b8; font-size: 12px; font-weight: 700; }
      .buttonRow { display: flex; gap: 10px; flex-wrap: wrap; }
      .result, .feedback, .error { border-radius: 26px; padding: 20px; font-weight: 850; }
      .result { display: flex; align-items: center; gap: 12px; }
      .result.correct { background: #ecfdf5; color: #047857; border: 1px solid #bbf7d0; }
      .result.wrong { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      .result strong, .result span { display: block; }
      .feedback { background: white; border: 1px solid #bfdbfe; box-shadow: 0 8px 30px rgba(15,23,42,0.045); }
      .feedbackTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .feedbackTop h3 { margin: 0; }
      .feedbackTop span { background: #eff6ff; color: var(--blueDark); border-radius: 999px; padding: 7px 12px; font-weight: 950; }
      .scoreGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
      .scoreGrid div, .miniBox { background: #f8fafc; border-radius: 18px; padding: 14px; }
      .scoreGrid strong { display: block; margin-top: 5px; font-size: 22px; }
      .feedback p { line-height: 1.7; background: #eff6ff; border-radius: 18px; padding: 14px; font-weight: 800; }
      .miniBox { display: grid; gap: 6px; margin-top: 10px; }
      .greenBox { background: #ecfdf5; }
      .feedback em { display: block; margin-top: 12px; color: var(--muted); font-style: normal; font-weight: 750; }
      .error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
      .loadingPage { text-align: center; display: grid; place-items: center; min-height: 60vh; align-content: center; }
      .spinner { width: 48px; height: 48px; border-radius: 50%; border: 5px solid #dbeafe; border-top-color: var(--blue); animation: spin 0.8s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .empty { margin-top: 22px; padding: 44px; text-align: center; color: var(--muted); background: #f8fafc; border-radius: 26px; font-weight: 800; }
      .mistakeList { display: grid; gap: 12px; margin-top: 20px; }
      .mistakeItem { display: flex; justify-content: space-between; gap: 12px; padding: 18px; border-radius: 24px; background: #f8fafc; border: 1px solid var(--line); }
      .mistakeItem button { border: 0; background: transparent; font-size: 18px; }
      .mistakeItem strong { font-size: 20px; font-weight: 950; }
      .mistakeItem p { margin: 6px 0; color: var(--muted); font-weight: 750; }
      .greenText { color: #047857 !important; }
      .mistakeFeedback { padding: 12px; border-radius: 16px; background: white; color: #334155 !important; }
      @media (max-width: 900px) {
        .grid, .featureGrid, .twoCols, .practiceGrid { grid-template-columns: 1fr; }
        .topbar { padding: 10px 14px; }
        .brand small { display: none; }
        .hero { padding-top: 20px; }
        .setupFooter, .practiceTop, .screenTop { align-items: stretch; flex-direction: column; }
        .buttonRow { display: grid; grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 560px) {
        .nav button { padding: 8px 10px; }
        .card { padding: 20px; border-radius: 24px; }
        .buttonRow { grid-template-columns: 1fr; }
        .wordTitle { font-size: 38px; }
      }
    `}</style>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selectedExam, setSelectedExam] = useState("IELTS");
  const [selection, setSelection] = useState(null);

  function chooseExam(exam) {
    setSelectedExam(exam);
    setView("select");
  }

  function startPractice(nextSelection) {
    setSelection(nextSelection);
    setView("practice");
  }

  return (
    <>
      <StyleTag />
      <Header view={view} setView={setView} />
      {view === "home" && <HomeScreen onSelect={chooseExam} setView={setView} />}
      {view === "select" && <SelectionScreen exam={selectedExam} onBack={() => setView("home")} onStart={startPractice} />}
      {view === "practice" && selection && <PracticeScreen selection={selection} onBack={() => setView("select")} />}
      {view === "mistakes" && <MistakeScreen setView={setView} />}
      {view === "plan" && <PlanScreen setView={setView} />}
    </>
  );
}
