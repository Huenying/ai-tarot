"use client";

import { useMemo, useState, useCallback, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import CARDS from "@/data/cards";

interface CardCarouselProps {
  /** Shuffled deck order — position → actual card index (0-77) */
  cardOrder: number[];
  selectedIndices: number[];
  onSelect: (index: number) => void;
  /** Per-card reversed state (keyed by card index) — for overlay display */
  reversedMap?: Record<number, boolean>;
  /** Interaction mode */
  mode?: "mouse" | "hand";
  /** Ref filled with imperative API for hand-mode navigation */
  carouselApi?: React.MutableRefObject<{
    goLeft: () => void;
    goRight: () => void;
    selectCurrent: () => void;
  } | null>;
  /** Hold progress 0-1 for palm-hold select ring animation */
  holdProgress?: number;
}

// Dynamically import Three.js scene (browser-only)
const ThreeScene = dynamic(() => import("./ThreeScene"), { ssr: false });

/**
 * 3D cylindrical carousel powered by Three.js.
 *
 * Cards float in a cylinder arrangement — all face-down showing
 * the card-cover.jpeg back. User navigates with ◀ ▶ buttons and the
 * cylinder spins smoothly. Front card is highlighted with a gold glow.
 *
 * In hand mode, left/right swipe gestures and palm-hold-to-select
 * are handled externally via carouselApi ref.
 */
function CardCarouselInner({
  cardOrder,
  selectedIndices,
  onSelect,
  reversedMap = {},
  mode = "mouse",
  carouselApi,
  holdProgress = 0,
}: CardCarouselProps) {
  const [currentPos, setCurrentPos] = useState(0); // position in the cylinder
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const NUM = cardOrder.length;

  // The actual card index at the current cylinder position
  const currentCardIndex = cardOrder[currentPos];

  // Is the card at a given position already selected?
  const isSelectedPos = useCallback(
    (pos: number) => selectedIndices.includes(cardOrder[pos]),
    [cardOrder, selectedIndices]
  );

  // All positions whose card hasn't been selected yet
  const availablePositions = useMemo(
    () => Array.from({ length: NUM }, (_, i) => i).filter((p) => !isSelectedPos(p)),
    [NUM, isSelectedPos]
  );

  // If current position's card was just selected, move to next available
  useEffect(() => {
    if (isSelectedPos(currentPos) && availablePositions.length > 0) {
      const nextRight = availablePositions.filter((p) => p > currentPos);
      if (nextRight.length > 0) {
        setCurrentPos(Math.min(...nextRight));
      } else {
        setCurrentPos(Math.min(...availablePositions));
      }
    }
  }, [isSelectedPos, currentPos, availablePositions]);

  const goLeft = useCallback(() => {
    const candidates = availablePositions.filter((p) => p < currentPos);
    if (candidates.length > 0) {
      // Jump ~6 positions on each wave fire for a larger scroll
      const targetIndex = Math.min(5, candidates.length - 1);
      setCurrentPos(candidates.sort((a, b) => b - a)[targetIndex]);
    } else if (availablePositions.length > 0) {
      setCurrentPos(Math.max(...availablePositions));
    }
  }, [currentPos, availablePositions]);

  const goRight = useCallback(() => {
    const candidates = availablePositions.filter((p) => p > currentPos);
    if (candidates.length > 0) {
      // Jump ~6 positions on each wave fire for a larger scroll
      const targetIndex = Math.min(5, candidates.length - 1);
      setCurrentPos(candidates.sort((a, b) => a - b)[targetIndex]);
    } else if (availablePositions.length > 0) {
      setCurrentPos(Math.min(...availablePositions));
    }
  }, [currentPos, availablePositions]);

  const selectCurrent = useCallback(() => {
    if (!isSelectedPos(currentPos)) {
      onSelect(currentCardIndex);
    }
  }, [currentPos, isSelectedPos, onSelect, currentCardIndex]);

  const handleSelect = useCallback(() => {
    selectCurrent();
  }, [selectCurrent]);

  const currentSelected = isSelectedPos(currentPos);
  const canNav = availablePositions.length > 0;
  const showOverlay = selectedIndices.length >= 3;

  // Directly set carouselApi ref for hand-mode control
  useEffect(() => {
    if (carouselApi) {
      carouselApi.current = { goLeft, goRight, selectCurrent };
    }
    return () => {
      if (carouselApi) carouselApi.current = null;
    };
  }, [carouselApi, goLeft, goRight, selectCurrent]);

  // In hand mode, holdProgress > 0 means palm is shown — hook handles the 1s timeout.
  // Lateral palm motion (slap) is handled by the hook's swipe detection → carouselApi → goLeft/goRight.
  // No auto-rotation.

  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(43,76,126,0.08) 0%, transparent 60%)",
      }}
    >
      {/* ===== Selection counter ===== */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999] text-center pointer-events-none">
        <p className="text-primary-gold font-heading text-sm md:text-base tracking-wider">
          {mode === "hand" ? "Select your cards with gestures" : "Select your cards"}
        </p>
        {/* Hand mode instruction (auto-rotation removed — slap/swipe to navigate) */}
        {mode === "hand" && !showOverlay && (
          <p className="text-[#3D5470] text-[9px] mt-1 tracking-wider">
            {holdProgress > 0
              ? "👌 Hold OK sign to select..."
              : "🖐️ Wave palm to move cylinder · 👌 OK sign 1s to select"}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                selectedIndices.length > i
                  ? "bg-primary-gold border-primary-gold shadow-[0_0_10px_rgba(43,76,126,0.6)]"
                  : "border-dark-bronze bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ===== Three.js scene (mounted only after hydration) ===== */}
      {mounted && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <ThreeScene currentIndex={currentPos} totalCards={NUM} holdProgress={holdProgress} />
          </Suspense>
        </div>
      )}

      {/* Loading placeholder */}
      {!mounted && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="text-center">
            <div className="w-10 h-10 border border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-taupe text-xs">Preparing the sacred circle...</p>
          </div>
        </div>
      )}

      {/* ===== Navigation buttons ===== */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-6">
        <motion.button
          className={`w-12 h-12 flex items-center justify-center border rounded-full transition-all duration-200 ${
            canNav
              ? "border-primary-gold/40 text-primary-gold hover:bg-primary-gold/10 cursor-pointer"
              : "border-dark-bronze/30 text-dark-bronze cursor-not-allowed"
          }`}
          onClick={goLeft}
          disabled={!canNav}
          whileTap={canNav ? { scale: 0.9 } : {}}
        >
          ◀
        </motion.button>

        <motion.button
          className={`
            px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase
            border transition-all duration-300
            ${
              currentSelected
                ? "border-brilliant-gold/40 text-brilliant-gold/50 cursor-default"
                : "border-primary-gold/50 text-primary-gold hover:bg-primary-gold/10 hover:shadow-[0_0_25px_rgba(43,76,126,0.15)] cursor-pointer"
            }
          `}
          onClick={handleSelect}
          disabled={currentSelected}
          whileTap={currentSelected ? {} : { scale: 0.97 }}
        >
          {currentSelected
            ? "✓ Selected"
            : `Select (${3 - selectedIndices.length} left)`}
        </motion.button>

        <motion.button
          className={`w-12 h-12 flex items-center justify-center border rounded-full transition-all duration-200 ${
            canNav
              ? "border-primary-gold/40 text-primary-gold hover:bg-primary-gold/10 cursor-pointer"
              : "border-dark-bronze/30 text-dark-bronze cursor-not-allowed"
          }`}
          onClick={goRight}
          disabled={!canNav}
          whileTap={canNav ? { scale: 0.9 } : {}}
        >
          ▶
        </motion.button>
      </div>

      {/* ===== Selection complete overlay ===== */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="absolute inset-0 z-[99999] flex items-center justify-center bg-[#1C2D42]/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="text-5xl mb-4">✨</div>
                <p className="text-brilliant-gold font-heading text-2xl tracking-wider mb-2">
                  Cards Selected
                </p>
                <p className="text-brilliant-gold/70 text-sm mb-6">
                  Your 3 cards have been chosen
                </p>
                <div className="flex justify-center gap-4 mb-6">
                  {selectedIndices.map((idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card card={CARDS[idx]} faceUp={true} rotation={reversedMap[idx] ? 180 : 0} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CardCarouselInner;
