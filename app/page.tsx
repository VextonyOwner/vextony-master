"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function VextonyHome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl md:text-9xl font-black tracking-widest mb-4 bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 to-yellow-600"
      >
        VEXTONY
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
        <div className="border border-yellow-600/30 p-12 rounded-3xl bg-zinc-900/50 hover:border-yellow-500 transition-all cursor-pointer">
          <h2 className="text-2xl font-bold text-yellow-500">SOVEREIGN</h2>
          <p className="text-[10px] mt-2 text-gray-500 uppercase">Elite Knowledge</p>
        </div>
        <div className="border border-white/10 p-12 rounded-3xl bg-zinc-900/50 hover:border-white transition-all cursor-pointer">
          <h2 className="text-2xl font-bold text-white">UNIVERSE</h2>
          <p className="text-[10px] mt-2 text-gray-500 uppercase">Free Knowledge</p>
        </div>
        <div className="border border-cyan-400/30 p-12 rounded-3xl bg-zinc-900/50 hover:border-cyan-400 transition-all cursor-pointer">
          <h2 className="text-2xl font-bold text-cyan-400">VORTEX</h2>
          <p className="text-[10px] mt-2 text-gray-500 uppercase">Viral Trends</p>
        </div>
      </div>
    </main>
  );
}
