"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.04]"
          style={{
            background: "radial-gradient(ellipse at center, #2B4C7E 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Ornamental top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/40 to-transparent" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Mystical symbol */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border border-primary-gold/30 flex items-center justify-center">
            <span className="text-3xl md:text-4xl">🔮</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary-gold mb-4 tracking-[0.15em]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          AI Tarot
        </motion.h1>

        {/* Divider */}
        <motion.div
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/60 to-transparent mx-auto mb-6"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 96, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        {/* Instruction */}
        <motion.p
          className="text-warm-stone text-base md:text-lg leading-relaxed mb-8 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          &ldquo;Please silently recite the question in your heart&rdquo;
        </motion.p>
        <motion.p
          className="text-taupe text-xs md:text-sm mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Silently hold your question within
        </motion.p>

        {/* Start Button */}
        <motion.button
          className="
            relative px-10 py-3 font-heading text-sm md:text-base tracking-[0.2em] uppercase
            border border-primary-gold/50 text-primary-gold
            transition-all duration-300
            hover:bg-primary-gold/10 hover:border-primary-gold hover:shadow-[0_0_30px_rgba(43,76,126,0.15)]
          "
          onClick={() => router.push("/reading")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Reading
          <span className="absolute inset-0 overflow-hidden rounded-none pointer-events-none">
            <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary-gold/10 to-transparent" />
          </span>
        </motion.button>
      </div>

      {/* Bottom ornament */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/20 to-transparent" />

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 text-taupe text-[10px] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Select your cards to divine your path
      </motion.p>
    </main>
  );
}
