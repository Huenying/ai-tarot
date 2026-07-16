"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { requestCameraPermission } from "@/lib/camera-store";
import { classifyQuestion, getDefaultSpread, CATEGORIES, OTHER_CATEGORY } from "@/lib/spreads";
import type { CategoryConfig, SpreadConfig } from "@/lib/spreads";

export default function LandingPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<CategoryConfig | null>(null);
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig | null>(null);
  const [step, setStep] = useState<"question" | "result" | "mode">("question");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleAnalyze = useCallback(() => {
    const q = question.trim();
    if (!q) return;

    const cat = classifyQuestion(q);
    setCategory(cat);
    setSelectedSpread(getDefaultSpread(cat));
    setStep("result");
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleSelectSpread = (spread: SpreadConfig) => {
    setSelectedSpread(spread);
  };

  const buildUrl = (mode: string) => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (question.trim()) params.set("q", question.trim());
    if (category) params.set("category", category.id);
    if (selectedSpread) params.set("spread", selectedSpread.id);
    return `/reading?${params.toString()}`;
  };

  const handleMouseMode = () => {
    router.push(buildUrl("mouse"));
  };

  const handleMotionMode = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      await requestCameraPermission();
      router.push(buildUrl("hand"));
    } catch (err: any) {
      const msg =
        err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera in your browser settings and try again."
          : "Could not access camera. Please check your camera and try again.";
      setCameraError(msg);
      setCameraLoading(false);
    }
  };

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

      <div className="relative z-10 text-center max-w-lg w-full">
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
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/60 to-transparent mx-auto mb-8"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 96, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        {/* ── Step 1: Question Input ── */}
        <AnimatePresence mode="wait">
          {step === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-warm-stone text-base md:text-lg leading-relaxed mb-6 italic">
                What question is on your mind?
              </p>

              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question here... e.g. Will I get the promotion this year?"
                  rows={3}
                  className="w-full px-4 py-3 text-sm border border-primary-gold/30 bg-white/80 text-warm-stone placeholder-[#BDBDCC] outline-none focus:border-primary-gold/60 transition-colors resize-none"
                />
              </div>
              <p className="text-taupe text-[10px] mt-2 text-left">
                Be as specific as you like. Press Enter to analyze.
              </p>

              <motion.button
                className="mt-6 px-10 py-3 font-heading text-sm tracking-[0.2em] uppercase border border-primary-gold/50 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300"
                onClick={handleAnalyze}
                disabled={!question.trim()}
                whileHover={{ scale: question.trim() ? 1.02 : 1 }}
                whileTap={{ scale: question.trim() ? 0.98 : 1 }}
              >
                ✦ Analyze My Question ✦
              </motion.button>
            </motion.div>
          )}

          {/* ── Step 2: Classification Result + Spread Selection ── */}
          {step === "result" && category && selectedSpread && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Question summary */}
              <div className="mb-4 px-4 py-3 border border-primary-gold/10 bg-primary-gold/5">
                <p className="text-taupe text-[10px] uppercase tracking-widest mb-1">Your question</p>
                <p className="text-warm-stone text-sm italic">&ldquo;{question}&rdquo;</p>
              </div>

              {/* Category badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-xl">{category.icon}</span>
                <span className="text-primary-gold font-heading text-sm tracking-wider">
                  {category.nameZh} · {category.name}
                </span>
              </div>

              {/* Recommended spread */}
              <p className="text-taupe text-[10px] uppercase tracking-widest mb-3">
                Recommended Spread
              </p>

              {/* Spread options */}
              <div className="space-y-3 mb-6">
                {category.spreads.map((spread) => (
                  <button
                    key={spread.id}
                    onClick={() => handleSelectSpread(spread)}
                    className={`w-full text-left p-4 border transition-all duration-200 ${
                      selectedSpread.id === spread.id
                        ? "border-primary-gold bg-primary-gold/10"
                        : "border-primary-gold/20 hover:border-primary-gold/40 hover:bg-primary-gold/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-primary-gold font-heading text-sm tracking-wider">
                        {spread.name}
                      </span>
                      <span className="text-taupe text-[10px] font-heading tracking-wider">
                        {spread.cards} cards
                      </span>
                    </div>
                    <p className="text-taupe text-xs leading-relaxed">{spread.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {spread.positions.map((pos, i) => (
                        <span
                          key={i}
                          className="text-[8px] px-1.5 py-0.5 bg-primary-gold/10 text-taupe"
                        >
                          {i + 1}. {pos.label}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Back & Continue */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setStep("question")}
                  className="px-6 py-2.5 text-taupe font-heading text-xs tracking-wider underline hover:text-primary-gold transition-colors"
                >
                  ← Edit Question
                </button>
                <motion.button
                  className="px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase border border-primary-gold/50 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold transition-all duration-300"
                  onClick={() => setStep("mode")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue ✦
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Mode Selection ── */}
          {step === "mode" && category && selectedSpread && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-warm-stone text-sm leading-relaxed mb-6">
                Choose how to interact with the cards
              </p>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl mx-auto">
                {/* Mouse Mode */}
                <motion.button
                  className="flex-1 px-6 py-5 font-heading border border-primary-gold/40 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300 text-left"
                  onClick={handleMouseMode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="text-xl mb-2">🖱</div>
                  <div className="text-sm md:text-base tracking-[0.15em] uppercase mb-1">Mouse Mode</div>
                  <div className="text-[10px] md:text-xs text-taupe leading-relaxed font-normal lowercase">
                    Use your mouse to wash, navigate and select cards
                  </div>
                </motion.button>

                {/* Motion Mode */}
                <motion.button
                  className={`flex-1 px-6 py-5 font-heading text-left border transition-all duration-300 ${
                    cameraLoading
                      ? "border-brilliant-gold/30 text-brilliant-gold/50 cursor-wait"
                      : "border-brilliant-gold/50 text-brilliant-gold hover:bg-brilliant-gold/10 hover:border-brilliant-gold hover:shadow-[0_0_25px_rgba(165,124,42,0.2)]"
                  }`}
                  onClick={handleMotionMode}
                  disabled={cameraLoading}
                  whileHover={cameraLoading ? {} : { scale: 1.02 }}
                  whileTap={cameraLoading ? {} : { scale: 0.97 }}
                >
                  <div className="text-xl mb-2">✋</div>
                  <div className="text-sm md:text-base tracking-[0.15em] uppercase mb-1">
                    {cameraLoading ? "Requesting Camera..." : "Motion Mode"}
                  </div>
                  <div className="text-[10px] md:text-xs text-taupe leading-relaxed font-normal lowercase">
                    {cameraLoading ? "Please allow camera access when prompted..." : "Use hand gestures via camera to wash, navigate and select"}
                  </div>
                </motion.button>
              </div>

              {/* Camera permission error */}
              {cameraError && (
                <motion.div
                  className="mt-4 px-4 py-3 border border-[#A57C2A]/40 bg-[#A57C2A]/5 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[#A57C2A] text-[11px] leading-relaxed">⚠ {cameraError}</p>
                  <button
                    className="mt-2 text-[10px] text-primary-gold underline hover:text-[#A57C2A] tracking-wider"
                    onClick={() => { setCameraError(null); handleMotionMode(); }}
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {/* Back */}
              <button
                onClick={() => setStep("result")}
                className="mt-4 text-[10px] text-taupe underline hover:text-primary-gold font-heading tracking-wider transition-colors"
              >
                ← Back to spread selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
        Ask your question, let the cards guide you
      </motion.p>
    </main>
  );
}
