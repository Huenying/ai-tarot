/**
 * Tarot spread definitions — organized by user-facing tab groups.
 * All text in English.
 */

export interface SpreadPosition {
  label: string;
  description: string;
}

export interface SpreadConfig {
  id: string;
  name: string;
  emoji: string;
  cards: number;
  positions: SpreadPosition[];
  description: string;
}

const PAST_PRESENT_FUTURE: SpreadConfig = {
  id: "past-present-future",
  name: "Past → Present → Future (3 cards)",
  emoji: "📜",
  cards: 3,
  positions: [
    { label: "Past / Foundation", description: "The background and root of the matter" },
    { label: "Present / Challenge", description: "The current situation and challenges" },
    { label: "Future / Outcome", description: "The future development and outcome" },
  ],
  description: "The classic timeline spread. Three cards represent the past, present, and future of your question, helping you understand the flow of events.",
};

const CAREER_PROSPECT: SpreadConfig = {
  id: "career-prospect",
  name: "Career Prospect (6 cards)",
  emoji: "💼",
  cards: 6,
  positions: [
    { label: "Current Situation", description: "Your current work situation" },
    { label: "Challenges", description: "The challenges you face" },
    { label: "Hidden Factors", description: "Underlying influences" },
    { label: "Advice", description: "Suggested direction" },
    { label: "Near Future", description: "Short-term development" },
    { label: "Long-term Outcome", description: "Long-term result" },
  ],
  description: "A comprehensive career analysis covering your current situation, challenges, and future outlook.",
};

const VENUS_LOVE: SpreadConfig = {
  id: "venus-love",
  name: "Venus Love Spread (8 cards)",
  emoji: "❤️",
  cards: 8,
  positions: [
    { label: "Your Feelings", description: "Your feelings about this relationship" },
    { label: "Their Feelings", description: "Their feelings about this relationship" },
    { label: "Your Influence", description: "Your influence on the relationship" },
    { label: "Their Influence", description: "Their influence on the relationship" },
    { label: "Current Obstacles", description: "Current obstacles" },
    { label: "Near Future", description: "Near future developments" },
    { label: "Long-term Potential", description: "Long-term potential" },
    { label: "Final Outcome", description: "The final outcome" },
  ],
  description: "A dedicated love spread that reveals both partners' feelings, influences, and the relationship's future direction.",
};

const LOVERS_CROSS: SpreadConfig = {
  id: "lovers-cross",
  name: "Relationship Cross (5 cards)",
  emoji: "🤝",
  cards: 5,
  positions: [
    { label: "You", description: "Your state and attitude" },
    { label: "The Other", description: "The other person's state and attitude" },
    { label: "The Relationship", description: "The current state of the relationship" },
    { label: "Hidden Dynamics", description: "Hidden conflicts or factors" },
    { label: "Development Trend", description: "Future development trend" },
  ],
  description: "Deeply analyzes the hidden dynamics between two people — ideal for friendships, family relationships, and workplace connections.",
};

const TREE_OF_LIFE: SpreadConfig = {
  id: "tree-of-life",
  name: "Tree of Life (10 cards)",
  emoji: "🌱",
  cards: 10,
  positions: [
    { label: "Foundation", description: "Your roots and sense of security" },
    { label: "Strength", description: "Your inner strength" },
    { label: "Harmony", description: "Current harmony in your life" },
    { label: "Endurance", description: "Resilience facing challenges" },
    { label: "Direction", description: "Life direction and goals" },
    { label: "Growth", description: "Opportunities for growth" },
    { label: "Wisdom", description: "Inner wisdom and intuition" },
    { label: "Transformation", description: "Transformation and breakthroughs" },
    { label: "Aspiration", description: "Ideals and wishes" },
    { label: "Fulfillment", description: "Ultimate fulfillment" },
  ],
  description: "A deep self-exploration spread for personal growth, life planning, and spiritual development.",
};

const FOUR_ELEMENTS: SpreadConfig = {
  id: "four-elements",
  name: "Four Elements (4 cards)",
  emoji: "🏥",
  cards: 4,
  positions: [
    { label: "Fire — Action", description: "Energy, passion, and drive" },
    { label: "Air — Thought", description: "Mindset, communication, and clarity" },
    { label: "Water — Emotion", description: "Feelings, intuition, and emotional health" },
    { label: "Earth — Material", description: "Physical health, body, and daily life" },
  ],
  description: "Analyzes your situation from four elemental perspectives: action (fire), thought (air), emotion (water), and material (earth).",
};

const YES_NO: SpreadConfig = {
  id: "yes-no",
  name: "Yes / No (3 cards)",
  emoji: "❓",
  cards: 3,
  positions: [
    { label: "Card 1", description: "First card" },
    { label: "Card 2", description: "Second card" },
    { label: "Card 3", description: "Third card" },
  ],
  description: "Specifically for yes/no questions. Judgment is based on upright/reversed count: all upright = Yes, all reversed = No, 2 upright 1 reversed = Probably Yes, 2 reversed 1 upright = Probably No.",
};

const A_OR_B: SpreadConfig = {
  id: "a-or-b",
  name: "A or B Choice (5 cards)",
  emoji: "⚖️",
  cards: 5,
  positions: [
    { label: "Your Situation", description: "Your current situation" },
    { label: "Option A", description: "The state of Option A" },
    { label: "Option B", description: "The state of Option B" },
    { label: "Outcome A", description: "The outcome if you choose A" },
    { label: "Outcome B", description: "The outcome if you choose B" },
  ],
  description: "Helps you make decisions between two mutually exclusive options by comparing both paths side by side.",
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
  tabs: TabItem[];
}

export const THEMED_GROUP: TabGroup = {
  id: "themed",
  label: "By Topic",
  tabs: [
    { id: "career", label: "Career / Work", emoji: "💼", spread: CAREER_PROSPECT },
    { id: "study", label: "Study / Exams", emoji: "📚", spread: PAST_PRESENT_FUTURE },
    { id: "love", label: "Love / Romance", emoji: "❤️", spread: VENUS_LOVE },
    { id: "relationship", label: "Relationships", emoji: "🤝", spread: LOVERS_CROSS },
    { id: "self", label: "Self / Growth", emoji: "🌱", spread: TREE_OF_LIFE },
    { id: "health", label: "Health / Wellness", emoji: "🏥", spread: FOUR_ELEMENTS },
    { id: "other-themed", label: "Other", emoji: "🔮", spread: PAST_PRESENT_FUTURE },
  ],
};

export const SPECIFIC_GROUP: TabGroup = {
  id: "specific",
  label: "By Question Type",
  tabs: [
    { id: "yesno", label: "Yes / No", emoji: "❓", spread: YES_NO },
    { id: "aorb", label: "A or B Choice", emoji: "⚖️", spread: A_OR_B },
    { id: "universal", label: "Universal", emoji: "📜", spread: PAST_PRESENT_FUTURE },
  ],
};

export const ALL_GROUPS: TabGroup[] = [THEMED_GROUP, SPECIFIC_GROUP];

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
