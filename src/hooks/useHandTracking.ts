"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getCameraStream, setCameraStream, releaseCameraStream } from "@/lib/camera-store";
import { withBasePath } from "@/lib/config";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// ─────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────

export type Gesture =
  | "none"
  | "open_palm"
  | "fist"
  | "pointing"
  | "swipe_left"
  | "swipe_right"
  | "ok"
  | "peace";

export interface HandState {
  /** Currently classified gesture */
  gesture: Gesture;
  /** 0-1 confidence */
  confidence: number;
  /** Whether a hand is currently being tracked */
  isTracking: boolean;
  /** Error message if something failed */
  error: string | null;
  /** Camera initialized and running */
  cameraReady: boolean;
  /** 0-1 progress of a held palm (for confirm/select in carousel) */
  holdProgress: number;
  /** 0-1 progress of squeeze cycles (open/close hand for wash feedback) */
  squeezeProgress: number;
}

export interface GestureCallbacks {
  /** Triggered when enough open/close squeeze cycles detected (wash) */
  onWash?: () => void;
  /** Swipe left (carousel navigate) */
  onNavigateLeft?: () => void;
  /** Swipe right (carousel navigate) */
  onNavigateRight?: () => void;
  /** Open palm held long enough (select card) */
  onSelect?: () => void;
  /** OK hand sign held long enough (confirm wash) */
  onConfirm?: () => void;
}

interface UseHandTrackingOptions {
  callbacks: GestureCallbacks;
  /** Current app phase — affects which gestures are active */
  phase: "idle" | "washing" | "carousel" | "complete";
  /** When false, camera and MediaPipe are not initialized (default true) */
  enabled?: boolean;
}

// ─────────────────────────────────────────────────────────────────
//  Landmark coordinate helpers
// ─────────────────────────────────────────────────────────────────

interface Point { x: number; y: number; }

function normPoint(lm: any): Point {
  return { x: lm.x, y: lm.y };
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Landmark indices for hand skeleton connections */
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // index
  [0, 9], [9, 10], [10, 11], [11, 12],      // middle
  [0, 13], [13, 14], [14, 15], [15, 16],    // ring
  [0, 17], [17, 18], [18, 19], [19, 20],    // pinky
  [5, 9], [9, 13], [13, 17],                // palm
];

// ─────────────────────────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────────────────────────

