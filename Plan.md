🃏 Plan
Phase 1 — Project Scaffold

Init Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
Install deps: Framer Motion, MediaPipe Hands, tarot-card-meanings, three.js (for 3D carousel)
Phase 2 — Page 1: Landing

Dark mystical full-screen layout
"Please silently recite the question in your heart" text
"Start" button → asks camera permission → navigates to reading page
Phase 3 — Page 2: The Reading

Camera feed with MediaPipe hand tracking overlay
Stage 1: 78 cards scattered messily, user "washes" (swipes) them — detect 2 full passes
Stage 2: Cards animate into a 3D cylindrical carousel (CSS 3D transform or Three.js)
Stage 3: User browses with hand swipe, points (index finger extend) to select → grab gesture → release gesture → card recorded
Repeat until 3 cards picked → show results
Phase 4 — Results

Display 3 selected cards with meanings from tarot-card-meanings
Upright/reversed detection (based on card rotation when grabbed)
Phase 5 — Polish

Dark mystical theme using your gold/black palette
Card back from your attachment image
Responsive fallbacks


📁 Project Structure

tarot-advanced/
├── public/
│   └── images/
│       └── card-back.png        # Your card cover image
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (dark theme)
│   │   ├── page.tsx             # Landing page
│   │   ├── reading/
│   │   │   └── page.tsx         # Hand tracking + card interaction
│   │   └── result/
│   │       └── page.tsx         # Card meanings reveal
│   ├── components/
│   │   ├── Card.tsx             # Single card (face/back, 3D transform)
│   │   ├── CardCarousel.tsx     # 3D cylindrical carousel
│   │   ├── HandTracker.tsx      # MediaPipe hands wrapper
│   │   ├── CardWash.tsx         # Scattered cards + wash gesture
│   │   └── GestureDetector.tsx  # Index point / grab / release logic
│   ├── hooks/
│   │   └── useHandTracking.ts   # MediaPipe hook
│   ├── data/
│   │   └── cards.ts             # 78 card definitions + meanings
│   └── styles/
│       └── globals.css          # Tailwind + custom theme vars
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json