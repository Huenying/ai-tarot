"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import LOCAL_CARDS from "@/data/cards";
import { majorArcana } from "tarot-card-meanings";

// ─────────────────────────────────────────────────────────────────
//  Merged card lookup — npm package for Major Arcana (richer),
//  local data for Minor Arcana
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
}: {
  card: EnrichedCard;
  isReversed: boolean;
}) {
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <div className="w-full max-w-[280px] md:max-w-[360px]">
      {/* Card name + static orientation indicator */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#2B4C7E] font-heading text-base md:text-lg tracking-wider leading-tight">
          {card.name}
        </h3>
        <span
          className={`text-[11px] px-3 py-1 border ${
            isReversed
              ? "border-[#A57C2A]/40 text-[#A57C2A] font-semibold"
              : "border-[#2B4C7E]/30 text-[#2B4C7E] font-semibold"
          }`}
        >
          {isReversed ? "Reversed" : "Upright"}
        </span>
      </div>

      {/* Keywords tag chips */}
      {card.keywords && (
        <div className="flex flex-wrap gap-2 mb-3">
          {card.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[10px] px-2 py-1 rounded-sm bg-[#2B4C7E]/10 text-[#3D5470] uppercase tracking-wider"
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Category rows */}
      <div className="grid grid-cols-1 gap-2 text-xs md:text-sm">
        {/* Combined Love / Career row */}
        <div className="flex items-start gap-2 p-2 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm">
          <span className="text-[#3D5470] shrink-0 whitespace-nowrap">❤ Love / 💼 Career</span>
          <span className="text-[#1C2D42]">{meaning}</span>
        </div>
        <div className="flex items-start gap-2 p-2 border border-[#2B4C7E]/5 bg-[#F0EFF5]/60 rounded-sm">
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

  // Read card IDs and their fixed reversed status from URL
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

  // Resolve enriched cards from IDs
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
          Three cards have chosen you. Reflect on their meanings and how they speak to your question.
        </p>
      </div>

      {/* ── Cards + Meaning Boxes ── */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-10">
          {selectedCards.map(({ card, isReversed }, i) => (
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

              {/* Card (face-up, no click/toggle, large clean display) */}
              <div className="mb-5">
                <Card
                  card={card as any}
                  faceUp={true}
                  size="lg"
                  showName={false}
                  hideOverlay={true}
                  rotation={isReversed ? 180 : 0}
                  className="shadow-2xl"
                />
              </div>

              {/* Meaning box under card */}
              <div className="p-3 border border-[#2B4C7E]/10 bg-[#E0DFE8]/50 w-full rounded-sm">
                <CardMeaningPanel
                  card={card}
                  isReversed={isReversed}
                />
              </div>
            </motion.div>
          ))}
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
