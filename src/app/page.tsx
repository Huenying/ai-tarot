"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { requestCameraPermission } from "@/lib/camera-store";

export default function LandingPage() {
  const router = useRouter();
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleMotionMode = async () => {
    setCameraLoading(true);
    setCameraError(null);
    try {
      await requestCameraPermission();
      router.push("/reading?mode=hand");
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

        {/* Mode Selection */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {/* Mouse Mode */}
          <motion.button
            className="
              flex-1 px-6 py-5 font-heading
              border border-primary-gold/40 text-primary-gold
              hover:bg-primary-gold/10 hover:border-primary-gold
              hover:shadow-[0_0_30px_rgba(43,76,126,0.15)]
              transition-all duration-300 text-left
            "
            onClick={() => router.push("/reading?mode=mouse")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-xl mb-2">🖱</div>
            <div className="text-sm md:text-base tracking-[0.15em] uppercase mb-1">
              Mouse Mode
            </div>
            <div className="text-[10px] md:text-xs text-taupe leading-relaxed font-normal lowercase">
              Use your mouse to wash, navigate and select cards
            </div>
          </motion.button>

          {/* Motion Mode */}
          <motion.button
            className={`
              flex-1 px-6 py-5 font-heading text-left
              border transition-all duration-300
              ${cameraLoading
                ? "border-brilliant-gold/30 text-brilliant-gold/50 cursor-wait"
                : "border-brilliant-gold/50 text-brilliant-gold hover:bg-brilliant-gold/10 hover:border-brilliant-gold hover:shadow-[0_0_25px_rgba(165,124,42,0.2)]"
              }
            `}
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
              {cameraLoading
                ? "Please allow camera access when prompted..."
                : "Use hand gestures via camera to wash, navigate and select"}
            </div>
          </motion.button>
        </motion.div>

        {/* Camera permission error */}
        {cameraError && (
          <motion.div
            className="mt-6 px-4 py-3 border border-[#A57C2A]/40 bg-[#A57C2A]/5 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#A57C2A] text-[11px] leading-relaxed">
              ⚠ {cameraError}
            </p>
            <button
              className="mt-2 text-[10px] text-[#2B4C7E] underline hover:text-[#A57C2A] tracking-wider"
              onClick={() => { setCameraError(null); handleMotionMode(); }}
            >
              Try again
            </button>
          </motion.div>
        )}
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
