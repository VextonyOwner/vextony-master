"use client";

import React, { useState, useEffect } from "react";
import { ARMORY_INVENTORY, ArmoryProduct } from "../../vault/armory-inventory";

export default function ArmoryViewport() {
  const [selectedCategory, setSelectedCategory] = useState<string>("SHADOW OPS");
  const [products, setProducts] = useState<ArmoryProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = Array.from(new Set(ARMORY_INVENTORY.map((p) => p.category)));

  useEffect(() => {
    const filtered = ARMORY_INVENTORY.filter(
      (p) => p.category === selectedCategory && 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.task.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setProducts(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans selection:bg-[#00ffcc] selection:text-black">
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00ffcc] to-[#ff007f] uppercase mb-4">
          VEXTONY Ω — The Armory Core
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto mb-6">
          Sovereign Architect v60 Engine. 35 Dynamic Sub-Channels Synced with Zero Latency Execution Layer Grid.
        </p>
        <input
          type="text"
          placeholder="Predictive Core Search... (e.g., Payload, Proxy, Token)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xl bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ffcc] focus:ring-1 focus:ring-[#00ffcc] transition-all backdrop-blur-md"
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((btn) => (
          <button
            key={btn}
            onClick={() => setSelectedCategory(btn)}
            className={`px-4 py-2 rounded-xl font-bold tracking-wide text-[11px] uppercase transition-all duration-300 backdrop-blur-md border ${
              selectedCategory === btn
                ? "bg-gradient-to-r from-[#00ffcc]/20 to-[#ff007f]/20 border-[#00ffcc] text-[#00ffcc] shadow-[0_0_15px_rgba(0,255,204,0.3)]"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="relative group rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.07] to-transparent p-6 overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-[#00ffcc]/30 hover:shadow-[0_0_30px_rgba(0,255,204,0.1)] hover:-translate-y-1"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-[#00ffcc]/0 via-[#ff007f]/0 to-[#00ffcc]/0 group-hover:from-[#00ffcc]/10 group-hover:to-[#ff007f]/10 transition-all duration-500 rounded-2xl -z-10" />

              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold tracking-widest text-[#ff007f] uppercase bg-[#ff007f]/10 px-2.5 py-1 rounded-md border border-[#ff007f]/20">
                  {product.id}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                  {product.aiEngine}
                </span>
              </div>

              <h3 className="text-xl font-bold tracking-wide text-white group-hover:text-[#00ffcc] transition-colors duration-300 mb-2">
                {product.name}
              </h3>

              <p className="text-gray-400 text-xs leading-relaxed min-h-[48px] mb-5">
                {product.task}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Price Tier</span>
                  <span className="text-sm font-extrabold text-[#00ffcc] tracking-wide">{product.price}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Credit Cost</span>
                  <span className="text-sm font-bold text-gray-300">{product.creditCost} Units</span>
                </div>
              </div>

              <button className="w-full mt-5 bg-white/5 hover:bg-gradient-to-r hover:from-[#00ffcc] hover:to-[#ff007f] hover:text-black text-white font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 border border-white/10 hover:border-transparent">
                Activate Quantum Agent
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <p className="text-gray-500 text-sm">No quantum products found matching the criteria nodes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
