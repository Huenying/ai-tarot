"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/Card";
import CARDS, { type CardDefinition } from "@/data/cards";

function ResultContent() {
  const searchParams = useSearchParams();
  const [reversed, setReversed] = useState<Record<number, boolean>>({});

  // Parse selected card indices from URL
  const selectedCards: CardDefinition[] = useMemo(() => {
    const indices = searchParams.getAll("cards").map(Number);
    return indices.map((id) => CARDS[id]).filter(Boolean);
  }, [searchParams]);

  // Toggle reversed/upright for a card position
  const toggleReversed = (pos: number) => {
    setReversed((prev) => ({ ...prev, [pos]: !prev[pos] }));
  };

  if (selectedCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-warm-stone text-lg mb-4">No cards selected</p>
          <Link
            href="/"
            className="text-primary-gold font-heading text-sm tracking-wider underline hover:text-brilliant-gold"
          >
            Return to start
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen py-12 px-4 md:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-12 mx-auto rounded-full border border-primary-gold/30 flex items-center justify-center mb-4">
            <span className="text-2xl">🔮</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary-gold tracking-[0.12em] mb-2">
            Your Reading
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/50 to-transparent mx-auto mb-4" />
          <p className="text-taupe text-sm max-w-md mx-auto">
            Three cards have chosen you. Reflect on their meanings and how they speak to your question.
          </p>
        </motion.div>
      </div>

      {/* Cards display */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mb-16">
        {selectedCards.map((card, i) => {
          const isReversed = reversed[i] || false;
          const meaning = isReversed ? card.meaning.reversed : card.meaning.upright;

          return (
            <motion.div
              key={card.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.25 }}
            >
              {/* Card position label */}
              <span className="text-xs text-muted-gold font-heading tracking-widest mb-3 uppercase">
                {["Past / Foundation", "Present / Challenge", "Future / Outcome"][i] || `Card ${i + 1}`}
              </span>

              {/* The card */}
              <div
                className="cursor-pointer"
                onClick={() => toggleReversed(i)}
              >
                <Card
                  card={card}
                  faceUp={true}
                  selected={true}
                  className="shadow-2xl"
                />
              </div>

              {/* Card name + toggle hint */}
              <div className="text-center mt-4 max-w-[200px]">
                <h3 className="text-primary-gold font-heading text-sm tracking-wider">
                  {card.name}
                </h3>
                <p className="text-dark-bronze text-[10px] mt-1 uppercase tracking-wider">
                  {card.type === "major" ? "Major Arcana" : `${card.suit} • ${card.rank}`}
                </p>
                <button
                  onClick={() => toggleReversed(i)}
                  className="mt-2 text-[10px] text-taupe hover:text-primary-gold underline transition-colors"
                >
                  {isReversed ? "🔄 Switch to Upright" : "🔄 Switch to Reversed"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Meanings */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {selectedCards.map((card, i) => {
            const isReversed = reversed[i] || false;
            const meaning = isReversed ? card.meaning.reversed : card.meaning.upright;

            return (
              <motion.div
                key={card.id}
                className="p-5 border border-primary-gold/10 bg-warm-black/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-muted-gold font-heading tracking-widest">
                      Card {i + 1}
                    </span>
                    <h3 className="text-primary-gold font-heading text-base">
                      {card.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 border ${
                      isReversed
                        ? "border-brilliant-gold/30 text-brilliant-gold/70"
                        : "border-primary-gold/30 text-primary-gold/70"
                    }`}
                  >
                    {isReversed ? "Reversed" : "Upright"}
                  </span>
                </div>

                <p className="text-warm-stone text-sm leading-relaxed mb-3">
                  {meaning}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2 border border-primary-gold/5 bg-deepest-black/50">
                    <span className="text-muted-gold block mb-1">❤ Love</span>
                    <span className="text-light-sand">{isReversed ? card.meaning.reversed : card.meaning.love}</span>
                  </div>
                  <div className="p-2 border border-primary-gold/5 bg-deepest-black/50">
                    <span className="text-muted-gold block mb-1">💼 Career</span>
                    <span className="text-light-sand">{isReversed ? card.meaning.reversed : card.meaning.career}</span>
                  </div>
                  <div className="p-2 border border-primary-gold/5 bg-deepest-black/50">
                    <span className="text-muted-gold block mb-1">❓ Yes or No</span>
                    <span className="text-light-sand">{card.meaning.yesno}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center mt-12 gap-4">
        <Link
          href="/"
          className="px-8 py-2.5 border border-primary-gold/40 text-primary-gold font-heading text-sm tracking-[0.15em] hover:bg-primary-gold/10 hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300"
        >
          New Reading
        </Link>
        <p className="text-taupe text-[10px] italic">
          Click a card above to toggle between upright / reversed
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/20 to-transparent mx-auto mb-4" />
        <p className="text-dark-bronze text-[9px] tracking-widest">
          TRUST THE JOURNEY · THE CARDS KNOW THE WAY
        </p>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
