"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import LOCAL_CARDS from "@/data/cards";
import { majorArcana } from "tarot-card-meanings";

// ─────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────

interface EnrichedCard {
  id: number;
  name: string;
  type: "major" | "minor";
  suit?: string;
  rank?: string;
  element?: string;
  planet?: string;
  keywords?: string[];
  upright: string;
  reversed: string;
  love: string;
  career: string;
  yesno: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface CardWithPosition {
  card: EnrichedCard;
  isReversed: boolean;
  position: string;
}

// ─────────────────────────────────────────────────────────────────
//  Enriched card data (same as result page)
// ─────────────────────────────────────────────────────────────────

function buildEnrichedCards(): Map<string, EnrichedCard> {
  const map = new Map<string, EnrichedCard>();
  const npmByName = new Map<string, any>();
  for (const c of majorArcana) {
    npmByName.set(c.name.toLowerCase(), c);
  }
  for (const local of LOCAL_CARDS) {
    const npm = npmByName.get(local.name.toLowerCase());
    map.set(local.name, {
      id: local.id,
      name: local.name,
      type: local.type,
      suit: local.suit,
      rank: local.rank,
      element: npm?.element ?? undefined,
      planet: npm?.planet ?? undefined,
      keywords: npm?.keywords ?? undefined,
      upright: npm?.upright ?? local.meaning.upright,
      reversed: npm?.reversed ?? local.meaning.reversed,
      love: npm?.love ?? local.meaning.love,
      career: npm?.career ?? local.meaning.career,
      yesno: npm?.yesNo ?? local.meaning.yesno,
    });
  }
  return map;
}

const ENRICHED = buildEnrichedCards();
const POSITION_LABELS = ["Past / Foundation", "Present / Challenge", "Future / Outcome"];

// ─────────────────────────────────────────────────────────────────
//  Q&A Response Engine
// ─────────────────────────────────────────────────────────────────

function formatCardMeaning(card: EnrichedCard, isReversed: boolean): string {
  const label = isReversed ? "Reversed" : "Upright";
  const meaning = isReversed ? card.reversed : card.upright;
  const yesno = card.yesno;
  const love = isReversed ? card.reversed : card.love;
  const career = isReversed ? card.reversed : card.career;

  let text = `**${card.name} (${label})**\n${meaning}\n\n❤ Love / 💼 Career: ${love}`;
  text += `\n❓ Yes/No: ${yesno}`;
  if (card.keywords?.length) text += `\n\nKeywords: ${card.keywords.join(", ")}`;
  return text;
}

function generateResponse(userInput: string, cards: CardWithPosition[]): string {
  const input = userInput.toLowerCase().trim();
  if (!input) return helpText();

  // Check for card name mentions
  for (const { card, isReversed } of cards) {
    const searchName = card.name.toLowerCase();
    if (input.includes(searchName)) {
      return formatCardMeaning(card, isReversed);
    }
  }

  // Check for position mentions
  for (const c of cards) {
    const posWords = c.position.toLowerCase().replace(" / ", " ");
    const words = posWords.split(" ");
    for (const w of words) {
      if (input.includes(w) && w.length > 2) {
        return `**${c.card.name}** (${c.position})\n${formatCardMeaning(c.card, c.isReversed)}`;
      }
    }
  }

  // Love / relationship
  if (input.includes("love") || input.includes("romance") || input.includes("relationship") || input.includes("heart")) {
    return cards.map(({ card, isReversed }) => {
      const text = isReversed ? card.reversed : card.love;
      return `💕 **${card.name}**\n${text}`;
    }).join("\n\n");
  }

  // Career / work
  if (input.includes("career") || input.includes("work") || input.includes("job") || input.includes("business") || input.includes("money")) {
    return cards.map(({ card, isReversed }) => {
      const text = isReversed ? card.reversed : card.career;
      return `💼 **${card.name}**\n${text}`;
    }).join("\n\n");
  }

  // Yes / No
  if (input.includes("yes") || input.includes("no") || input.includes("yesno") || input.includes("answer")) {
    return cards.map(({ card, isReversed }) =>
      `**${card.name}** ❓ ${card.yesno}`
    ).join("\n\n");
  }

  // All / overall / summary / everything
  if (input.includes("all") || input.includes("overall") || input.includes("summary") || input.includes("everything") || input.includes("every")) {
    return cards.map(({ card, isReversed, position }) =>
      `**${position}**\n${formatCardMeaning(card, isReversed)}`
    ).join("\n\n---\n\n");
  }

  // Keyword matching
  for (const { card, isReversed } of cards) {
    if (card.keywords) {
      for (const kw of card.keywords) {
        if (input.includes(kw.toLowerCase())) {
          return `"${kw}" relates to **${card.name}**:\n\n${formatCardMeaning(card, isReversed)}`;
        }
      }
    }
  }

  return helpText();
}

function helpText(): string {
  return `✨ I can help you explore your cards! Try asking:

• **"Tell me about The Fool"** — meaning of a specific card
• **"Love"** — love and relationship insights
• **"Career"** — career and work guidance
• **"Past"** or **"Present"** or **"Future"** — a specific position
• **"Overall"** — full reading summary
• **"Yes or No"** — yes/no guidance

What would you like to know?`;
}

function getWelcomeMessage(): string {
  return `🔮 Welcome to AI Tarot Insight!

I can answer your questions about the three cards you've selected. Ask me about love, career, a specific card's meaning, or request an overall reading summary.

${helpText()}`;
}

// ─────────────────────────────────────────────────────────────────
//  Chat Page
// ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Parse URL
  const cardData: { id: number; isReversed: boolean }[] = useMemo(() => {
    if (!isClient) return [];
    const ids: number[] = [];
    const revs: boolean[] = [];
    try {
      const params = new URLSearchParams(window.location.search);
      const cards = params.getAll("cards");
      const revsRaw = params.getAll("rev");
      cards.forEach((v) => {
        const n = Number(v);
        if (!isNaN(n)) ids.push(n);
      });
      revsRaw.forEach((v) => revs.push(v === "1"));
    } catch { /* ignore */ }
    return ids.map((id, i) => ({ id, isReversed: revs[i] ?? false }));
  }, [isClient]);

