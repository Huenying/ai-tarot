import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tarot — Divine Your Path",
  description:
    "An interactive AI tarot reading experience with 3D card carousel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #2B4C7E 0%, transparent 70%)" }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
