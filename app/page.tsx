"use client";
import { motion } from "framer-motion";
import { Crown, Globe, Zap, Cpu } from "lucide-react"; // আইকনগুলো ইম্পোর্ট করা হলো

export default function VextonyHome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 overflow-hidden font-sans">
      
      {/* 3D VEXTONY LOGO */}
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
        <div className="absolute -inset-1 bg-yellow-600/10 blur-3xl opacity-20 pointer-events-none"></div>
      </div>

      <p className="text-[9px] text-zinc-500 tracking-[0.6em] uppercase mb-10 text-center font-light">
        The Sovereign Era
      </p>

      {/* 4 CORE PORTALS - MOBILE PERFECT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        
        {/* ROYAL VAULT (Sovereign) */}
        <motion.div whileTap={{ scale: 0.96 }} className="border border-yellow-600/20 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-yellow-500">
          <Crown className="text-yellow-500 mb-2" size={24} strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-yellow-500 tracking-wider">ROYAL VAULT</h2>
          <span className="text-[7px] text-zinc-600 mt-1 tracking-widest uppercase">1% Elite Truth</span>
        </motion.div>

        {/* CITIZEN HALL (Universe) */}
        <motion.div whileTap={{ scale: 0.96 }} className="border border-white/10 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-white">
          <Globe className="text-white mb-2" size={24} strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-white tracking-wider">CITIZEN HALL</h2>
          <span className="text-[7px] text-zinc-600 mt-1 tracking-widest uppercase">Free Library</span>
        </motion.div>

        {/* PULSE (Vortex) */}
        <motion.div whileTap={{ scale: 0.96 }} className="border border-cyan-400/20 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-cyan-400">
          <Zap className="text-cyan-400 mb-2" size={24} strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-cyan-400 tracking-wider">PULSE</h2>
          <span className="text-[7px] text-zinc-600 mt-1 tracking-widest uppercase">Viral Trends</span>
        </motion.div>

        {/* MASTER ACADEMY (Skills) */}
        <motion.div whileTap={{ scale: 0.96 }} className="border border-purple-500/20 py-6 px-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-lg active:border-purple-500">
          <Cpu className="text-purple-400 mb-2" size={24} strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-purple-400 tracking-wider">ACADEMY</h2>
          <span className="text-[7px] text-zinc-600 mt-1 tracking-widest uppercase">Tech Mastery</span>
        </motion.div>

      </div>

      <footer className="mt-auto py-10 text-[7px] text-zinc-800 tracking-[0.8em] uppercase">
        Engine 60.0 • Sovereign Scale
      </footer>
    </main>
  );
}
