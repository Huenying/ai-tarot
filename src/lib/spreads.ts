/**
 * Tarot spread definitions — organized by user-facing tab groups.
 */

export interface SpreadPosition {
  label: string;
  description: string;
}

export interface SpreadConfig {
  id: string;
  name: string;
  nameZh: string;
  emoji: string;
  cards: number;
  positions: SpreadPosition[];
  description: string;
}

// ──────────────────────────────────────────────────────────────
//  All spreads
// ──────────────────────────────────────────────────────────────

const PAST_PRESENT_FUTURE: SpreadConfig = {
  id: "past-present-future",
  name: "Past → Present → Future",
  nameZh: "三張牌陣（過去－現在－未來）",
  emoji: "📜",
  cards: 3,
  positions: [
    { label: "Past / Foundation", description: "過去的背景與根源" },
    { label: "Present / Challenge", description: "目前的狀況與挑戰" },
    { label: "Future / Outcome", description: "未來的發展與結果" },
  ],
  description: "最經典的時間流牌陣，三張牌分別代表問題的過去、現在和未來，幫您釐清事件的發展脈絡。",
};

const CAREER_PROSPECT: SpreadConfig = {
  id: "career-prospect",
  name: "Career Prospect",
  nameZh: "事業前景陣",
  emoji: "💼",
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
};

const VENUS_LOVE: SpreadConfig = {
  id: "venus-love",
  name: "Venus Love Spread",
  nameZh: "維納斯之愛牌陣",
  emoji: "❤️",
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
};

const LOVERS_CROSS: SpreadConfig = {
  id: "lovers-cross",
  name: "Lovers Cross",
  nameZh: "戀人十字牌陣",
  emoji: "🤝",
  cards: 5,
  positions: [
    { label: "You", description: "你的狀態與態度" },
    { label: "The Other", description: "對方的狀態與態度" },
    { label: "The Relationship", description: "你們之間的關係現狀" },
    { label: "Hidden Dynamics", description: "隱藏的矛盾或因素" },
    { label: "Development Trend", description: "未來的發展趨勢" },
  ],
  description: "深入剖析關係中的隱藏矛盾與雙方狀態。",
};

const TREE_OF_LIFE: SpreadConfig = {
  id: "tree-of-life",
  name: "Tree of Life",
  nameZh: "生命之樹牌陣",
  emoji: "🌱",
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
};

const FOUR_ELEMENTS: SpreadConfig = {
  id: "four-elements",
  name: "Four Elements",
  nameZh: "四元素牌陣",
  emoji: "🏥",
  cards: 4,
  positions: [
    { label: "Fire — Action", description: "行動力與熱情" },
    { label: "Air — Thought", description: "思想與溝通" },
    { label: "Water — Emotion", description: "情感與直覺" },
    { label: "Earth — Material", description: "物質與身體健康" },
  ],
  description: "從行動（火）、思想（風）、情感（水）、物質（土）四個層面分析問題。",
};

const YES_NO: SpreadConfig = {
  id: "yes-no",
  name: "Yes / No",
  nameZh: "是非題牌陣",
  emoji: "❓",
  cards: 3,
  positions: [
    { label: "Card 1", description: "第一張牌" },
    { label: "Card 2", description: "第二張牌" },
    { label: "Card 3", description: "第三張牌" },
  ],
  description: "專門回答「是不是」、「會不會」等非黑即白的問題。根據正逆位數量判斷：三張正位＝是，三張逆位＝否，兩正一逆＝可能是，兩逆一正＝可能否。",
};

const A_OR_B: SpreadConfig = {
  id: "a-or-b",
  name: "A or B Choice",
  nameZh: "二選一牌陣",
  emoji: "⚖️",
  cards: 5,
  positions: [
    { label: "Your Situation", description: "你目前的狀況" },
    { label: "Option A", description: "選擇A的狀況" },
    { label: "Option B", description: "選擇B的狀況" },
    { label: "Outcome A", description: "選擇A的發展與影響" },
    { label: "Outcome B", description: "選擇B的發展與影響" },
  ],
  description: "幫助您在兩個互斥的選項間做出決策。",
};

// ──────────────────────────────────────────────────────────────
//  Tab groups
// ──────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  emoji: string;
  spread: SpreadConfig;
}

export interface TabGroup {
  id: string;
  label: string;
  labelZh: string;
  description: string;
  tabs: TabItem[];
}

/** Group 1: 按主題分類的牌陣 */
export const THEMED_GROUP: TabGroup = {
  id: "themed",
  label: "Themed Spreads",
  labelZh: "按主題分類的牌陣",
  description: "根據您的主題選擇對應的牌陣",
  tabs: [
    { id: "career", label: "事業／工作", emoji: "💼", spread: CAREER_PROSPECT },
    { id: "study", label: "學業／考試", emoji: "📚", spread: PAST_PRESENT_FUTURE },
    { id: "love", label: "感情", emoji: "❤️", spread: VENUS_LOVE },
    { id: "relationship", label: "人際關係", emoji: "🤝", spread: LOVERS_CROSS },
    { id: "self", label: "自我", emoji: "🌱", spread: TREE_OF_LIFE },
    { id: "health", label: "健康", emoji: "🏥", spread: FOUR_ELEMENTS },
    { id: "other-themed", label: "其他", emoji: "🔮", spread: PAST_PRESENT_FUTURE },
  ],
};

/** Group 2: 針對特定問題類型的牌陣 */
export const SPECIFIC_GROUP: TabGroup = {
  id: "specific",
  label: "Specific Question Types",
  labelZh: "針對特定問題類型的牌陣",
  description: "針對特定問題類型設計的專用牌陣",
  tabs: [
    { id: "yesno", label: "「是／否」問題", emoji: "❓", spread: YES_NO },
    { id: "aorb", label: "「A或B」選擇", emoji: "⚖️", spread: A_OR_B },
    { id: "universal", label: "萬用牌陣", emoji: "📜", spread: PAST_PRESENT_FUTURE },
  ],
};

export const ALL_GROUPS: TabGroup[] = [THEMED_GROUP, SPECIFIC_GROUP];

export function getSpreadById(id: string): SpreadConfig | undefined {
  const all = [CAREER_PROSPECT, PAST_PRESENT_FUTURE, VENUS_LOVE, LOVERS_CROSS, TREE_OF_LIFE, FOUR_ELEMENTS, YES_NO, A_OR_B];
  return all.find((s) => s.id === id);
}

export const SPREADS: Record<string, SpreadConfig> = {
  "career-prospect": CAREER_PROSPECT,
  "past-present-future": PAST_PRESENT_FUTURE,
  "venus-love": VENUS_LOVE,
  "lovers-cross": LOVERS_CROSS,
  "tree-of-life": TREE_OF_LIFE,
  "four-elements": FOUR_ELEMENTS,
  "yes-no": YES_NO,
  "a-or-b": A_OR_B,
};
