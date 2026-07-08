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
      {/* Card name + orientation toggle */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[#2B4C7E] font-heading text-sm tracking-wider leading-tight">
            {card.name}
          </h3>
          {card.element && (
            <span className="text-[9px] text-[#BDBDCC] uppercase tracking-widest">
              {card.element} · {card.planet}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`text-[9px] px-2 py-0.5 border transition-colors ${
            isReversed
              ? "border-[#E6C687]/30 text-[#E6C687]/70 hover:border-[#E6C687]/60"
              : "border-[#2B4C7E]/30 text-[#2B4C7E]/70 hover:border-[#2B4C7E]/60"
          }`}
        >
          {isReversed ? "Reversed" : "Upright"}
        </button>
      </div>

      {/* Main meaning */}
      <p className="text-[#1C2D42] text-xs leading-relaxed mb-2.5 italic">
        &ldquo;{meaning}&rdquo;
      </p>

      {/* Keywords tag chips (from npm package) */}
      {card.keywords && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[8px] px-1.5 py-0.5 rounded-sm bg-[#2B4C7E]/10 text-[#3D5470] uppercase tracking-wider"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Category mini-grid */}
      <div className="grid grid-cols-1 gap-1.5 text-[10px]">
        <div className="flex items-start gap-2 p-1.5 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm">
          <span className="text-[#3D5470] shrink-0">❤ Love</span>
          <span className="text-[#1C2D42]">{card.love}</span>
        </div>
        <div className="flex items-start gap-2 p-1.5 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm">
          <span className="text-[#3D5470] shrink-0">💼 Career</span>
          <span className="text-[#1C2D42]">{card.career}</span>
        </div>
        <div className="flex items-start gap-2 p-1.5 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm">
          <span className="text-[#3D5470] shrink-0">❓ Yes or No</span>
          <span className="text-[#1C2D42]">{card.yesno}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────

export default function ResultPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Read card IDs and reversed flags from URL after hydration
  const { cardIds, revDefaults } = useMemo(() => {
    const ids: number[] = [];
    const revs: boolean[] = [];
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const cardParams = params.getAll("cards");
        const revParams = params.getAll("rev");
        cardParams.forEach((v) => {
          const n = Number(v);
          if (!isNaN(n)) ids.push(n);
        });
        revParams.forEach((v) => {
          revs.push(v === "1");
        });
      } catch {
        // ignore
      }
    }
    return { cardIds: ids, revDefaults: revs };
  }, [isClient]);

  // Initialize reversed state from URL — one flag per selected card
  const [reversed, setReversed] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    revDefaults.forEach((r, i) => {
      init[i] = r;
    });
    return init;
  });

  // Resolve enriched cards from IDs — safe lookup by .id property
  const selectedCards: EnrichedCard[] = useMemo(() => {
    return cardIds
      .map((id) => LOCAL_CARDS.find((c) => c.id === id))
      .filter(Boolean)
      .map((c) => ENRICHED.get(c!.name))
      .filter((c): c is EnrichedCard => c !== undefined);
  }, [cardIds]);

  const toggleReversed = useCallback((pos: number) => {
    setReversed((prev) => ({ ...prev, [pos]: !prev[pos] }));
  }, []);

  // ── Loading state until client hydration ──
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
            {cardIds.length > 0 ? "Unable to load card data" : "No cards selected"}
          </p>
          <p className="text-[#3D5470] text-xs mb-4">Please select 3 cards first.</p>
          <Link
            href="/"
            className="text-[#2B4C7E] font-heading text-sm tracking-wider underline hover:text-[#E6C687]"
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
                {/* Position label */}
                <span className="text-[10px] text-[#3D5470] font-heading tracking-widest mb-3 uppercase">
                  {positionLabels[i] || `Card ${i + 1}`}
                </span>

                {/* Card (face-up) — rotated if reversed */}
                <div
                  className="cursor-pointer mb-4"
                  onClick={() => toggleReversed(i)}
                >
                  <Card
                    card={card as any}
                    faceUp={true}
                    selected={true}
                    rotation={isRev ? 180 : 0}
                    className="shadow-2xl"
                  />
                </div>

                {/* Meaning box under card */}
                <div className="p-3 border border-[#2B4C7E]/10 bg-[#E0DFE8]/50 w-full rounded-sm">
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
