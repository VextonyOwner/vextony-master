"use client";
import { motion } from "framer-motion";

export default function VextonyHome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 overflow-hidden font-sans">
      
      {/* 3D VEXTONY LOGO - MOBILE AUTO-FIT */}
      <div className="mt-16 mb-12 relative group">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-8xl font-black tracking-[0.2em] text-center uppercase"
          style={{
            textShadow: "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",
            color: "#FFFFFF"
          }}
        >
          VEXTONY
        </motion.h1>
        {/* GOLDEN GLOW EFFECT */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
      </div>

      <p className="text-[9px] text-zinc-500 tracking-[0.6em] uppercase mb-10 text-center font-light">
        The Sovereign Era
      </p>

      {/* 4 CORE FOLDERS - MOBILE OPTIMIZED GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        
        {/* SOVEREIGN - Elite Section */}
        <motion.div 
          whileTap={{ scale: 0.96 }}
          className="border border-yellow-600/30 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-yellow-500"
        >
          <h2 className="text-xl font-bold text-yellow-500 tracking-wider">SOVEREIGN</h2>
          <span className="text-[8px] text-zinc-500 mt-1 tracking-widest uppercase font-mono">Elite Vault</span>
        </motion.div>

        {/* UNIVERSE - Free Section */}
        <motion.div 
          whileTap={{ scale: 0.96 }}
          className="border border-white/10 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-white"
        >
          <h2 className="text-xl font-bold text-white tracking-wider">UNIVERSE</h2>
          <span className="text-[8px] text-zinc-500 mt-1 tracking-widest uppercase font-mono">Open Library</span>
        </motion.div>

        {/* VORTEX - Viral Section */}
        <motion.div 
          whileTap={{ scale: 0.96 }}
          className="border border-cyan-400/20 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-cyan-400"
        >
          <h2 className="text-xl font-bold text-cyan-400 tracking-wider">VORTEX</h2>
          <span className="text-[8px] text-zinc-500 mt-1 tracking-widest uppercase font-mono">Viral Trends</span>
        </motion.div>

        {/* TECH SKILLS - Quantum Section */}
        <motion.div 
          whileTap={{ scale: 0.96 }}
          className="border border-purple-500/30 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-purple-500"
        >
          <h2 className="text-xl font-bold text-purple-400 tracking-wider text-center">SKILLS & TECH</h2>
          <span className="text-[8px] text-zinc-500 mt-1 tracking-widest uppercase font-mono text-center">AI & Tech Mastery</span>
        </motion.div>

      </div>

      <footer className="mt-auto py-8 text-[7px] text-zinc-700 tracking-[0.8em] uppercase">
        Engine 60.0 • 1 Billion Scale
      </footer>
    </main>
  );
}
