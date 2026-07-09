"use client";

import { useRef, useEffect } from "react";
import type { Gesture } from "@/hooks/useHandTracking";

// ─────────────────────────────────────────────────────────────────
//  Gesture → display info
// ─────────────────────────────────────────────────────────────────

const GESTURE_LABELS: Record<Gesture, string> = {
  none: "No hand detected",
  open_palm: "Open Palm",
  fist: "Fist",
  pointing: "Pointing",
  swipe_left: "Swipe Left",
  swipe_right: "Swipe Right",
  ok: "OK Sign",
  peace: "Peace Sign",
};

// ─────────────────────────────────────────────────────────────────

interface CameraOverlayProps {
  /** Video element created by useHandTracking */
  video: HTMLVideoElement | null;
  /** Canvas ref object from useHandTracking — attach to <canvas> */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Whether hand tracking is active */
  isTracking: boolean;
  /** Whether camera is ready */
  cameraReady: boolean;
  /** Current gesture */
  gesture: Gesture;
  /** Error message if any */
  error: string | null;
  /** Current app phase */
  phase: "idle" | "washing" | "carousel" | "complete";
  /** Hold progress 0-1 for open palm gestures */
  holdProgress: number;
  /** Squeeze progress 0-1 for open/close hand wash feedback */
  squeezeProgress: number;
}

export default function CameraOverlay({
  video,
  canvasRef,
  isTracking,
  cameraReady,
  gesture,
  error,
  phase,
  holdProgress,
  squeezeProgress,
}: CameraOverlayProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Mirror the mediapipe-hidden video into a visible one
  useEffect(() => {
    if (video && localVideoRef.current) {
      if (localVideoRef.current.srcObject !== video.srcObject) {
        localVideoRef.current.srcObject = video.srcObject;
      }
    }
  }, [video]);

  // Sync canvas sizing
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !localVideoRef.current) return;
    const sync = () => {
      if (!el || !localVideoRef.current) return;
      const rect = localVideoRef.current.getBoundingClientRect();
      el.width = rect.width * (640 / 480); // maintain aspect ratio
      el.height = rect.height;
    };
    sync();
    const ro = new ResizeObserver(sync);
    if (localVideoRef.current) ro.observe(localVideoRef.current);
    return () => ro.disconnect();
  }, [canvasRef, cameraReady]);

  // Error state — show instructions, not camera
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-[99999] w-56 p-3 rounded-sm border border-[#E6C687]/30 bg-[#1C2D42] shadow-2xl">
        <p className="text-[#E6C687] text-[10px] font-heading tracking-wider mb-1">
          ⚠ Motion Mode
        </p>
        <p className="text-[#BDBDCC] text-[9px] leading-relaxed">{error}</p>
      </div>
    );
  }

  if (!cameraReady) {
    return (
      <div className="fixed bottom-4 right-4 z-[99999] w-48 p-3 rounded-sm border border-[#2B4C7E]/20 bg-[#F0EFF5] shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 border border-[#2B4C7E] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#2B4C7E] text-[10px] font-heading tracking-wider">
            Starting camera...
          </span>
        </div>
      </div>
    );
  }

  // Phase-specific hints
  const hints: { icon: string; text: string }[] = [];
  if (phase === "washing") {
    hints.push(
      { icon: "✊✋", text: "Open or close hand to wash" },
      { icon: "👌", text: "Hold OK sign to confirm" }
    );
  } else if (phase === "carousel") {
    hints.push(
      { icon: "🖐️", text: "Wave palm to move cylinder" },
      { icon: "👌", text: "OK sign 1s to select card" }
    );
  }

  // Squeeze progress ring (shown during wash)
  const showSqueezeRing = phase === "washing" && squeezeProgress > 0;

  return (
    <div className="fixed bottom-4 right-4 z-[99999] flex flex-col items-end gap-2">
      {/* Camera preview window */}
      <div className="relative w-44 h-32 md:w-52 md:h-36 rounded-sm overflow-hidden border border-[#2B4C7E]/30 shadow-xl bg-black">
        {/* Video feed (mirrored) */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        {/* Canvas for landmarks overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full scale-x-[-1] pointer-events-none"
        />

        {/* Not tracking overlay */}
        {!isTracking && cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-white/60 text-[9px] tracking-wider">
              No hand detected
            </span>
          </div>
        )}

        {/* Gesture label badge */}
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#1C2D42]/80 rounded-sm">
          <span className="text-[#E6C687] text-[8px] font-heading tracking-wider whitespace-nowrap">
            {gesture === "none"
              ? isTracking
                ? "Detecting..."
                : "Waiting..."
              : GESTURE_LABELS[gesture]}
          </span>
        </div>

        {/* Hold progress bar */}
        {holdProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-[#E6C687] transition-all duration-100"
              style={{ width: `${holdProgress * 100}%` }}
            />
          </div>
        )}

        {/* Squeeze progress ring */}
        {showSqueezeRing && (
          <div className="absolute top-1 right-1 w-5 h-5">
            <svg viewBox="0 0 20 20" className="w-full h-full -rotate-90">
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke="#E6C687"
                strokeWidth="2"
                strokeDasharray={`${squeezeProgress * 50} 50`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Phase hints */}
      {hints.length > 0 && (
        <div className="flex flex-col gap-1 w-44 md:w-52">
          {hints.map((h, i) => (
            <div
              key={i}
              className="px-2 py-1 rounded-sm bg-[#1C2D42]/80 border border-[#2B4C7E]/20 backdrop-blur-sm"
            >
              <span className="text-[#E6C687] text-[8px] tracking-wider">
                {h.icon} {h.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mode indicator */}
      <div className="px-2 py-0.5 rounded-sm bg-[#2B4C7E]/10 border border-[#2B4C7E]/20">
        <span className="text-[#2B4C7E] text-[8px] font-heading tracking-widest">
          ✋ MOTION MODE
        </span>
      </div>
    </div>
  );
}
