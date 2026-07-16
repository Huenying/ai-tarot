"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CardWash from "@/components/CardWash";
import CardCarousel from "@/components/CardCarousel";
import CameraOverlay from "@/components/CameraOverlay";
import { useHandTracking } from "@/hooks/useHandTracking";
import { SPREADS } from "@/lib/spreads";
import type { SpreadConfig } from "@/lib/spreads";

type ReadingPhase = "washing" | "carousel" | "complete";
type InteractionMode = "mouse" | "hand";

/** Number of cards to select based on spread ID */
const SPREAD_CARD_COUNT: Record<string, number> = {
  "past-present-future": 3,
  "career-prospect": 6,
  "venus-love": 8,
  "lovers-cross": 5,
  "tree-of-life": 10,
  "four-elements": 4,
  "yes-no": 3,
  "a-or-b": 5,
};
const DEFAULT_CARD_COUNT = 3;

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

  // Interaction mode from URL
  const [mode, setMode] = useState<InteractionMode | null>(null);
  const [category, setCategory] = useState<string>("");
  const [spreadId, setSpreadId] = useState<string>("");
  const [question, setQuestion] = useState<string>("");

  // Read mode from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const m = params.get("mode");
      if (m === "hand") setMode("hand");
      else setMode("mouse");
      setCategory(params.get("category") || "");
      setSpreadId(params.get("spread") || "");
      setQuestion(params.get("q") || "");
    } catch {
      setMode("mouse");
    }
  }, []);

  // Incremented each time a gesture-triggered wash fires (triggers CardWash visual animation)
  const [washSignal, setWashSignal] = useState(0);

  // Ref-based carousel controls for hand mode
  const carouselApi = useRef<{
    goLeft: () => void;
    goRight: () => void;
    selectCurrent: () => void;
  } | null>(null);

  // Hand tracking (only active when mode === "hand")
  const handTrackingEnabled = mode === "hand";
  const handTracking = useHandTracking({
    callbacks: {
      onWash: () => {
        handleWash();
        setWashSignal((s) => s + 1); // trigger CardWash visual animation
      },
      onConfirm: () => handleConfirm(),
      onNavigateLeft: () => carouselApi.current?.goLeft(),
      onNavigateRight: () => carouselApi.current?.goRight(),
      onSelect: () => carouselApi.current?.selectCurrent(),
    },
    phase: handTrackingEnabled ? phase : "idle",
    enabled: handTrackingEnabled,
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

  const cardCount = SPREAD_CARD_COUNT[spreadId] || DEFAULT_CARD_COUNT;

  const handleSelect = (cardIndex: number) => {
    if (selectedIndices.length < cardCount && !selectedIndices.includes(cardIndex)) {
      setSelectedIndices((prev) => [...prev, cardIndex]);
    }
  };

  // Navigate to results when enough cards selected
  useEffect(() => {
    if (selectedIndices.length >= cardCount && phase === "carousel") {
      setPhase("complete");
    }
  }, [selectedIndices.length, cardCount, phase, setPhase]);

  // Separate effect: navigate after a delay — no cleanup conflict with phase changes
  useEffect(() => {
    if (phase === "complete") {
      const timer = setTimeout(() => {
        const params = new URLSearchParams();
        selectedIndices.forEach((idx) => {
          params.append("cards", String(idx));
          params.append("rev", reversedMap[idx] ? "1" : "0");
        });
        if (spreadId) params.set("spread", spreadId);
        if (category) params.set("category", category);
        if (question) params.set("q", question);
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

      {/* Phase 1: Washing — only render once mode is resolved */}
      {mode && phase === "washing" && (
        <CardWash
          exiting={exitingWash}
          onWash={handleWash}
          onConfirm={handleConfirm}
          mode={mode}
          washSignal={washSignal}
        />
      )}

      {/* Phase 2: Carousel — only render once mode is resolved */}
      {mode && phase === "carousel" && (
        <CardCarousel
          cardOrder={shuffledOrder}
          selectedIndices={selectedIndices}
          onSelect={handleSelect}
          reversedMap={reversedMap}
          mode={mode}
          carouselApi={carouselApi}
          holdProgress={handTracking.holdProgress}
          cardCount={cardCount}
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

      {/* Hand mode camera overlay */}
      {mode === "hand" && (
        <CameraOverlay
          video={handTracking.videoRef.current}
          canvasRef={handTracking.canvasRef}
          isTracking={handTracking.isTracking}
          cameraReady={handTracking.cameraReady}
          gesture={handTracking.gesture}
          error={handTracking.error}
          phase={phase}
          holdProgress={handTracking.holdProgress}
          squeezeProgress={handTracking.squeezeProgress}
        />
      )}
    </main>
  );
}
