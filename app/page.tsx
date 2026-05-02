"use client";

export default function VextonyHome() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6 overflow-hidden font-sans">
      
      {/* 3D VEXTONY LOGO - PURE CSS ARCHITECTURE */}
      <div className="mt-20 mb-14 relative">
        <h1
          className="text-5xl md:text-8xl font-black tracking-[0.2em] text-center uppercase"
          style={{
            textShadow: "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",
            color: "#FFFFFF"
          }}
        >
          VEXTONY
        </h1>
        <div className="absolute -inset-1 bg-yellow-600/10 blur-3xl opacity-20 pointer-events-none"></div>
      </div>

      <p className="text-[9px] text-zinc-500 tracking-[0.6em] uppercase mb-12 text-center font-light">
        The Sovereign Era
      </p>

      {/* 4 STRATEGIC PORTALS - MOBILE OPTIMIZED GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
        
        {/* SOVEREIGN - Elite Vault */}
        <div className="border border-yellow-600/20 py-8 px-4 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform duration-200 cursor-pointer">
          <h2 className="text-xl font-bold text-yellow-500 tracking-wider">SOVEREIGN</h2>
          <span className="text-[8px] text-zinc-600 mt-2 tracking-widest uppercase font-mono">Elite Vault</span>
        </div>

        {/* UNIVERSE - Open Library */}
        <div className="border border-white/5 py-8 px-4 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform duration-200 cursor-pointer">
          <h2 className="text-xl font-bold text-white tracking-wider">UNIVERSE</h2>
          <span className="text-[8px] text-zinc-600 mt-2 tracking-widest uppercase font-mono">Open Library</span>
        </div>

        {/* VORTEX - Viral Trends */}
        <div className="border border-cyan-400/10 py-8 px-4 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform duration-200 cursor-pointer">
          <h2 className="text-xl font-bold text-cyan-400 tracking-wider">VORTEX</h2>
          <span className="text-[8px] text-zinc-600 mt-2 tracking-widest uppercase font-mono">Viral Trends</span>
        </div>

        {/* TECH SKILLS - AI Mastery */}
        <div className="border border-purple-500/20 py-8 px-4 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform duration-200 cursor-pointer">
          <h2 className="text-xl font-bold text-purple-400 tracking-wider text-center leading-tight">TECH SKILLS</h2>
          <span className="text-[8px] text-zinc-600 mt-2 tracking-widest uppercase font-mono text-center">AI & Tech Mastery</span>
        </div>

      </div>

      <footer className="mt-auto py-12 text-[7px] text-zinc-800 tracking-[1em] uppercase font-medium">
        Engine 60.0 • Trillion Scale
      </footer>
    </main>
  );
}
