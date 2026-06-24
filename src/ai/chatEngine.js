import { knowledgeEntries } from "./knowledgeBase";

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function simpleStem(word) {
  return word
    .replace(/lar$/i, "")
    .replace(/larim$/i, "")
    .replace(/ing$/i, "")
    .replace(/gan$/i, "")
    .replace(/kan$/i, "")
    .replace(/dir$/i, "")
    .replace(/mi$/i, "")
    .replace(/man$/i, "")
    .replace(/moqda$/i, "");
}

const OFF_TOPIC_WORDS = [
  "politics", "siyosat", "prezident", "saylov", "partiya",
  "sport", "futbol", "basketbol", "tennis", "box",
  "kino", "film", "music", "musiqa", "tv", "televizor",
  "rezept", "ovqat", "recipe", "food",
  "game", "oyin", "oyna", "play",
  "coding", "javascript", "python", "react", "html", "css",
  "weather", "ob-havo", "havo",
  "currency", "valyuta", "dollar", "euro",
];

function isOffTopic(query) {
  const q = query.toLowerCase();
  const tokens = tokenize(q);
  let matchCount = 0;
  for (const t of tokens) {
    if (OFF_TOPIC_WORDS.some((w) => w.includes(t) || t.includes(w))) {
      matchCount++;
    }
  }
  return matchCount >= 2;
}

function getRelevance(query, entry) {
  const queryTokens = tokenize(query).map(simpleStem);
  if (queryTokens.length === 0) return 0;

  let matchCount = 0;
  const matchedKeywords = new Set();

  for (const keyword of entry.keywords) {
    const keywordTokens = tokenize(keyword).map(simpleStem);
    for (const qt of queryTokens) {
      for (const kt of keywordTokens) {
        if (kt.includes(qt) || qt.includes(kt)) {
          if (!matchedKeywords.has(keyword)) {
            matchCount++;
            matchedKeywords.add(keyword);
          }
        }
      }
    }
  }

  if (matchCount === 0) return 0;

  const matchRatio = matchCount / entry.keywords.length;
  const queryCoverage = matchCount / queryTokens.length;

  return (matchRatio * 0.4 + queryCoverage * 0.6) * entry.priority;
}

function detectIntent(query) {
  const q = query.toLowerCase();

  const choosePatterns = [
    /qaysi universitet/i, /which university/i, /tanlash/i, /choose/i,
    /tanla/i, /maslahat/i, /tavsiya/i, /suggest/i, /recommend/i,
  ];

  for (const p of choosePatterns) {
    if (p.test(q)) return "choose";
  }

  if (/\b(solishtir|taqqosla|compare|comparison|farq)\b/i.test(q)) return "compare";

  return "info";
}

export function findBestAnswer(query) {
  if (!query || !query.trim()) {
    return { answer: "Iltimos, savolingizni yozing.", confidence: 0, intent: null };
  }

  const intent = detectIntent(query);

  if (isOffTopic(query)) {
    return {
      answer: "I am EduUZ AI and can only assist with university and education-related questions.",
      confidence: 0,
      intent,
    };
  }

  const scored = knowledgeEntries
    .map((entry) => ({
      entry,
      score: getRelevance(query, entry),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0 || scored[0].score < 0.3) {
    return {
      answer: "I am EduUZ AI and can only assist with university and education-related questions.",
      confidence: 0,
      intent,
    };
  }

  const best = scored[0];
  return { answer: best.entry.answer, confidence: Math.min(best.score / 3, 1), intent };
}
