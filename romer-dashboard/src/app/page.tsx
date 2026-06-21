"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight } from "lucide-react";
import { GenerativeArtScene } from "@/components/ui/anomalous-matter-hero";

export default function HomeLandingPage() {
  return (
    <div className="relative w-screen h-screen bg-[#000000] text-[#ffffff] overflow-hidden select-none">
      
      {/* Top Floating Glassmorphic Header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 md:px-10 bg-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border border-[#333] bg-[#121212] flex items-center justify-center">
            <span className="text-[#ffffff] font-bold text-xs font-mono">C</span>
          </div>
          <span className="font-manrope text-sm font-bold uppercase tracking-wider text-[#ffffff]">CoAide</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-1.5 rounded border border-[#222] bg-[#121212]/60 backdrop-blur-md text-xs font-semibold text-[#a0a0a0] hover:text-[#ffffff] hover:border-[#444] transition-all duration-200"
          >
            <Shield size={12} />
            Launch Workspace
          </Link>
        </div>
      </header>

      {/* Full-Screen 3D Generative Art Scene */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#000000]" />}>
        <GenerativeArtScene />
      </Suspense>

      {/* Dark gradient overlay for bottom text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/65 to-transparent z-10 pointer-events-none" />

      {/* Main Copy Overlay - Matches the screenshot layout */}
      <div className="relative z-20 flex flex-col items-center justify-end h-full pb-20 md:pb-28 text-center px-4">
        <div className="max-w-3xl animate-fade-in-long">
          
          <h1 className="text-xs font-mono tracking-[0.25em] text-[#ffffff]/80 uppercase">
            LAUNCH SEQUENCE: ANOMALY 12
          </h1>
          
          <p className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight font-manrope tracking-tight text-white">
            Energy dances along unseen frontiers.
          </p>
          
          <p className="mt-5 max-w-xl mx-auto text-sm md:text-base leading-relaxed text-[#a0a0a0]/80 font-sans">
            This demo shows how to override the default copy and integrate hero into a page layout.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/dashboard?tab=command"
              className="group flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#ffffff] text-[#000000] font-sans text-xs font-semibold uppercase tracking-widest hover:bg-[#e0e0e0] active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              Build What You Want
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="https://github.com/aryanRN2/kaggle-google"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded border border-[#222] bg-[#121212]/50 hover:bg-[#1c1c1c] text-[#a0a0a0] hover:text-[#ffffff] font-sans text-xs font-semibold uppercase tracking-widest active:scale-95 transition-all duration-200"
            >
              <Terminal size={14} />
              View Source
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
