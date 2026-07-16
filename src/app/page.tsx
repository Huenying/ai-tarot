"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SplashPage() {
  const router = useRouter();

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-bg.jpeg')" }}
      />

      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border border-[#2B4C7E]/30 flex items-center justify-center mb-6">
            <span className="text-4xl md:text-5xl">🔮</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-heading text-[#2B4C7E] mb-4 tracking-[0.15em] drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          AI Tarot
        </motion.h1>

        <motion.div
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#2B4C7E]/60 to-transparent mx-auto mb-6"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 96, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />

        <motion.p
          className="text-[#3D5470] text-base md:text-lg leading-relaxed mb-10 italic max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          &ldquo;The cards know the way. Let them guide you.&rdquo;
        </motion.p>

        <motion.button
          className="px-12 py-3 font-heading text-sm md:text-base tracking-[0.2em] uppercase border border-[#2B4C7E]/50 text-[#2B4C7E] hover:bg-[#2B4C7E]/10 hover:border-[#2B4C7E] transition-all duration-300"
          onClick={() => router.push("/setup")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Your Journey
        </motion.button>
      </div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 left-0 right-0 text-center text-[#BDBDCC] text-[10px] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        TRUST THE JOURNEY · THE CARDS KNOW THE WAY
      </motion.p>
    </main>
  );
}