export function useHandTracking(opts: UseHandTrackingOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [state, setState] = useState<HandState>({
    gesture: "none",
    confidence: 0,
    isTracking: false,
    error: null,
    cameraReady: false,
    holdProgress: 0,
    squeezeProgress: 0,
  });

  // Refs to avoid stale closure in rAF loop
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const landmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastLmRef = useRef<any[] | null>(null);

  // Temporal gesture tracking
  const posHistory = useRef<{ x: number; y: number; t: number }[]>([]);
  const lastWashTime = useRef(0);
  const lastSelectTime = useRef(0);
  const lastConfirmTime = useRef(0);
  const holdStartTime = useRef(0);
  const holdType = useRef<"confirm" | "select" | null>(null);
  // After a card is selected (OK sign in carousel), require the user to release
  // the OK gesture before another selection can start
  const okGestureReleasedRef = useRef(true);

  // Continuous wave tracking — fires navigation while palm is moving laterally
  const waveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveDirectionRef = useRef<"left" | "right" | null>(null);

  function startWave(dir: "left" | "right") {
    waveDirectionRef.current = dir;
    if (waveIntervalRef.current) return; // already running
    // Fire immediately, then every 200ms while hand keeps moving
    const fire = () => {
      const d = waveDirectionRef.current;
      if (!d) return;
      if (d === "left") optsRef.current.callbacks.onNavigateLeft?.();
      else optsRef.current.callbacks.onNavigateRight?.();
    };
    fire();
    waveIntervalRef.current = setInterval(fire, 200);
  }

  function stopWave() {
    waveDirectionRef.current = null;
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
  }

  // Squeeze (open/close hand) tracking for wash
  const prevGestureRef = useRef<Gesture>("none");
  const squeezeTransitions = useRef(0);
  const squeezeCooldownUntil = useRef(0);

  // ── Continuous wave tracking ──

  function trackWave(gesture: Gesture, now: number) {
    if (optsRef.current.phase !== "carousel" || gesture !== "open_palm") {
      stopWave();
      return;
    }

    const hist = posHistory.current;
    if (hist.length < 8) { stopWave(); return; }

    const re = hist.slice(-8);
    const first = re[0];
    const last = re[re.length - 1];
    const dx = last.x - first.x;
    const dt = last.t - first.t;

    // Lateral motion over ~200ms — very sensitive
    if (dt > 40 && dt < 600 && Math.abs(dx) > 0.04) {
      const dir = dx > 0 ? "right" : "left";
      startWave(dir);
    } else {
      stopWave();
    }
  }

  // ── Gesture classification ───────────────────────────────────

  function classifyGesture(landmarks: any[], now: number): Gesture {
    const center = {
      x: landmarks.reduce((s: number, l: any) => s + l.x, 0) / landmarks.length,
      y: landmarks.reduce((s: number, l: any) => s + l.y, 0) / landmarks.length,
    };

    const thumbExtended = dist(normPoint(landmarks[4]), center) >
      dist(normPoint(landmarks[3]), center) + 0.02;

    const fingerExtended = (tipIdx: number, pipIdx: number) => {
      const tip = normPoint(landmarks[tipIdx]);
      const pip = normPoint(landmarks[pipIdx]);
      return dist(tip, center) > dist(pip, center) + 0.015;
    };

    const indexExt = fingerExtended(8, 6);
    const middleExt = fingerExtended(12, 10);
    const ringExt = fingerExtended(16, 14);
    const pinkyExt = fingerExtended(20, 18);
    const extCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;

    const wrist = normPoint(landmarks[0]);

    const hist = posHistory.current;
    hist.push({ x: wrist.x, y: wrist.y, t: now });
    if (hist.length > 60) hist.shift();

    // ── OK sign: thumb tip near index tip + middle/ring/pinky extended ──
    const thumbIndexDist = dist(normPoint(landmarks[4]), normPoint(landmarks[8]));
    if (thumbIndexDist < 0.055 && middleExt && ringExt && pinkyExt) {
      return "ok";
    }

    // ── Peace sign (index + middle up, others down) ──
    if (indexExt && middleExt && !ringExt && !pinkyExt) return "peace";

    // ── Fist ──
    if (extCount <= 1 && !thumbExtended) return "fist";

    // ── Pointing ──
    if (indexExt && !middleExt && !ringExt && !pinkyExt) return "pointing";

    // ── Open palm — continuous wave direction tracked separately ──
    if (extCount >= 3 && thumbExtended) {
      return "open_palm";
    }

    return "none";
  }

  // ── Trigger actions based on gesture + phase ──

  function handleGesture(gesture: Gesture, now: number) {
    const { callbacks, phase } = optsRef.current;
    const COOLDOWN_SELECT = 1500;
    const COOLDOWN_CONFIRM = 1500;
    const HOLD_SELECT_MS = 1000;

    // Track OK sign release — required between consecutive carousel selections
    if (phase === "carousel" && gesture !== "ok") {
      okGestureReleasedRef.current = true;
    }

    switch (gesture) {
      case "open_palm":
        // In carousel → open palm is only for slap navigation (already handled as swipe).
        // No hold/select on open palm.
        if (phase !== "carousel") holdType.current = null;
        break;

      case "pointing":
        // In carousel → no action on pointing (OK sign used for select)
        if (phase !== "carousel") holdType.current = null;
        break;

      case "ok":
        if (phase === "washing") {
          // OK sign during washing → confirm (0.5s hold)
          if (holdType.current !== "confirm") {
            holdType.current = "confirm";
            holdStartTime.current = now;
          }
          const elapsed = now - holdStartTime.current;
          if (elapsed >= 500 && now - lastConfirmTime.current > COOLDOWN_CONFIRM) {
            lastConfirmTime.current = now;
            holdType.current = null;
            callbacks.onConfirm?.();
          }
        } else if (phase === "carousel") {
          // OK sign during carousel → select card (1s hold)
          // After a select, require the user to release OK sign first
          if (!okGestureReleasedRef.current) {
            holdType.current = null;
            break;
          }
          if (holdType.current !== "select") {
            holdType.current = "select";
            holdStartTime.current = now;
          }
          const elapsed = now - holdStartTime.current;
          if (elapsed >= HOLD_SELECT_MS && now - lastSelectTime.current > COOLDOWN_SELECT) {
            lastSelectTime.current = now;
            holdType.current = null;
            okGestureReleasedRef.current = false;
            callbacks.onSelect?.();
          }
        } else {
          holdType.current = null;
        }
        break;

      default:
        holdType.current = null;
        break;
    }
  }

  // ── Track open/close transitions (squeeze) for wash ──

  function trackSqueeze(gesture: Gesture, now: number) {
    const prev = prevGestureRef.current;
    prevGestureRef.current = gesture;

    // Only track during washing phase
    if (optsRef.current.phase !== "washing") {
      squeezeTransitions.current = 0;
      return;
    }

    // Any transition between fist and open_palm triggers a wash
    if (
      (prev === "fist" && gesture === "open_palm") ||
      (prev === "open_palm" && gesture === "fist")
    ) {
      squeezeTransitions.current += 1;

      if (now > squeezeCooldownUntil.current) {
        squeezeTransitions.current = 0;
        squeezeCooldownUntil.current = now + 500;
        optsRef.current.callbacks.onWash?.();
      }
    }
  }

  function getHoldProgress(now: number): number {
    if (!holdType.current || !holdStartTime.current) return 0;
    const elapsed = now - holdStartTime.current;
    return Math.min(1, elapsed / 1000);
  }

  // ── Draw landmarks on canvas ──

  function drawFrame() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const lms = lastLmRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    if (!lms) return;

    ctx.strokeStyle = "rgba(165, 124, 42, 0.8)";
    ctx.lineWidth = 2;
    for (const [i, j] of HAND_CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(lms[i].x * w, lms[i].y * h);
      ctx.lineTo(lms[j].x * w, lms[j].y * h);
      ctx.stroke();
    }

    for (const lm of lms) {
      const x = lm.x * w;
      const y = lm.y * h;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#2B4C7E";
      ctx.fill();
      ctx.strokeStyle = "#A57C2A";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ── Main detection loop ──

  async function detectLoop() {
    const landmarker = landmarkerRef.current;
    const video = videoRef.current;
    if (!landmarker || !video || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    try {
      const result = landmarker.detectForVideo(video, performance.now());
      const now = Date.now();

      if (result.landmarks && result.landmarks.length > 0) {
        const lms = result.landmarks[0];
        lastLmRef.current = lms;

        const gesture = classifyGesture(lms, now);
        handleGesture(gesture, now);
        trackSqueeze(gesture, now);
        trackWave(gesture, now);

        const holdProg = getHoldProgress(now);
        const squeezeProg = Math.min(1, squeezeTransitions.current);

        setState((prev) => ({
          ...prev,
          gesture,
          confidence: 0.85,
          isTracking: true,
          error: null,
          cameraReady: true,
          holdProgress: holdProg,
          squeezeProgress: squeezeProg,
        }));
      } else {
        lastLmRef.current = null;
        setState((prev) => ({
          ...prev,
          gesture: "none",
          confidence: 0,
          isTracking: false,
          holdProgress: 0,
          squeezeProgress: 0,
        }));
      }
    } catch {
      // silent frame skip
    }

    drawFrame();
    animFrameRef.current = requestAnimationFrame(detectLoop);
  }

  // ── Initialize (reactive to enabled flag) ──

  const enabled = opts.enabled;

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;

    async function init() {
      try {
        // Load MediaPipe WASM files from our public directory
        const vision = await FilesetResolver.forVisionTasks(withBasePath("/wasm"));

        if (!mounted) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!mounted) { landmarker.close(); return; }
        landmarkerRef.current = landmarker;

        // Reuse camera stream from store (pre-acquired on landing page)
        let stream = getCameraStream();
        if (!stream || !stream.active) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
          });
          setCameraStream(stream);
        }

        if (!mounted) {
          stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          if (getCameraStream() === stream) releaseCameraStream();
          landmarker.close();
          return;
        }

        streamRef.current = stream;

        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        video.setAttribute("playsinline", "");
        await video.play();

        videoRef.current = video;
        setState((prev) => ({ ...prev, cameraReady: true, error: null }));

        animFrameRef.current = requestAnimationFrame(detectLoop);
      } catch (err: any) {
        if (mounted) {
          const msg = err.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser settings."
            : err.message || "Failed to initialize hand tracking";
          setState((prev) => ({ ...prev, error: msg, cameraReady: false }));
        }
      }
    }

    init();

    return () => {
      mounted = false;
      stopWave();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        releaseCameraStream();
      }
      if (landmarkerRef.current) {
        try { landmarkerRef.current.close(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    ...state,
    videoRef,
    canvasRef,
    retry: useCallback(() => {
      setState({
        gesture: "none", confidence: 0, isTracking: false,
        error: null, cameraReady: false, holdProgress: 0, squeezeProgress: 0,
      });
    }, []),
  };
}
