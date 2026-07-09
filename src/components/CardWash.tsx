"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import CARDS from "@/data/cards";

interface CardWashProps {
  exiting: boolean;
  onWash: () => void;
  onConfirm: () => void;
  mode?: "mouse" | "hand";
  /** Incremented externally to trigger a gesture-based wash animation */
  washSignal?: number;
}

/** Generate random scattered positions for messy card layout */
function generatePositions() {
  return Array.from({ length: 78 }, (_, i) => ({
    id: `pos-${i}`,
    x: Math.random() * 75 + 5 + "%",   // 5% – 80%
    y: Math.random() * 70 + 5 + "%",    // 5% – 75%
    rotate: (Math.random() - 0.5) * 160, // -80° to 80°
    z: Math.floor(Math.random() * 8),
  }));
}

export default function CardWash({ exiting, onWash, onConfirm, mode, washSignal = 0 }: CardWashProps) {
  const [positions, setPositions] = useState(() => generatePositions());
  const [isWashing, setIsWashing] = useState(false);
  const [washCount, setWashCount] = useState(0);

  // External trigger for gesture-based washing animation
  useEffect(() => {
    if (washSignal === 0) return; // skip initial mount
    setIsWashing(true);
    setPositions(generatePositions());
    setWashCount((c) => c + 1);
    setTimeout(() => setIsWashing(false), 600);
  }, [washSignal]);

  const handleWash = useCallback(() => {
    setIsWashing(true);
    setPositions(generatePositions());
    setWashCount((c) => c + 1);
    onWash();
    setTimeout(() => setIsWashing(false), 600);
  }, [onWash]);

  return (
    <div className="absolute inset-0">
      {/* Instructions */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <p className="text-primary-gold font-heading text-lg md:text-xl tracking-wider">
          Shuffle the Deck
        </p>
        <p className="text-warm-stone text-xs mt-1">
          {mode === "hand"
            ? "Open or close your hand to wash — OK sign 👌 to confirm"
            : "Wash the cards until you feel ready, then confirm to proceed"}
        </p>
      </div>

      {/* Messy scattered cards — all face-down */}
      {!exiting && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {CARDS.map((card, i) => {
            const pos = positions[i];
            if (!pos) return null;

            return (
              <motion.div
                key={`${card.id}-${washCount}`}
                className="absolute"
                style={{
                  left: pos.x,
                  top: pos.y,
                  zIndex: pos.z,
                }}
                initial={{ opacity: 0, scale: 0.6, rotate: pos.rotate }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: pos.rotate,
                }}
                transition={{
                  type: "spring",
                  stiffness: isWashing ? 120 : 200,
                  damping: 12,
                  delay: isWashing ? Math.random() * 0.12 : 0,
                }}
              >
                <Card
                  card={card}
                  faceUp={false}
                  className="shadow-lg shadow-black/40"
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom buttons — hidden in hand mode (gestures only) */}
      {mode !== "hand" && (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-row items-center gap-4">
        {/* Wash button — always visible */}
        <motion.button
          className="
            px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase
            border border-primary-gold/40 text-primary-gold
            hover:bg-primary-gold/10 hover:border-primary-gold
            transition-all duration-300
          "
          onClick={handleWash}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isWashing ? "✦ Washing..." : "✦ Wash the Cards"}
        </motion.button>

        {/* Confirm and Proceed — always shown */}
        <motion.button
          className="
            px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase
            border border-brilliant-gold/50 text-brilliant-gold
            hover:bg-brilliant-gold/10 hover:border-brilliant-gold
            hover:shadow-[0_0_25px_rgba(230,198,135,0.3)]
            transition-all duration-300
          "
          onClick={onConfirm}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ✦ Confirm and Proceed ✦
        </motion.button>
      </div>
      )}
    </div>
  );
}
