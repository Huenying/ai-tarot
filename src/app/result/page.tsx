"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import LOCAL_CARDS from "@/data/cards";
import { majorArcana } from "tarot-card-meanings";

// ─────────────────────────────────────────────────────────────────
//  Merged card lookup
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

// ─────────────────────────────────────────────────────────────────
//  Expandable meaning panel
// ─────────────────────────────────────────────────────────────────

function CardMeaningPanel({
  card,
  isReversed,
  expanded,
  onToggle,
}: {
  card: EnrichedCard;
  isReversed: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <div className="w-full max-w-[280px] md:max-w-[360px]">
      {/* Title bar — always visible after flip, clickable to expand */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 border border-[#2B4C7E]/10 bg-[#E0DFE8]/50 hover:bg-[#E0DFE8] transition-colors duration-200 text-left cursor-pointer rounded-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-[#2B4C7E] font-heading text-sm md:text-base tracking-wider leading-tight truncate">
            {card.name}
          </h3>
          <span
            className={`shrink-0 text-[9px] px-2 py-0.5 border ${
              isReversed
                ? "border-[#A57C2A]/40 text-[#A57C2A] font-semibold"
                : "border-[#2B4C7E]/30 text-[#2B4C7E] font-semibold"
            }`}
          >
            {isReversed ? "Reversed" : "Upright"}
          </span>
        </div>
        <motion.span
          className="text-[#3D5470] text-sm ml-2 shrink-0"
          animate={{ rotateX: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 px-1">
              {/* Keywords */}
              {card.keywords && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {card.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#2B4C7E]/10 text-[#3D5470] uppercase tracking-wider"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Combined Love / Career */}
              <div className="flex items-start gap-2 p-2 mb-1.5 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm text-xs md:text-sm">
                <span className="text-[#3D5470] shrink-0 whitespace-nowrap">❤ Love / 💼 Career</span>
                <span className="text-[#1C2D42]">{meaning}</span>
              </div>

              {/* Yes / No */}
              <div className="flex items-start gap-2 p-2 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm text-xs md:text-sm">
                <span className="text-[#3D5470] shrink-0">❓ Yes or No</span>
                <span className="text-[#1C2D42]">{card.yesno}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  Result page
// ─────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Read card IDs and reversed status from URL
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
    } catch {
      // ignore
    }
    return ids.map((id, i) => ({ id, isReversed: revs[i] ?? false }));
  }, [isClient]);

  // Resolve enriched cards
  const selectedCards: { card: EnrichedCard; isReversed: boolean }[] = useMemo(() => {
    return cardData
      .map((d) => {
        const local = LOCAL_CARDS.find((c) => c.id === d.id);
        if (!local) return null;
        const enriched = ENRICHED.get(local.name);
        if (!enriched) return null;
        return { card: enriched, isReversed: d.isReversed };
      })
      .filter(Boolean) as { card: EnrichedCard; isReversed: boolean }[];
  }, [cardData]);

  // ── Flip & expand state ──
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const handleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleToggleExpand = (index: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
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
          <p className="text-[#1C2D42] text-lg mb-2">
            {cardData.length > 0 ? "Unable to load card data" : "No cards selected"}
          </p>
          <p className="text-[#3D5470] text-xs mb-4">Please select 3 cards first.</p>
          <Link
            href="/"
            className="text-[#2B4C7E] font-heading text-sm tracking-wider underline hover:text-[#A57C2A]"
          >
            Return to start
          </Link>
        </div>
      </div>
    );
  }

  const positionLabels = ["Past / Foundation", "Present / Challenge", "Future / Outcome"];

  return (
    <main className="relative min-h-screen py-8 px-4 md:px-8" style={{ backgroundColor: "#F0EFF5" }}>
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 mx-auto rounded-full border border-[#2B4C7E]/30 flex items-center justify-center mb-4">
          <span className="text-2xl">🔮</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading text-[#2B4C7E] tracking-[0.12em] mb-2">
          Your Reading
        </h1>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/50 to-transparent mx-auto mb-4" />
        <p className="text-[#3D5470] text-sm max-w-md mx-auto">
          Click each card to reveal its message
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-10">
          {selectedCards.map(({ card, isReversed }, i) => {
            const isFlipped = flippedCards.has(i);

            return (
              <motion.div
                key={card.id}
                className="flex flex-col items-center w-full md:w-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.25 }}
              >
                {/* Position label */}
                <span className="text-xs md:text-sm text-[#3D5470] font-heading tracking-widest mb-3 uppercase">
                  {positionLabels[i] || `Card ${i + 1}`}
                </span>

                {/* Card — click to flip */}
                <div className="mb-4">
                  <div onClick={() => !isFlipped && handleFlip(i)}>
                    <Card
                      card={card as any}
                      faceUp={isFlipped}
                      size="lg"
                      showName={false}
                      hideOverlay={true}
                      rotation={isFlipped && isReversed ? 180 : 0}
                      className={`${!isFlipped ? "cursor-pointer hover:scale-[1.03] transition-transform" : ""} shadow-2xl`}
                    />
                  </div>
                </div>

                {/* Title bar + expandable meaning (appears after flip) */}
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div
                      key="panel"
                      className="w-full"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.15 }}
                    >
                      <CardMeaningPanel
                        card={card}
                        isReversed={isReversed}
                        expanded={expandedCards.has(i)}
                        onToggle={() => handleToggleExpand(i)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col items-center mt-12 gap-4">
        {/* Unlock AI Insight — passes card data to chat page */}
        <Link
          href={`/chat?${cardData.map((d) => `cards=${d.id}&rev=${d.isReversed ? "1" : "0"}`).join("&")}`}
          className="px-8 py-2.5 border border-brilliant-gold/50 text-brilliant-gold font-heading text-sm tracking-[0.15em] hover:bg-brilliant-gold/10 hover:shadow-[0_0_25px_rgba(165,124,42,0.2)] transition-all duration-300"
        >
          🔮 Unlock AI Insight
        </Link>

        <Link
          href="/"
          className="px-8 py-2.5 border border-[#2B4C7E]/40 text-[#2B4C7E] font-heading text-sm tracking-[0.15em] hover:bg-[#2B4C7E]/10 hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300"
        >
          New Reading
        </Link>
      </div>

      {/* ── Footer ── */}
      <div className="mt-16 text-center">
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/20 to-transparent mx-auto mb-4" />
        <p className="text-[#BDBDCC] text-[9px] tracking-widest">
          TRUST THE JOURNEY · THE CARDS KNOW THE WAY
        </p>
      </div>
    </main>
  );
}