  // Resolve enriched cards with positions
  const selectedCards: CardWithPosition[] = useMemo(() => {
    return cardData
      .map((d, i) => {
        const local = LOCAL_CARDS.find((c) => c.id === d.id);
        if (!local) return null;
        const enriched = ENRICHED.get(local.name);
        if (!enriched) return null;
        return { card: enriched, isReversed: d.isReversed, position: POSITION_LABELS[i] || `Card ${i + 1}` };
      })
      .filter(Boolean) as CardWithPosition[];
  }, [cardData]);

  // ── Chat state ──
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const welcomeShown = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show welcome message once cards are loaded
  useEffect(() => {
    if (selectedCards.length === 3 && !welcomeShown.current) {
      welcomeShown.current = true;
      setMessages([{ id: "welcome", role: "assistant", text: getWelcomeMessage() }]);
    }
  }, [selectedCards]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send message handler
  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setInputText("");

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate typing delay
    setIsTyping(true);
    const delay = 400 + Math.random() * 600;
    setTimeout(() => {
      const response = generateResponse(text, selectedCards);
      const botMsg: ChatMessage = { id: `bot-${Date.now()}`, role: "assistant", text: response };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, [inputText, isTyping, selectedCards]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Loading state ──
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2B4C7E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#3D5470] text-xs">Preparing your reading...</p>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (selectedCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="text-center">
          <p className="text-[#1C2D42] text-lg mb-2">No cards selected</p>
          <p className="text-[#3D5470] text-xs mb-4">Please select 3 cards first.</p>
          <Link href="/" className="text-[#2B4C7E] font-heading text-sm tracking-wider underline hover:text-[#A57C2A]">
            Return to start
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: "#F0EFF5" }}>
      {/* ── Left Sidebar ── */}
      <motion.aside
        className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-[#2B4C7E]/10 bg-[#E8E7EE]/50 p-4"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-xl mb-1">🔮</div>
          <h2 className="text-[#2B4C7E] font-heading text-sm tracking-wider">AI Tarot Insight</h2>
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/40 to-transparent mx-auto mt-2" />
        </div>

        {/* Card thumbnails */}
        {selectedCards.map(({ card, isReversed, position }, i) => (
          <motion.div
            key={card.id}
            className="flex flex-col items-center mb-5"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
          >
            <span className="text-[9px] text-[#3D5470] font-heading tracking-widest mb-2 uppercase">
              {position}
            </span>
            <div className="scale-[0.6] -my-5">
              <Card
                card={card as any}
                faceUp={true}
                showName={false}
                hideOverlay={true}
                rotation={isReversed ? 180 : 0}
              />
            </div>
            <span className="text-[10px] text-[#1C2D42] font-heading tracking-wider mt-0.5 text-center leading-tight">
              {card.name}
            </span>
            <span className={`text-[8px] px-1.5 py-0.5 border mt-0.5 ${
              isReversed
                ? "border-[#A57C2A]/40 text-[#A57C2A] font-semibold"
                : "border-[#2B4C7E]/30 text-[#2B4C7E] font-semibold"
            }`}>
              {isReversed ? "Reversed" : "Upright"}
            </span>
          </motion.div>
        ))}

        {/* New Reading link */}
        <div className="mt-auto pt-4 text-center">
          <Link
            href="/"
            className="text-[10px] text-[#2B4C7E] font-heading tracking-wider underline hover:text-[#A57C2A] transition-colors"
          >
            - New Reading
          </Link>
        </div>
      </motion.aside>

      {/* ── Right Chat Area ── */}
      <motion.div
        className="flex-1 flex flex-col min-w-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Chat Header */}
        <div className="text-center py-5 px-4 border-b border-[#2B4C7E]/10">
          <h1 className="text-xl md:text-2xl font-heading text-[#2B4C7E] tracking-[0.08em]">
            💬 Ask About Your Reading
          </h1>
          <p className="text-[#3D5470] text-xs mt-1">
            Ask me anything about the cards and their meanings
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: "calc(100vh - 220px)" }}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-sm p-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#2B4C7E] text-white"
                      : "bg-[#E0DFE8] text-[#1C2D42]"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[#E0DFE8] rounded-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#3D5470] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[#3D5470] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[#3D5470] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-[#2B4C7E]/10 p-4">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 text-sm border border-[#2B4C7E]/20 bg-white text-[#1C2D42] placeholder-[#BDBDCC] outline-none focus:border-[#2B4C7E]/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="px-5 py-2.5 font-heading text-xs tracking-[0.1em] uppercase border border-[#2B4C7E]/50 text-[#2B4C7E] hover:bg-[#2B4C7E]/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* Mobile sidebar (compact row below input on small screens) */}
        <div className="md:hidden border-t border-[#2B4C7E]/10 px-4 py-3">
          <div className="flex justify-center gap-4">
            {selectedCards.map(({ card, isReversed, position }, i) => (
              <div key={card.id} className="flex flex-col items-center">
                <span className="text-[7px] text-[#3D5470] font-heading tracking-widest mb-1">{position.split(" / ")[0]}</span>
                <div className="scale-[0.45] -my-6">
                  <Card card={card as any} faceUp={true} showName={false} hideOverlay={true} rotation={isReversed ? 180 : 0} />
                </div>
                <span className="text-[8px] text-[#1C2D42] font-heading mt-0.5">
                  {isReversed ? "↕ Rev" : "↑ Up"}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <Link href="/" className="text-[9px] text-[#2B4C7E] font-heading tracking-wider underline">- New Reading</Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
