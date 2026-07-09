"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CardWash from "@/components/CardWash";
import CardCarousel from "@/components/CardCarousel";

type ReadingPhase = "washing" | "carousel" | "complete";

/** Fisher-Yates shuffle (in-place, returns the array) */
function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ReadingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<ReadingPhase>("washing");
  const [exitingWash, setExitingWash] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Shuffled deck order — re-shuffles on each wash
  const [shuffledOrder, setShuffledOrder] = useState<number[]>(() =>
    shuffle(Array.from({ length: 78 }, (_, i) => i))
  );

  // Random reversed orientation per card — regenerated on each wash
  const [reversedMap, setReversedMap] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    for (let i = 0; i < 78; i++) map[i] = Math.random() < 0.5;
    return map;
  });

  const handleWash = useCallback(() => {
    setShuffledOrder((prev) => shuffle([...prev]));
    setReversedMap(() => {
      const map: Record<number, boolean> = {};
      for (let i = 0; i < 78; i++) map[i] = Math.random() < 0.5;
      return map;
    });
  }, []);

  const handleConfirm = () => {
    setExitingWash(true);
    const timer = setTimeout(() => {
      setPhase("carousel");
      setExitingWash(false);
    }, 1200);
  };

  const handleSelect = (cardIndex: number) => {
    if (selectedIndices.length < 3 && !selectedIndices.includes(cardIndex)) {
      setSelectedIndices((prev) => [...prev, cardIndex]);
    }
  };

  // Navigate to results when 3 selected
  useEffect(() => {
    if (selectedIndices.length >= 3 && phase === "carousel") {
      setPhase("complete");
    }
  }, [selectedIndices.length, phase, setPhase]);

  // Separate effect: navigate after a delay — no cleanup conflict with phase changes
  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(() => {
        const params = new URLSearchParams();
        selectedIndices.forEach((idx) => {
          params.append("cards", String(idx));
          params.append("rev", reversedMap[idx] ? "1" : "0");
        });
        router.push(`/result?${params.toString()}`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, router, selectedIndices, reversedMap]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-deepest-black">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(43,76,126,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Phase 1: Washing */}
      {phase === "washing" && (
        <CardWash
          exiting={exitingWash}
          onWash={handleWash}
          onConfirm={handleConfirm}
        />
      )}

      {/* Phase 2: Carousel — uses shuffled deck order from washing */}
      {phase === "carousel" && (
        <CardCarousel
          cardOrder={shuffledOrder}
          selectedIndices={selectedIndices}
          onSelect={handleSelect}
          reversedMap={reversedMap}
        />
      )}

      {/* Washing → Carousel transition overlay */}
      <AnimatePresence>
        {exitingWash && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: "#F0EFF5" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ✦
              </motion.div>
              <p className="text-primary-gold font-heading text-lg tracking-widest">
                Cards Arranging...
              </p>
              <p className="text-taupe text-xs mt-2">
                The cards are forming the sacred circle
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
