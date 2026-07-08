"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import LOCAL_CARDS from "@/data/cards";
import { majorArcana } from "tarot-card-meanings";

// ─────────────────────────────────────────────────────────────────
//  Merged card lookup — npm package for Major Arcana (richer),
//  local data for Minor Arcana (only source with all 78 cards)
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

function CardMeaningPanel({
  card,
  isReversed,
  onToggle,
}: {
  card: EnrichedCard;
  isReversed: boolean;
  onToggle: () => void;
}) {
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <div className="w-full max-w-[280px] md:max-w-[320px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-primary-gold font-heading text-sm tracking-wider leading-tight">
            {card.name}
          </h3>
          {card.element && (
            <span className="text-[9px] text-dark-bronze uppercase tracking-widest">
              {card.element} · {card.planet}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`text-[9px] px-2 py-0.5 border transition-colors ${
            isReversed
              ? "border-brilliant-gold/30 text-brilliant-gold/70 hover:border-brilliant-gold/60"
              : "border-primary-gold/30 text-primary-gold/70 hover:border-primary-gold/60"
          }`}
        >
          {isReversed ? "Reversed" : "Upright"}
        </button>
      </div>

      <p className="text-warm-stone text-xs leading-relaxed mb-2.5 italic">
        &ldquo;{meaning}&rdquo;
      </p>

      {card.keywords && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[8px] px-1.5 py-0.5 rounded-sm bg-primary-gold/10 text-muted-gold uppercase tracking-wider"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-1.5 text-[10px]">
        <div className="flex items-start gap-2 p-1.5 border border-primary-gold/5 bg-deepest-black/40 rounded-sm">
          <span className="text-muted-gold shrink-0">❤ Love</span>
          <span className="text-light-sand">{isReversed ? card.reversed : card.love}</span>
        </div>
        <div className="flex items-start gap-2 p-1.5 border border-primary-gold/5 bg-deepest-black/40 rounded-sm">
          <span className="text-muted-gold shrink-0">💼 Career</span>
          <span className="text-light-sand">{isReversed ? card.reversed : card.career}</span>
        </div>
        <div className="flex items-start gap-2 p-1.5 border border-primary-gold/5 bg-deepest-black/40 rounded-sm">
          <span className="text-muted-gold shrink-0">❓ Yes or No</span>
          <span className="text-light-sand">{card.yesno}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const [isClient, setIsClient] = useState(false);
  const [reversed, setReversed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Read card IDs from URL directly
  const cardIds: number[] = useMemo(() => {
    if (!isClient) return [];
    const ids: number[] = [];
    try {
      const params = new URLSearchParams(window.location.search);
      const cards = params.getAll("cards");
      cards.forEach((v) => {
        const n = Number(v);
        if (!isNaN(n)) ids.push(n);
      });
    } catch {
      // ignore
    }
    return ids;
  }, [isClient]);

  // Resolve enriched cards from IDs
  const selectedCards: EnrichedCard[] = useMemo(() => {
    return cardIds
      .map((id) => LOCAL_CARDS[id])
      .filter(Boolean)
      .map((c) => ENRICHED.get(c.name))
      .filter((c): c is EnrichedCard => c !== undefined);
  }, [cardIds]);

  const toggleReversed = useCallback((pos: number) => {
    setReversed((prev) => ({ ...prev, [pos]: !prev[pos] }));
  }, []);

  // Loading spinner until client
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-taupe text-xs">Preparing your reading...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (selectedCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0EFF5" }}>
        <div className="text-center">
          <p className="text-[#1C2D42] text-lg mb-2">No cards selected</p>
          <p className="text-[#3D5470] text-xs mb-4">Please select 3 cards first.</p>
          <Link
            href="/"
            className="text-[#2B4C7E] font-heading text-sm tracking-wider underline hover:text-brilliant-gold"
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
        <div className="w-12 h-12 mx-auto rounded-full border border-primary-gold/30 flex items-center justify-center mb-4">
          <span className="text-2xl">🔮</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading text-[#2B4C7E] tracking-[0.12em] mb-2">
          Your Reading
        </h1>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/50 to-transparent mx-auto mb-4" />
        <p className="text-[#3D5470] text-sm max-w-md mx-auto">
          Three cards have chosen you. Reflect on their meanings and how they speak to your question.
        </p>
      </div>

      {/* ── Cards + Meaning Boxes ── */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-10">
          {selectedCards.map((card, i) => {
            const isRev = reversed[i] || false;
            return (
              <motion.div
                key={card.id}
                className="flex flex-col items-center w-full md:w-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.25 }}
              >
                <span className="text-[10px] text-[#3D5470] font-heading tracking-widest mb-3 uppercase">
                  {positionLabels[i] || `Card ${i + 1}`}
                </span>

                <div
                  className="cursor-pointer mb-4"
                  onClick={() => toggleReversed(i)}
                >
                  <Card
                    card={card as any}
                    faceUp={true}
                    selected={true}
                    className="shadow-2xl"
                  />
                </div>

                <div className="p-3 border border-[#2B4C7E]/10 bg-[#E0DFE8]/40 w-full">
                  <CardMeaningPanel
                    card={card}
                    isReversed={isRev}
                    onToggle={() => toggleReversed(i)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col items-center mt-12 gap-4">
        <Link
          href="/"
          className="px-8 py-2.5 border border-[#2B4C7E]/40 text-[#2B4C7E] font-heading text-sm tracking-[0.15em] hover:bg-[#2B4C7E]/10 hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300"
        >
          New Reading
        </Link>
        <p className="text-[#3D5470] text-[10px] italic">
          Click a card to toggle between upright / reversed
        </p>
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
