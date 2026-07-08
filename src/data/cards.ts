export interface CardMeaning {
  upright: string;
  reversed: string;
  love: string;
  career: string;
  yesno: string;
}

export interface CardDefinition {
  id: number;
  name: string;
  type: "major" | "minor";
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  rank?: string;
  meaning: CardMeaning;
}

const CARDS: CardDefinition[] = [
  // ===== MAJOR ARCANA =====
  {
    id: 0, name: "The Fool", type: "major", arcana: "major",
    meaning: { upright: "New beginnings, innocence, spontaneity, free spirit", reversed: "Recklessness, risk-taking, foolishness, naivety", love: "A new romantic adventure, trusting the journey", career: "A leap of faith into a new career path", yesno: "Yes — take the leap" }
  },
  {
    id: 1, name: "The Magician", type: "major", arcana: "major",
    meaning: { upright: "Skill, willpower, resourcefulness, manifestation", reversed: "Manipulation, untapped talents, trickery", love: "Charisma and confidence attract a partner", career: "You have all the tools needed to succeed", yesno: "Yes — you have the power to make it happen" }
  },
  {
    id: 2, name: "The High Priestess", type: "major", arcana: "major",
    meaning: { upright: "Intuition, subconscious, inner wisdom, mystery", reversed: "Secrets, withdrawal, ignoring intuition", love: "Trust your instincts about this relationship", career: "Listen to your gut about a career decision", yesno: "Maybe — the answer is not yet revealed" }
  },
  {
    id: 3, name: "The Empress", type: "major", arcana: "major",
    meaning: { upright: "Abundance, nurturing, fertility, nature, beauty", reversed: "Creative block, dependence, emptiness", love: "A nurturing, loving relationship is blooming", career: "Growth and abundance in your work", yesno: "Yes — abundance is coming" }
  },
  {
    id: 4, name: "The Emperor", type: "major", arcana: "major",
    meaning: { upright: "Authority, structure, stability, discipline", reversed: "Tyranny, rigidity, lack of discipline", love: "A relationship with clear boundaries and stability", career: "Leadership and authority in your field", yesno: "Yes — establish structure first" }
  },
  {
    id: 5, name: "The Hierophant", type: "major", arcana: "major",
    meaning: { upright: "Tradition, spiritual guidance, conformity, wisdom", reversed: "Rebellion, unconventionality, challenging the status quo", love: "A traditional relationship or commitment", career: "Seek mentorship or follow established paths", yesno: "Yes — follow tradition" }
  },
  {
    id: 6, name: "The Lovers", type: "major", arcana: "major",
    meaning: { upright: "Love, harmony, relationships, choices, values", reversed: "Misalignment, imbalance, disharmony, indecision", love: "A deep soulmate connection or major relationship choice", career: "Align your work with your values", yesno: "Yes — follow your heart" }
  },
  {
    id: 7, name: "The Chariot", type: "major", arcana: "major",
    meaning: { upright: "Willpower, determination, victory, self-discipline", reversed: "Aggression, lack of control, no direction", love: "Assert your needs in the relationship", career: "Push forward with determination to win", yesno: "Yes — charge ahead" }
  },
  {
    id: 8, name: "Strength", type: "major", arcana: "major",
    meaning: { upright: "Courage, inner strength, compassion, resilience", reversed: "Self-doubt, weakness, insecurity, low confidence", love: "Gentle patience and courage in love", career: "Inner strength will carry you through challenges", yesno: "Yes — you are stronger than you think" }
  },
  {
    id: 9, name: "The Hermit", type: "major", arcana: "major",
    meaning: { upright: "Soul-searching, introspection, solitude, inner guidance", reversed: "Isolation, loneliness, withdrawal, lost", love: "Time for self-reflection before seeking love", career: "A retreat to reassess your career direction", yesno: "Not now — seek inner wisdom first" }
  },
  {
    id: 10, name: "Wheel of Fortune", type: "major", arcana: "major",
    meaning: { upright: "Change, cycles, destiny, turning points, luck", reversed: "Bad luck, resistance to change, broken cycles", love: "Fate is bringing a new chapter in love", career: "A turning point or promotion is coming", yesno: "Yes — change is inevitable" }
  },
  {
    id: 11, name: "Justice", type: "major", arcana: "major",
    meaning: { upright: "Fairness, truth, law, cause and effect, balance", reversed: "Injustice, dishonesty, imbalance, lack of accountability", love: "Fairness and balance in partnership", career: "Your efforts will be fairly rewarded", yesno: "Yes — the truth will prevail" }
  },
  {
    id: 12, name: "The Hanged Man", type: "major", arcana: "major",
    meaning: { upright: "Surrender, new perspective, pause, sacrifice", reversed: "Stalling, resistance, stalling, avoiding sacrifice", love: "A necessary pause to gain new perspective", career: "Step back and see the bigger picture", yesno: "Wait — patience is needed" }
  },
  {
    id: 13, name: "Death", type: "major", arcana: "major",
    meaning: { upright: "Endings, transformation, transition, release", reversed: "Resistance to change, stagnation, decay", love: "An ending makes way for new love", career: "Major transformation or career change", yesno: "Yes — but only after letting go" }
  },
  {
    id: 14, name: "Temperance", type: "major", arcana: "major",
    meaning: { upright: "Balance, moderation, patience, harmony, peace", reversed: "Imbalance, excess, lack of harmony", love: "Finding balance and harmony in partnership", career: "Moderation and patience lead to success", yesno: "Yes — with balance and patience" }
  },
  {
    id: 15, name: "The Devil", type: "major", arcana: "major",
    meaning: { upright: "Bondage, materialism, obsession, shadow self", reversed: "Release, liberation, reclaiming power", love: "A toxic pattern or obsessive attachment", career: "Feeling trapped by material ambitions", yesno: "No — break free from what binds you" }
  },
  {
    id: 16, name: "The Tower", type: "major", arcana: "major",
    meaning: { upright: "Sudden change, upheaval, revelation, awakening", reversed: "Avoiding disaster, delaying the inevitable", love: "A sudden breakup or revelation shakes things up", career: "Unexpected job loss or restructuring", yesno: "Change is coming — prepare" }
  },
  {
    id: 17, name: "The Star", type: "major", arcana: "major",
    meaning: { upright: "Hope, inspiration, serenity, renewal, faith", reversed: "Despair, discouragement, lack of faith", love: "Healing and hope after a difficult time", career: "Inspiration guides your career path", yesno: "Yes — hope shines bright" }
  },
  {
    id: 18, name: "The Moon", type: "major", arcana: "major",
    meaning: { upright: "Illusion, fear, anxiety, the unconscious, intuition", reversed: "Release of fear, clarity, understanding", love: "Uncertainty or hidden truths in a relationship", career: "Things are not as they seem at work", yesno: "Unclear — look beyond the surface" }
  },
  {
    id: 19, name: "The Sun", type: "major", arcana: "major",
    meaning: { upright: "Joy, success, vitality, celebration, positivity", reversed: "Temporary sadness, blocked happiness", love: "A joyful, radiant relationship", career: "Success and recognition for your work", yesno: "Yes — a resounding yes!" }
  },
  {
    id: 20, name: "Judgement", type: "major", arcana: "major",
    meaning: { upright: "Judgement, rebirth, inner calling, reckoning", reversed: "Self-doubt, refusal to heed the call", love: "A relationship is being tested", career: "A calling or major career reassessment", yesno: "Yes — rise to your calling" }
  },
  {
    id: 21, name: "The World", type: "major", arcana: "major",
    meaning: { upright: "Completion, achievement, fulfillment, travel", reversed: "Incompletion, delays, stagnation", love: "A completed cycle or soulmate connection", career: "A major achievement or project completion", yesno: "Yes — a cycle completes" }
  },

  // ===== WANDS =====
  { id: 22, name: "Ace of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "ace", meaning: { upright: "Inspiration, new vision, creative spark, potential", reversed: "Delays, lack of motivation, creative block", love: "A spark of passion or new romantic interest", career: "A new project or creative venture begins", yesno: "Yes — a new spark" } },
  { id: 23, name: "Two of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "2", meaning: { upright: "Future planning, progress, decisions, discovery", reversed: "Lack of planning, fear of unknown, poor decisions", love: "Planning a future together", career: "Expanding your horizons and making plans", yesno: "Plan carefully before deciding" } },
  { id: 24, name: "Three of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "3", meaning: { upright: "Expansion, foresight, progress, preparation", reversed: "Delays, obstacles, lack of progress", love: "Long-distance relationship or growing together", career: "Expansion into new markets or roles", yesno: "Yes — expansion is ahead" } },
  { id: 25, name: "Four of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "4", meaning: { upright: "Celebration, harmony, homecoming, community", reversed: "Tension, conflict, lack of support", love: "A celebration or commitment in love", career: "Team success and workplace harmony", yesno: "Yes — celebrate!" } },
  { id: 26, name: "Five of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "5", meaning: { upright: "Competition, conflict, tension, diversity", reversed: "Avoiding conflict, collaboration, resolution", love: "Arguments or competition in a relationship", career: "Office politics or competitive environment", yesno: "Conflicts ahead — prepare" } },
  { id: 27, name: "Six of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "6", meaning: { upright: "Victory, recognition, confidence, success", reversed: "Ego, lack of recognition, failure", love: "Public recognition of your relationship", career: "Promotion, praise, or winning a deal", yesno: "Yes — victory is yours" } },
  { id: 28, name: "Seven of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "7", meaning: { upright: "Defense, perseverance, standing your ground", reversed: "Giving up, overwhelmed, losing ground", love: "Defending your relationship from outside pressures", career: "Stand your ground against competition", yesno: "Stand firm — don't back down" } },
  { id: 29, name: "Eight of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "8", meaning: { upright: "Speed, movement, rapid progress, action", reversed: "Delays, frustration, waiting, slowdown", love: "A relationship moves quickly forward", career: "Fast progress on multiple projects", yesno: "Yes — full speed ahead" } },
  { id: 30, name: "Nine of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "9", meaning: { upright: "Resilience, persistence, last stand, boundaries", reversed: "Exhaustion, burnout, giving up", love: "One last hurdle before relationship stability", career: "Almost there — persevere through the final push", yesno: "Almost — one more effort" } },
  { id: 31, name: "Ten of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "10", meaning: { upright: "Burden, overload, responsibility, hard work", reversed: "Release, delegation, lightening the load", love: "Relationship feels burdensome or one-sided", career: "Overworked — delegate or reassess priorities", yesno: "Too much — delegate first" } },
  { id: 32, name: "Page of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "page", meaning: { upright: "Enthusiasm, exploration, free spirit, discovery", reversed: "Lack of direction, setbacks, impulsiveness", love: "A playful flirtation or new romantic interest", career: "A new opportunity or learning experience", yesno: "Yes — explore with enthusiasm" } },
  { id: 33, name: "Knight of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "knight", meaning: { upright: "Action, adventure, passion, daring", reversed: "Impulsiveness, haste, burnout, recklessness", love: "A passionate, adventurous romantic pursuit", career: "Bold action leads to career advancement", yesno: "Go for it — but don't rush blindly" } },
  { id: 34, name: "Queen of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "queen", meaning: { upright: "Confidence, courage, warmth, determination", reversed: "Self-doubt, jealousy, insecurity", love: "A confident, warm partner or being your radiant self", career: "Lead with confidence and inspire others", yesno: "Yes — believe in yourself" } },
  { id: 35, name: "King of Wands", type: "minor", arcana: "minor", suit: "wands", rank: "king", meaning: { upright: "Leadership, vision, entrepreneurship, honor", reversed: "Ruthlessness, high expectations, arrogance", love: "A charismatic, bold partner", career: "Take the lead and make bold decisions", yesno: "Yes — lead the way" } },

  // ===== CUPS =====
  { id: 36, name: "Ace of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "ace", meaning: { upright: "Love, new feelings, compassion, emotional start", reversed: "Emotional emptiness, blocked feelings, loneliness", love: "A new love or deep emotional connection begins", career: "Follow work that brings emotional fulfillment", yesno: "Yes — open your heart" } },
  { id: 37, name: "Two of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "2", meaning: { upright: "Connection, partnership, unity, mutual love", reversed: "Breakup, imbalance, separation, conflict", love: "A deep, soulful romantic partnership", career: "A strong business partnership forms", yesno: "Yes — a beautiful connection" } },
  { id: 38, name: "Three of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "3", meaning: { upright: "Friendship, celebration, community, joy", reversed: "Overindulgence, gossip, isolation", love: "A joyful, social love or friendship group", career: "Team celebration and collaborative success", yesno: "Yes — celebrate with others" } },
  { id: 39, name: "Four of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "4", meaning: { upright: "Meditation, apathy, contemplation, discontent", reversed: "New possibilities, action, reawakening", love: "Feeling unfulfilled or taking love for granted", career: "Boredom or dissatisfaction with your job", yesno: "Look up — you might miss an opportunity" } },
  { id: 40, name: "Five of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "5", meaning: { upright: "Loss, grief, disappointment, regret", reversed: "Acceptance, moving on, forgiveness", love: "Grieving a lost relationship or disappointment", career: "Regret over a missed opportunity or loss", yesno: "No — but acceptance brings peace" } },
  { id: 41, name: "Six of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "6", meaning: { upright: "Nostalgia, memories, childhood, innocence", reversed: "Moving forward, leaving the past, maturity", love: "A reunion or reconnecting with past love", career: "Returning to a familiar role or industry", yesno: "The past holds the key" } },
  { id: 42, name: "Seven of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "7", meaning: { upright: "Choices, fantasy, illusion, daydreaming", reversed: "Clarity, focus, realistic goals", love: "Many romantic options — be careful what you wish for", career: "Too many opportunities — focus on one", yesno: "Unclear — clarity is needed" } },
  { id: 43, name: "Eight of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "8", meaning: { upright: "Departure, withdrawal, moving on, seeking truth", reversed: "Fear of change, avoidance, aimless drifting", love: "Walking away from an unfulfilling relationship", career: "Leaving a job to find deeper meaning", yesno: "Leave what no longer serves you" } },
  { id: 44, name: "Nine of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "9", meaning: { upright: "Wishes fulfilled, contentment, satisfaction", reversed: "Dissatisfaction, excess, unmet wishes", love: "A wish come true in love — deep happiness", career: "Career satisfaction and achievement", yesno: "Yes — your wish will be granted" } },
  { id: 45, name: "Ten of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "10", meaning: { upright: "Harmony, happiness, emotional fulfillment, family", reversed: "Dysfunction, broken family, shattered dreams", love: "Ultimate emotional fulfillment and family bliss", career: "Work-life harmony and fulfillment", yesno: "Yes — true happiness awaits" } },
  { id: 46, name: "Page of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "page", meaning: { upright: "Creative opportunities, intuition, curiosity", reversed: "Creative block, emotional immaturity", love: "A romantic message or creative invitation", career: "A creative project or intuitive idea emerges", yesno: "Yes — follow your inspiration" } },
  { id: 47, name: "Knight of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "knight", meaning: { upright: "Romance, charm, imagination, following the heart", reversed: "Jealousy, moodiness, unrealistic expectations", love: "A romantic proposal or grand gesture", career: "Follow your passion in your career", yesno: "Yes — follow your heart" } },
  { id: 48, name: "Queen of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "queen", meaning: { upright: "Compassion, emotional depth, nurturing, intuition", reversed: "Emotional insecurity, codependency, martyrdom", love: "A deeply nurturing, emotionally available partner", career: "Care for others through your work", yesno: "Yes — trust your intuition" } },
  { id: 49, name: "King of Cups", type: "minor", arcana: "minor", suit: "cups", rank: "king", meaning: { upright: "Emotional maturity, wisdom, diplomacy, calm", reversed: "Emotional repression, moodiness, volatility", love: "An emotionally mature, stable partner", career: "Lead with emotional intelligence and diplomacy", yesno: "Yes — with wisdom and calm" } },

  // ===== SWORDS =====
  { id: 50, name: "Ace of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "ace", meaning: { upright: "Clarity, truth, mental breakthrough, new idea", reversed: "Confusion, misinformation, mental block", love: "A moment of clarity about your relationship", career: "A breakthrough idea or decisive action", yesno: "Yes — the truth cuts through" } },
  { id: 51, name: "Two of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "2", meaning: { upright: "Difficult decisions, stalemate, avoidance", reversed: "Less information, clarity, breaking the deadlock", love: "Indecision about a relationship choice", career: "A tough career decision you're avoiding", yesno: "Too torn to decide now" } },
  { id: 52, name: "Three of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "3", meaning: { upright: "Heartbreak, sorrow, grief, betrayal", reversed: "Recovery, forgiveness, moving on", love: "Heartbreak, betrayal, or painful separation", career: "Professional disappointment or layoffs", yesno: "No — healing comes first" } },
  { id: 53, name: "Four of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "4", meaning: { upright: "Rest, restoration, meditation, recuperation", reversed: "Burnout, restlessness, no peace", love: "Taking a break to heal from relationship stress", career: "A sabbatical or needed mental break", yesno: "Rest before deciding" } },
  { id: 54, name: "Five of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "5", meaning: { upright: "Conflict, defeat, loss, win-at-all-costs", reversed: "Reconciliation, compromise, moving past conflict", love: "A toxic argument or power struggle", career: "A Pyrrhic victory — winning but losing respect", yesno: "No — the cost is too high" } },
  { id: 55, name: "Six of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "6", meaning: { upright: "Transition, moving on, leaving behind, journey", reversed: "Resistance to change, baggage, unfinished business", love: "Moving on from a difficult relationship", career: "A necessary career transition", yesno: "Yes — move forward peacefully" } },
  { id: 56, name: "Seven of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "7", meaning: { upright: "Deception, strategy, stealth, getting away with it", reversed: "Confession, conscience, coming clean", love: "Dishonesty or hidden agendas in love", career: "A strategic advantage or office politics", yesno: "Be careful — not everything is as it seems" } },
  { id: 57, name: "Eight of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "8", meaning: { upright: "Feeling trapped, self-imposed restriction, victimhood", reversed: "Liberation, new perspective, empowerment", love: "Feeling trapped in a situation — break free", career: "Your own mindset is the biggest barrier", yesno: "You hold the key to your freedom" } },
  { id: 58, name: "Nine of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "9", meaning: { upright: "Anxiety, worry, nightmares, fear, despair", reversed: "Hope, recovery, reaching out, relief", love: "Overthinking and worrying about the relationship", career: "Work anxiety keeping you up at night", yesno: "Your fears are worse than reality" } },
  { id: 59, name: "Ten of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "10", meaning: { upright: "Rock bottom, painful ending, betrayal, crisis", reversed: "Recovery, resurrection, lessons learned", love: "A painful breakup or betrayal — the end", career: "Rock bottom in your career — time to rebuild", yesno: "The end is here — a new beginning awaits" } },
  { id: 60, name: "Page of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "page", meaning: { upright: "Curiosity, mental energy, new ideas, communication", reversed: "Haste, gossip, overthinking, cynicism", love: "A message or conversation sparks romantic interest", career: "A new idea or intellectual pursuit", yesno: "Yes — communicate clearly" } },
  { id: 61, name: "Knight of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "knight", meaning: { upright: "Ambition, fast thinking, determination, action", reversed: "Burnout, reckless haste, impulsiveness", love: "A direct, intense romantic pursuit", career: "Charge ahead with your ambitious plan", yesno: "Go fast — but don't burn out" } },
  { id: 62, name: "Queen of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "queen", meaning: { upright: "Clear thinking, truth, boundaries, independence", reversed: "Coldness, bitterness, harsh judgment", love: "An independent, honest approach to love", career: "Make decisions with clarity and logic", yesno: "Speak your truth" } },
  { id: 63, name: "King of Swords", type: "minor", arcana: "minor", suit: "swords", rank: "king", meaning: { upright: "Intellectual authority, truth, justice, ethics", reversed: "Abuse of power, manipulation, cold logic", love: "A relationship based on intellectual connection", career: "Lead with wisdom and ethical clarity", yesno: "Decide with logic and integrity" } },

  // ===== PENTACLES =====
  { id: 64, name: "Ace of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "ace", meaning: { upright: "New financial opportunity, prosperity, abundance", reversed: "Missed opportunity, financial setbacks", love: "A relationship built on solid foundations", career: "A new job, raise, or financial opportunity", yesno: "Yes — a prosperous start" } },
  { id: 65, name: "Two of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "2", meaning: { upright: "Balance, multitasking, priorities, adaptability", reversed: "Overwhelm, financial disorganization, imbalance", love: "Juggling relationship and other priorities", career: "Balancing multiple projects or incomes", yesno: "Stay balanced and flexible" } },
  { id: 66, name: "Three of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "3", meaning: { upright: "Teamwork, collaboration, skill building, mastery", reversed: "Lack of teamwork, disregard for skills, poor quality", love: "Building a relationship through shared effort", career: "Collaboration and learning from others", yesno: "Yes — teamwork makes the dream work" } },
  { id: 67, name: "Four of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "4", meaning: { upright: "Security, conservation, control, frugality", reversed: "Greed, materialism, stinginess, letting go", love: "Holding back emotionally out of fear", career: "Financial security through careful saving", yesno: "Hold tight — security first" } },
  { id: 68, name: "Five of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "5", meaning: { upright: "Financial hardship, poverty, isolation, worry", reversed: "Recovery, spiritual growth, finding help", love: "Feeling unsupported or abandoned in love", career: "Financial struggle or job loss", yesno: "No — but help is available" } },
  { id: 69, name: "Six of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "6", meaning: { upright: "Generosity, charity, sharing, giving/receiving", reversed: "Strings attached, inequality, unpaid debts", love: "A generous, balanced exchange of love", career: "Mentorship or fair compensation", yesno: "Yes — give and receive freely" } },
  { id: 70, name: "Seven of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "7", meaning: { upright: "Patience, assessment, long-term vision, harvest", reversed: "Impatience, poor investments, wasted effort", love: "Assessing if the relationship is worth the effort", career: "Waiting for investments or projects to bear fruit", yesno: "Be patient — the harvest is coming" } },
  { id: 71, name: "Eight of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "8", meaning: { upright: "Diligence, craftsmanship, skill development, study", reversed: "Perfectionism, lack of motivation, shortcuts", love: "Putting in the work to build relationship skills", career: "Apprenticeship, study, or mastering your craft", yesno: "Yes — diligent effort pays off" } },
  { id: 72, name: "Nine of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "9", meaning: { upright: "Luxury, self-sufficiency, financial abundance", reversed: "Financial setbacks, living beyond means", love: "Enjoying your own company or a luxurious relationship", career: "Financial independence and professional success", yesno: "Yes — abundance is yours" } },
  { id: 73, name: "Ten of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "10", meaning: { upright: "Wealth, legacy, inheritance, family traditions", reversed: "Family disputes, financial loss, bankruptcy", love: "A relationship blessed by family and tradition", career: "Long-term financial success and legacy", yesno: "Yes — lasting prosperity" } },
  { id: 74, name: "Page of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "page", meaning: { upright: "Ambition, diligence, learning, financial news", reversed: "Lack of progress, laziness, procrastination", love: "A grounded, sincere new romantic interest", career: "A new job, study opportunity, or financial news", yesno: "Yes — start with dedication" } },
  { id: 75, name: "Knight of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "knight", meaning: { upright: "Hard work, reliability, responsibility, routine", reversed: "Stubbornness, laziness, monotony, stagnation", love: "A steady, reliable, committed partner", career: "Persistent work leads to steady progress", yesno: "Yes — slow and steady wins" } },
  { id: 76, name: "Queen of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "queen", meaning: { upright: "Nurturing, practicality, abundance, security", reversed: "Neglect, financial insecurity, smothering", love: "A nurturing, practical partner who provides stability", career: "Financial security through practical management", yesno: "Yes — nurture your resources" } },
  { id: 77, name: "King of Pentacles", type: "minor", arcana: "minor", suit: "pentacles", rank: "king", meaning: { upright: "Abundance, leadership, financial security, discipline", reversed: "Greed, stubbornness, financial mismanagement", love: "A stable, generous, financially secure partner", career: "Business success and financial mastery", yesno: "Yes — wealth and wisdom combined" } },
];

export default CARDS;

export function getCardById(id: number): CardDefinition | undefined {
  return CARDS.find(c => c.id === id);
}

export function getCardByName(name: string): CardDefinition | undefined {
  return CARDS.find(c => c.name.toLowerCase() === name.toLowerCase());
}

export function getCardsBySuit(suit: string): CardDefinition[] {
  return CARDS.filter(c => c.suit === suit);
}

export function getMajorArcana(): CardDefinition[] {
  return CARDS.filter(c => c.arcana === "major");
}

export function getMinorArcana(): CardDefinition[] {
  return CARDS.filter(c => c.arcana === "minor");
}
