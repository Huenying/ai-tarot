/**
 * Tarot spread definitions for each question category.
 * Each spread has a name, number of cards, and position labels.
 */

export interface SpreadPosition {
  label: string;
  description: string;
}

export interface SpreadConfig {
  id: string;
  name: string;
  nameZh: string;
  cards: number;
  positions: SpreadPosition[];
  description: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  nameZh: string;
  icon: string;
  keywords: string[];
  spreads: SpreadConfig[];
  defaultSpread: string;
}

export const SPREADS: Record<string, SpreadConfig> = {
  "past-present-future": {
    id: "past-present-future",
    name: "Past → Present → Future",
    nameZh: "時間流牌陣",
    cards: 3,
    positions: [
      { label: "Past / Foundation", description: "過去的背景與根源" },
      { label: "Present / Challenge", description: "目前的狀況與挑戰" },
      { label: "Future / Outcome", description: "未來的發展與結果" },
    ],
    description: "最經典的時間流牌陣，三張牌分別代表問題的過去、現在和未來，幫您釐清事件的發展脈絡。",
  },
  "career-prospect": {
    id: "career-prospect",
    name: "Career Prospect",
    nameZh: "事業前景陣",
    cards: 6,
    positions: [
      { label: "Current Situation", description: "目前工作狀況" },
      { label: "Challenges", description: "面臨的挑戰" },
      { label: "Hidden Factors", description: "潛在影響因素" },
      { label: "Advice", description: "建議方向" },
      { label: "Near Future", description: "短期發展" },
      { label: "Long-term Outcome", description: "長期結果" },
    ],
    description: "從現狀、挑戰到建議，全面分析事業發展。",
  },
  "venus-love": {
    id: "venus-love",
    name: "Venus Love Spread",
    nameZh: "維納斯之愛牌陣",
    cards: 8,
    positions: [
      { label: "Your Feelings", description: "你對這段感情的想法" },
      { label: "Their Feelings", description: "對方對這段感情的想法" },
      { label: "Your Influence", description: "你對這段關係的影響" },
      { label: "Their Influence", description: "對方對這段關係的影響" },
      { label: "Current Obstacles", description: "目前的障礙" },
      { label: "Near Future", description: "近期的發展" },
      { label: "Long-term Potential", description: "長遠的潛力" },
      { label: "Final Outcome", description: "最終的結果" },
    ],
    description: "專門用於愛情，能精準反映雙方想法、感情影響及未來發展。",
  },
  "lovers-cross": {
    id: "lovers-cross",
    name: "Lovers Cross",
    nameZh: "戀人十字牌陣",
    cards: 5,
    positions: [
      { label: "You", description: "你的狀態與態度" },
      { label: "The Other", description: "對方的狀態與態度" },
      { label: "The Relationship", description: "你們之間的關係現狀" },
      { label: "Hidden Dynamics", description: "隱藏的矛盾或因素" },
      { label: "Development Trend", description: "未來的發展趨勢" },
    ],
    description: "深入剖析關係中的隱藏矛盾與雙方狀態。",
  },
  "tree-of-life": {
    id: "tree-of-life",
    name: "Tree of Life",
    nameZh: "生命之樹牌陣",
    cards: 10,
    positions: [
      { label: "Foundation", description: "你的根基與安全感" },
      { label: "Strength", description: "你的內在力量" },
      { label: "Harmony", description: "目前的和諧程度" },
      { label: "Endurance", description: "面對挑戰的韌性" },
      { label: "Direction", description: "人生方向與目標" },
      { label: "Growth", description: "成長的契機" },
      { label: "Wisdom", description: "內在智慧與直覺" },
      { label: "Transformation", description: "轉變與突破" },
      { label: "Aspiration", description: "理想與願望" },
      { label: "Fulfillment", description: "最終的圓滿" },
    ],
    description: "適合深度的自我探索和年度規劃。",
  },
  "four-elements": {
    id: "four-elements",
    name: "Four Elements",
    nameZh: "四元素牌陣",
    cards: 4,
    positions: [
      { label: "Fire — Action", description: "行動力與熱情" },
      { label: "Air — Thought", description: "思想與溝通" },
      { label: "Water — Emotion", description: "情感與直覺" },
      { label: "Earth — Material", description: "物質與身體健康" },
    ],
    description: "從行動（火）、思想（風）、情感（水）、物質（土）四個層面分析問題。",
  },
  "yes-no": {
    id: "yes-no",
    name: "Yes / No",
    nameZh: "是非題牌陣",
    cards: 3,
    positions: [
      { label: "Card 1", description: "第一張牌" },
      { label: "Card 2", description: "第二張牌" },
      { label: "Card 3", description: "第三張牌" },
    ],
    description: "專門回答「是不是」、「會不會」等非黑即白的問題。根據正逆位數量判斷：三張正位＝是，三張逆位＝否，兩正一逆＝可能是，兩逆一正＝可能否。",
  },
  "a-or-b": {
    id: "a-or-b",
    name: "A or B Choice",
    nameZh: "二選一牌陣",
    cards: 5,
    positions: [
      { label: "Your Situation", description: "你目前的狀況" },
      { label: "Option A", description: "選擇A的狀況" },
      { label: "Option B", description: "選擇B的狀況" },
      { label: "Outcome A", description: "選擇A的發展與影響" },
      { label: "Outcome B", description: "選擇B的發展與影響" },
    ],
    description: "幫助您在兩個互斥的選項間做出決策。",
  },
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "career",
    name: "Career",
    nameZh: "事業／工作",
    icon: "💼",
    keywords: [
      "事業", "工作", "career", "job", "work", "promotion", "升職", "轉工",
      "創業", "business", "生意", "錢", "money", "財務", "finance",
      "辭職", "轉行", "面試", "interview", "boss", "老闆", "colleague",
      "客戶", "project", "項目", "收入", "income",
    ],
    spreads: [SPREADS["career-prospect"], SPREADS["past-present-future"]],
    defaultSpread: "career-prospect",
  },
  {
    id: "study",
    name: "Study",
    nameZh: "學業／考試",
    icon: "📚",
    keywords: [
      "學業", "考試", "study", "exam", "test", "學習", "school",
      "university", "讀書", "成績", "grade", "畢業", "graduate",
      "上課", "class", "論文", "thesis", "作業", "assignment",
      "老師", "teacher", "教授", "professor",
    ],
    spreads: [SPREADS["past-present-future"]],
    defaultSpread: "past-present-future",
  },
  {
    id: "love",
    name: "Love",
    nameZh: "感情",
    icon: "❤️",
    keywords: [
      "感情", "愛情", "戀愛", "love", "relationship", "伴侶", "partner",
      "結婚", "marriage", "男朋友", "女朋友", "boyfriend", "girlfriend",
      "曖昧", "crush", "分手", "breakup", "復合", "get back",
      "出軌", "cheat", "單身", "single", "告白", "confess",
      "老公", "老婆", "husband", "wife", "婚禮", "wedding",
    ],
    spreads: [SPREADS["venus-love"], SPREADS["past-present-future"]],
    defaultSpread: "venus-love",
  },
  {
    id: "relationship",
    name: "Relationship",
    nameZh: "人際關係",
    icon: "🤝",
    keywords: [
      "人際", "朋友", "家人", "family", "friend", "同事", "相處",
      "溝通", "communication", "社交", "social", "誤會",
      "信任", "trust", "support", "支持", "團隊", "team",
      "鄰居", "neighbor", " roommate", "室友",
    ],
    spreads: [SPREADS["lovers-cross"], SPREADS["past-present-future"]],
    defaultSpread: "lovers-cross",
  },
  {
    id: "self",
    name: "Self",
    nameZh: "自我成長",
    icon: "🌱",
    keywords: [
      "自我", "成長", "growth", "人生", "life", "方向", "direction",
      "內心", "inner", "靈性", "spiritual", "目標", "goal",
      "迷茫", "lost", "意義", "meaning", "purpose", "使命",
      "自信", "confidence", "焦慮", "anxiety", "meditation",
    ],
    spreads: [SPREADS["tree-of-life"], SPREADS["past-present-future"]],
    defaultSpread: "tree-of-life",
  },
  {
    id: "health",
    name: "Health",
    nameZh: "健康",
    icon: "🏥",
    keywords: [
      "健康", "health", "身體", "body", "疾病", "illness", "壓力",
      "stress", "失眠", "sleep", "運動", "exercise", "飲食", "diet",
      "懷孕", "pregnancy", "療癒", "healing", "能量", "energy",
      "mental health", "心理健康", "depression", "憂鬱",
    ],
    spreads: [SPREADS["four-elements"], SPREADS["past-present-future"]],
    defaultSpread: "four-elements",
  },
  {
    id: "yesno",
    name: "Yes / No",
    nameZh: "是非題",
    icon: "❓",
    keywords: [
      "是否", "會不會", "能不能", "要不要", "可否", "yes no",
      "應不應該", "should I", "對不對", "準嗎", "可能嗎",
      "該不該", "行不行", "對嗎", "好嗎",
    ],
    spreads: [SPREADS["yes-no"]],
    defaultSpread: "yes-no",
  },
  {
    id: "aorb",
    name: "A or B",
    nameZh: "二選一",
    icon: "⚖️",
    keywords: [
      "選擇", "哪個", "which one", "比較", "compare", "還是", "or",
      "A還是B", "left or right", "option", "選項",
    ],
    spreads: [SPREADS["a-or-b"]],
    defaultSpread: "a-or-b",
  },
];

/** Fallback category for unclassified questions */
export const OTHER_CATEGORY: CategoryConfig = {
  id: "other",
  name: "Other",
  nameZh: "其他",
  icon: "🔮",
  keywords: [],
  spreads: [SPREADS["past-present-future"]],
  defaultSpread: "past-present-future",
};

/**
 * Classify a question string into a category.
 * Returns the best matching category based on keyword overlap.
 */
export function classifyQuestion(question: string): CategoryConfig {
  const input = question.toLowerCase();

  // Score each category by keyword matches
  let bestScore = 0;
  let best: CategoryConfig = OTHER_CATEGORY;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (input.includes(kw.toLowerCase())) {
        // Longer keyword matches = more specific = higher score
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }

  return best;
}

/**
 * Get the default spread for a category.
 */
export function getDefaultSpread(category: CategoryConfig): SpreadConfig {
  return SPREADS[category.defaultSpread];
}
