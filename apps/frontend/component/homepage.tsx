"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const OWNERS = ["bg-emerald-500/40", "bg-orange-500/40", "bg-violet-500/40", "bg-amber-500/40", ""];
const COLS = 24;
const ROWS = 16;
const TOTAL = COLS * ROWS;

function generateGrid() {
  return Array.from({ length: TOTAL }, () => {
    const r = Math.random();
    if (r < 0.55) return OWNERS[Math.floor(Math.random() * 4)];
    return "";
  });
}

export default function HomePage() {
  const [grid, setGrid] = useState<string[]>(() => generateGrid());
  const [onlineCount, setOnlineCount] = useState(247);

  useEffect(() => {
    const tileInterval = setInterval(() => {
      setGrid((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * TOTAL);
        const r = Math.random();
        next[idx] = r < 0.7 ? OWNERS[Math.floor(Math.random() * 4)] : "";
        return next;
      });
    }, 120);

    const countInterval = setInterval(() => {
      setOnlineCount((c) => c + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    return () => {
      clearInterval(tileInterval);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0f0d] text-emerald-50 overflow-hidden font-sans">

      {/* Animated background grid */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {grid.map((cls, i) => (
          <div
            key={i}
            className={`border border-emerald-900/30 transition-colors duration-150 ${cls}`}
          />
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-emerald-900/40 bg-[#0a0f0d]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 animate-pulse" />
          <span className="font-black text-xl tracking-widest text-emerald-400" style={{ fontFamily: "monospace" }}>
            GRIDWARS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-800 rounded-md hover:bg-emerald-950 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign in
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#04342C] bg-emerald-500 rounded-md hover:bg-emerald-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-emerald-800/60 bg-emerald-950/60 text-emerald-400 text-xs font-medium tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {onlineCount} players online now
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-tight tracking-tight mb-4" style={{ fontFamily: "monospace" }}>
          Claim your<br />
          <span className="text-emerald-400">territory.</span>
        </h1>

        <p className="text-emerald-300/70 text-base max-w-sm leading-relaxed mb-10">
          A real-time battle for the grid. Click a block, own it — watch everyone fight back instantly.
        </p>

        <div className="flex gap-3 flex-wrap justify-center mb-16">
          <Link
            href="/signup"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#04342C] bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="m13 19 9-9"/><path d="m2 22 7.5-7.5"/>
            </svg>
            Start playing
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-emerald-400 border border-emerald-800 rounded-lg hover:bg-emerald-950 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign in
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10">
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-400 tracking-tight" style={{ fontFamily: "monospace" }}>12,480</div>
            <div className="text-[10px] text-emerald-700 uppercase tracking-widest mt-1">Tiles on map</div>
          </div>
          <div className="w-px h-8 bg-emerald-900" />
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-400 tracking-tight" style={{ fontFamily: "monospace" }}>8,341</div>
            <div className="text-[10px] text-emerald-700 uppercase tracking-widest mt-1">Claimed</div>
          </div>
          <div className="w-px h-8 bg-emerald-900" />
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-400 tracking-tight" style={{ fontFamily: "monospace" }}>∞</div>
            <div className="text-[10px] text-emerald-700 uppercase tracking-widest mt-1">Recaptures</div>
          </div>
        </div>
      </section>
    </div>
  );
}