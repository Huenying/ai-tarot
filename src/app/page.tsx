"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { requestCameraPermission } from "@/lib/camera-store";
import { THEMED_GROUP, SPECIFIC_GROUP } from "@/lib/spreads";
import type { TabGroup, TabItem, SpreadConfig } from "@/lib/spreads";

type FlowStep = "choose-group" | "choose-tab" | "enter-question" | "intro-spread" | "choose-mode";

export default function LandingPage() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("choose-group");
  const [selectedGroup, setSelectedGroup] = useState<TabGroup | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabItem | null>(null);
  const [question, setQuestion] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const spread = selectedTab?.spread ?? null;

  const handleSelectGroup = (group: TabGroup) => {
    setSelectedGroup(group);
    setStep("choose-tab");
  };

  const handleSelectTab = (tab: TabItem) => {
    setSelectedTab(tab);
    setStep("enter-question");
  };

  const handleQuestionNext = () => {
    if (!question.trim()) return;
    setStep("intro-spread");
  };

  const buildUrl = (mode: string) => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (question.trim()) params.set("q", question.trim());
    if (selectedTab) params.set("tab", selectedTab.id);
    if (spread) params.set("spread", spread.id);
    return `/reading?${params.toString()}`;
  };

  const handleMouseMode = () => router.push(buildUrl("mouse"));

  const handleMotionMode = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      await requestCameraPermission();
      router.push(buildUrl("hand"));
    } catch (err: any) {
      setCameraError(err.name === "NotAllowedError"
        ? "Camera access denied. Please allow camera in your browser settings and try again."
        : "Could not access camera. Please check your camera and try again.");
      setCameraLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse at center, #2B4C7E 0%, transparent 70%)" }} />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/40 to-transparent" />

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Logo */}
        <motion.div className="mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}>
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border border-primary-gold/30 flex items-center justify-center">
            <span className="text-3xl md:text-4xl">🔮</span>
          </div>
        </motion.div>

        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary-gold mb-4 tracking-[0.15em]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}>
          AI Tarot
        </motion.h1>

        <motion.div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/60 to-transparent mx-auto mb-8"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 96, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }} />

        <AnimatePresence mode="wait">

          {/* ── Step 1: Choose Group ── */}
          {step === "choose-group" && (
            <motion.div key="group" className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <p className="text-warm-stone text-base md:text-lg mb-6">Choose a reading type</p>
              {[THEMED_GROUP, SPECIFIC_GROUP].map((group) => (
                <button key={group.id}
                  onClick={() => handleSelectGroup(group)}
                  className="w-full text-left p-5 border border-primary-gold/30 hover:border-primary-gold hover:bg-primary-gold/5 transition-all duration-300">
                  <div className="text-lg mb-1">{group.id === "themed" ? "📂" : "🎯"}</div>
                  <p className="text-primary-gold font-heading text-sm tracking-[0.15em] uppercase mb-1">
                    {group.labelZh}
                  </p>
                  <p className="text-taupe text-xs">{group.description}</p>
                </button>
              ))}
            </motion.div>
          )}

          {/* ── Step 2: Choose Tab ── */}
          {step === "choose-tab" && selectedGroup && (
            <motion.div key="tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <p className="text-warm-stone text-sm mb-5">{selectedGroup.labelZh}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedGroup.tabs.map((tab) => (
                  <button key={tab.id}
                    onClick={() => handleSelectTab(tab)}
                    className="px-4 py-2.5 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold transition-all duration-200">
                    <span className="text-sm mr-1.5">{tab.emoji}</span>
                    <span className="font-heading text-xs tracking-wider">{tab.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep("choose-group")}
                className="text-[10px] text-taupe underline hover:text-primary-gold font-heading tracking-wider transition-colors">
                ← Back
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Enter Question ── */}
          {step === "enter-question" && selectedTab && (
            <motion.div key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">{selectedTab.emoji}</span>
                <span className="text-primary-gold font-heading text-sm tracking-wider">{selectedTab.label}</span>
              </div>
              <p className="text-warm-stone text-sm mb-4">What question would you like to ask?</p>
              <textarea value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-primary-gold/30 bg-white/80 text-warm-stone placeholder-[#BDBDCC] outline-none focus:border-primary-gold/60 transition-colors resize-none" />
              <p className="text-taupe text-[10px] mt-2 text-left">Enter your question freely.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button onClick={() => setStep("choose-tab")}
                  className="text-[10px] text-taupe underline hover:text-primary-gold font-heading tracking-wider transition-colors">
                  ← Back
                </button>
                <motion.button
                  className="px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase border border-primary-gold/50 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold transition-all duration-300"
                  onClick={handleQuestionNext}
                  disabled={!question.trim()}
                  whileHover={{ scale: question.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: question.trim() ? 0.98 : 1 }}>
                  Next ✦
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Spread Introduction ── */}
          {step === "intro-spread" && spread && selectedTab && (
            <motion.div key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <div className="mb-4 px-4 py-3 border border-primary-gold/10 bg-primary-gold/5">
                <p className="text-taupe text-[10px] uppercase tracking-widest mb-1">Your question</p>
                <p className="text-warm-stone text-sm italic">&ldquo;{question}&rdquo;</p>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">{spread.emoji}</span>
                <span className="text-primary-gold font-heading text-sm tracking-wider">{spread.nameZh}</span>
                <span className="text-taupe text-[10px] font-heading tracking-wider">{spread.cards} cards</span>
              </div>
              <p className="text-taupe text-xs leading-relaxed mb-4">{spread.description}</p>
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {spread.positions.map((pos, i) => (
                  <span key={i} className="text-[9px] px-2 py-1 bg-primary-gold/10 text-taupe">
                    {i + 1}. {pos.label}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setStep("enter-question")}
                  className="text-[10px] text-taupe underline hover:text-primary-gold font-heading tracking-wider transition-colors">
                  ← Edit Question
                </button>
                <motion.button
                  className="px-8 py-2.5 font-heading text-sm tracking-[0.15em] uppercase border border-primary-gold/50 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold transition-all duration-300"
                  onClick={() => setStep("choose-mode")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  Continue ✦
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Choose Mode ── */}
          {step === "choose-mode" && spread && selectedTab && (
            <motion.div key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}>
              <p className="text-warm-stone text-sm mb-6">Choose how to interact with the cards</p>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl mx-auto">
                <motion.button
                  className="flex-1 px-6 py-5 font-heading border border-primary-gold/40 text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] transition-all duration-300 text-left"
                  onClick={handleMouseMode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  <div className="text-xl mb-2">🖱</div>
                  <div className="text-sm md:text-base tracking-[0.15em] uppercase mb-1">Mouse Mode</div>
                  <div className="text-[10px] md:text-xs text-taupe leading-relaxed font-normal lowercase">Use your mouse to wash, navigate and select cards</div>
                </motion.button>
                <motion.button
                  className={`flex-1 px-6 py-5 font-heading text-left border transition-all duration-300 ${cameraLoading ? "border-brilliant-gold/30 text-brilliant-gold/50 cursor-wait" : "border-brilliant-gold/50 text-brilliant-gold hover:bg-brilliant-gold/10 hover:border-brilliant-gold hover:shadow-[0_0_25px_rgba(165,124,42,0.2)]"}`}
                  onClick={handleMotionMode}
                  disabled={cameraLoading}
                  whileHover={cameraLoading ? {} : { scale: 1.02 }}
                  whileTap={cameraLoading ? {} : { scale: 0.97 }}>
                  <div className="text-xl mb-2">✋</div>
                  <div className="text-sm md:text-base tracking-[0.15em] uppercase mb-1">{cameraLoading ? "Requesting Camera..." : "Motion Mode"}</div>
                  <div className="text-[10px] md:text-xs text-taupe leading-relaxed font-normal lowercase">{cameraLoading ? "Please allow camera access when prompted..." : "Use hand gestures via camera to wash, navigate and select"}</div>
                </motion.button>
              </div>
              {cameraError && (
                <motion.div className="mt-4 px-4 py-3 border border-[#A57C2A]/40 bg-[#A57C2A]/5 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}>
                  <p className="text-[#A57C2A] text-[11px] leading-relaxed">⚠ {cameraError}</p>
                  <button className="mt-2 text-[10px] text-primary-gold underline hover:text-[#A57C2A] tracking-wider"
                    onClick={() => { setCameraError(null); handleMotionMode(); }}>Try again</button>
                </motion.div>
              )}
              <button onClick={() => setStep("intro-spread")}
                className="mt-4 text-[10px] text-taupe underline hover:text-primary-gold font-heading tracking-wider transition-colors">
                ← Back
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-primary-gold/20 to-transparent" />
      <motion.p className="absolute bottom-6 text-taupe text-[10px] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}>
        Ask your question, let the cards guide you
      </motion.p>
    </main>
  );
}
