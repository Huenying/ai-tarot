"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CardDefinition } from "@/data/cards";
import { getCardImageSrc } from "@/lib/card-images";

interface CardProps {
  card: CardDefinition;
  faceUp?: boolean;
  highlighted?: boolean;
  selected?: boolean;
  grabbed?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  /** Rotation angle in degrees (for scattered cards) */
  rotation?: number;
  /** Carousel-specific: is this card in the center/front zone? */
  isFocused?: boolean;
}

export default function Card({
  card,
  faceUp = false,
  highlighted = false,
  selected = false,
  grabbed = false,
  style,
  className = "",
  onClick,
  rotation = 0,
  isFocused = false,
}: CardProps) {
  return (
    <motion.div
      className={`
        relative w-[80px] h-[120px] md:w-[90px] md:h-[140px] cursor-pointer select-none
        ${highlighted ? "z-50" : "z-10"}
        ${selected ? "z-50" : ""}
        ${className}
      `}
      style={style}
      onClick={onClick}
      animate={{
        scale: highlighted ? 1.15 : grabbed ? 0.95 : selected ? 1.1 : 1,
        rotateZ: rotation,
        filter: highlighted
          ? "brightness(1.2) drop-shadow(0 0 15px rgba(43,76,126,0.5))"
          : grabbed
          ? "brightness(1.1) drop-shadow(0 0 20px rgba(43,76,126,0.3))"
          : selected
          ? "brightness(1.15) drop-shadow(0 0 12px rgba(43,76,126,0.4))"
          : "brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        animate={{
          rotateY: faceUp ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-lg backface-hidden overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #E0DFE8 0%, #CECDDA 50%, #E0DFE8 100%)",
            border: "1px solid rgba(165, 124, 42, 0.4)",
          }}
        >
          <Image
            src="/images/card-cover.jpeg"
            alt="Card Back"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2D42]/60 to-transparent" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] text-primary-gold/50 font-heading whitespace-nowrap">
            TAROT
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-lg backface-hidden overflow-hidden"
          style={{
            transform: "rotateY(180deg)",
            background: "linear-gradient(160deg, #E8E7EE 0%, #D5D4DD 50%, #F0EFF5 100%)",
            border: "1px solid rgba(165, 124, 42, 0.5)",
          }}
        >
          {/* Card face image (unique per card) */}
          <Image
            src={getCardImageSrc(card.id) || "/images/card-cover.jpeg"}
            alt={card.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 90px"
            loading="lazy"
          />

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2D42]/70 via-[#1C2D42]/20 to-[#1C2D42]/30" />

          {/* Ornamental border */}
          <div className="absolute inset-[3px] rounded-[6px] border border-white/20" />

          {/* Suit symbol (for minor arcana) */}
          {card.suit && (
            <div className="absolute top-2 left-2 text-[10px] leading-none z-10">
              {card.suit === "wands" && <span className="text-white/80">⚑</span>}
              {card.suit === "cups" && <span className="text-white/80">♡</span>}
              {card.suit === "swords" && <span className="text-white/80">⚔</span>}
              {card.suit === "pentacles" && <span className="text-white/80">⭔</span>}
            </div>
          )}

          {/* Arcana indicator */}
          {card.type === "major" && (
            <div className="absolute top-2 right-2 text-[8px] text-white/60 font-heading leading-none z-10">
              M
            </div>
          )}

          {/* Card Name */}
          <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
            <span className="text-white text-[9px] md:text-[10px] font-heading text-center leading-tight font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {card.name}
            </span>
          </div>

          {/* Bottom suit */}
          {card.suit && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] leading-none z-10">
              {card.suit === "wands" && <span className="text-white/80">⚑</span>}
              {card.suit === "cups" && <span className="text-white/80">♡</span>}
              {card.suit === "swords" && <span className="text-white/80">⚔</span>}
              {card.suit === "pentacles" && <span className="text-white/80">⭔</span>}
            </div>
          )}
        </div>
      </motion.div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-gold flex items-center justify-center z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <span className="text-white text-[10px] font-bold">✓</span>
        </motion.div>
      )}

      {/* Highlight glow */}
      {highlighted && (
        <div
          className="absolute inset-[-4px] rounded-xl z-[-1]"
          style={{
            boxShadow: "0 0 25px 5px rgba(165, 124, 42, 0.5), 0 0 60px 15px rgba(165, 124, 42, 0.15)",
          }}
        />
      )}
    </motion.div>
  );
}
