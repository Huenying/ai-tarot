"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { requestCameraPermission } from "@/lib/camera-store";
import { THEMED_GROUP, SPECIFIC_GROUP } from "@/lib/spreads";
import type { TabItem } from "@/lib/spreads";

export default function LandingPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabItem | null>(null);
  const [question, setQuestion] = useState("");
  const [chosenMode, setChosenMode] = useState<"mouse" | "hand" | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const spread = selectedTab?.spread ?? null;

  const handleStart = useCallback(async () => {
    if (!selectedTab || !question.trim() || !chosenMode || starting) return;

    if (chosenMode === "mouse") {
      const params = new URLSearchParams();
      params.set("mode", "mouse");
      params.set("q", question.trim());
      params.set("tab", selectedTab.id);
      params.set("spread", spread!.id);
      router.push(`/reading?${params.toString()}`);
      return;
    }

    // Hand mode — request camera first
    setStarting(true);
    setCameraLoading(true);
    setCameraError(null);
    try {
      await requestCameraPermission();
      const params = new URLSearchParams();
      params.set("mode", "hand");
      params.set("q", question.trim());
      params.set("tab", selectedTab.id);
      params.set("spread", spread!.id);
      router.push(`/reading?${params.toString()}`);
    } catch (err: any) {
      setCameraError(err.name === "NotAllowedError"
        ? "Camera access denied. Please allow camera in your browser settings and try again."
        : "Could not access camera. Please check your camera and try again.");
      setStarting(false);
      setCameraLoading(false);
    }
  }, [selectedTab, question, chosenMode, starting, spread, router]);

  const canStart = selectedTab && question.trim() && chosenMode;

  return (
    <main className="relative min-h-screen flex flex-col items-center px-6 py-12 overflow-y-auto" style={{ backgroundColor: "#F0EFF5" }}>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border border-[#2B4C7E]/30 flex items-center justify-center mb-4">
            <span className="text-3xl md:text-4xl">🔮</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-[#2B4C7E] tracking-[0.15em] mb-3">
            AI Tarot
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/60 to-transparent mx-auto" />
        </div>

        {/* ── Row 1: Group 1 — By Topic ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">📂</span>
            <span className="font-heading text-[#2B4C7E] text-sm tracking-[0.08em] uppercase">By Topic</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {THEMED_GROUP.tabs.map((tab) => {
              const isOn = selectedTab?.id === tab.id;
              return (
                <button key={tab.id}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-2 border text-xs font-heading tracking-wider transition-all duration-200 ${
                    isOn
                      ? "border-[#2B4C7E] bg-[#2B4C7E]/10 text-[#2B4C7E]"
                      : selectedTab
                      ? "border-[#2B4C7E]/15 text-[#BDBDCC]"
                      : "border-[#2B4C7E]/25 text-[#3D5470] hover:border-[#2B4C7E]/50"
                  }`}>
                  {tab.emoji} {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Row 2: Group 2 — By Question Type ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">🎯</span>
            <span className="font-heading text-[#2B4C7E] text-sm tracking-[0.08em] uppercase">By Question Type</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SPECIFIC_GROUP.tabs.map((tab) => {
              const isOn = selectedTab?.id === tab.id;
              return (
                <button key={tab.id}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-2 border text-xs font-heading tracking-wider transition-all duration-200 ${
                    isOn
                      ? "border-[#2B4C7E] bg-[#2B4C7E]/10 text-[#2B4C7E]"
                      : selectedTab
                      ? "border-[#2B4C7E]/15 text-[#BDBDCC]"
                      : "border-[#2B4C7E]/25 text-[#3D5470] hover:border-[#2B4C7E]/50"
                  }`}>
                  {tab.emoji} {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Spread introduction box ── */}
        {spread && (
          <motion.div className="mb-6 p-4 border border-[#2B4C7E]/10 bg-white/60"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading text-[#2B4C7E] text-sm tracking-wider">{spread.name}</span>
              <span className="text-[#3D5470] text-[10px] font-heading tracking-wider">{spread.cards} cards</span>
            </div>
            <p className="text-[#3D5470] text-xs leading-relaxed mb-3">{spread.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {spread.positions.map((pos, i) => (
                <span key={i} className="text-[9px] px-2 py-1 bg-[#2B4C7E]/8 text-[#3D5470] border border-[#2B4C7E]/8">
                  {i + 1}. {pos.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Question input ── */}
        <div className="mb-6">
          <p className="font-heading text-[#2B4C7E] text-sm tracking-[0.08em] uppercase mb-2">Your Question</p>
          <textarea value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            rows={2}
            className="w-full px-4 py-3 text-sm border border-[#2B4C7E]/20 bg-white text-[#1C2D42] placeholder-[#BDBDCC] outline-none focus:border-[#2B4C7E]/50 transition-colors resize-none" />
        </div>

        {/* ── Mode selection ── */}
        <div className="mb-8">
          <p className="font-heading text-[#2B4C7E] text-sm tracking-[0.08em] uppercase mb-3">Choose Your Mode</p>
          <div className="flex flex-col md:flex-row gap-3">
            <button onClick={() => setChosenMode("mouse")}
              className={`flex-1 px-5 py-4 border text-left transition-all duration-200 ${
                chosenMode === "mouse"
                  ? "border-[#2B4C7E] bg-[#2B4C7E]/10 text-[#2B4C7E]"
                  : "border-[#2B4C7E]/20 text-[#3D5470] hover:border-[#2B4C7E]/40"
              }`}>
              <div className="text-lg mb-1">🖱</div>
              <div className="font-heading text-xs tracking-[0.12em] uppercase">Mouse Mode</div>
              <div className="text-[9px] leading-relaxed mt-1 opacity-60">Use your mouse to wash, navigate and select cards</div>
            </button>
            <button onClick={() => { setChosenMode("hand"); setCameraError(null); }}
              className={`flex-1 px-5 py-4 border text-left transition-all duration-200 ${
                chosenMode === "hand"
                  ? "border-[#2B4C7E] bg-[#2B4C7E]/10 text-[#2B4C7E]"
                  : "border-[#2B4C7E]/20 text-[#3D5470] hover:border-[#2B4C7E]/40"
              }`}>
              <div className="text-lg mb-1">✋</div>
              <div className="font-heading text-xs tracking-[0.12em] uppercase">Motion Mode</div>
              <div className="text-[9px] leading-relaxed mt-1 opacity-60">Use hand gestures via camera to wash, navigate and select</div>
            </button>
          </div>
          {cameraError && (
            <p className="text-[#A57C2A] text-[10px] mt-2">⚠ {cameraError}</p>
          )}
        </div>

        {/* ── Start button ── */}
        <div className="text-center">
          <motion.button
            className={`px-12 py-3 font-heading text-sm tracking-[0.2em] uppercase border transition-all duration-300 ${
              canStart && !cameraLoading
                ? "border-[#2B4C7E]/60 text-[#2B4C7E] hover:bg-[#2B4C7E]/10 hover:shadow-[0_0_30px_rgba(43,76,126,0.15)] cursor-pointer"
                : "border-[#BDBDCC]/40 text-[#BDBDCC] cursor-not-allowed"
            }`}
            onClick={handleStart}
            disabled={!canStart || cameraLoading}
            whileHover={canStart && !cameraLoading ? { scale: 1.02 } : {}}
            whileTap={canStart && !cameraLoading ? { scale: 0.98 } : {}}>
            {cameraLoading ? "Starting..." : "✦ Begin Reading ✦"}
          </motion.button>
          {!canStart && (
            <p className="text-[#BDBDCC] text-[9px] mt-2 tracking-wider">
              {!selectedTab ? "Select a spread" : !question.trim() ? "Enter your question" : "Choose your mode"}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-[#BDBDCC] text-[9px] tracking-widest">
        TRUST THE JOURNEY · THE CARDS KNOW THE WAY
      </p>
    </main>
  );
}
