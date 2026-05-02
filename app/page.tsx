"use client";
import { motion } from "framer-motion";

export default function VextonyHome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start md:justify-center p-5 text-center">
      {/* রাজকীয় লোগো - মোবাইলে কিছুটা ছোট এবং মার্জিত */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-9xl font-black tracking-widest mt-10 md:mt-0 mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
      >
        VEXTONY
      </motion.h1>
      <p className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase mb-10">The Sovereign Era</p>

      {/* মোবাইল ফ্রেন্ডলি গ্রিড: মোবাইলে ১ কলাম, ট্যাবলেটে ২ কলাম, ল্যাপটপে ৪ কলাম */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl">
        
        {/* SOVEREIGN - GOLD */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="border border-yellow-600/30 p-8 rounded-[2.5rem] bg-zinc-900/40 active:border-yellow-500 transition-all cursor-pointer"
        >
          <h2 className="text-xl font-bold text-yellow-500 italic">SOVEREIGN</h2>
          <p className="text-[9px] mt-1 text-gray-500 uppercase tracking-tighter">Elite Knowledge</p>
        </motion.div>

        {/* UNIVERSE - WHITE */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="border border-white/10 p-8 rounded-[2.5rem] bg-zinc-900/40 active:border-white transition-all cursor-pointer"
        >
          <h2 className="text-xl font-bold text-white">UNIVERSE</h2>
          <p className="text-[9px] mt-1 text-gray-400 uppercase tracking-tighter">Free Knowledge</p>
        </motion.div>

        {/* VORTEX - CYAN */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="border border-cyan-400/20 p-8 rounded-[2.5rem] bg-zinc-900/40 active:border-cyan-400 transition-all cursor-pointer"
        >
          <h2 className="text-xl font-bold text-cyan-400">VORTEX</h2>
          <p className="text-[9px] mt-1 text-gray-500 uppercase tracking-tighter">Viral Trends</p>
        </motion.div>

        {/* SOVEREIGN SKILLS - PURPLE (HIGHLIGHTED) */}
        <motion.div 
          whileTap={{ scale: 0.95 }}
          className="border-2 border-purple-500/40 p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-purple-900/20 active:border-purple-500 transition-all cursor-pointer"
        >
          <h2 className="text-xl font-bold text-purple-400">TECH SKILLS</h2>
          <p className="text-[9px] mt-1 text-purple-200/50 uppercase tracking-tighter">AI & Quantum Mastery</p>
        </motion.div>

      </div>

      {/* মোবাইল ফুটার নোট */}
      <div className="mt-12 text-[8px] text-zinc-600 uppercase tracking-widest">
        Powered by Sovereign Engine 60.0
      </div>
    </main>
  );
}
