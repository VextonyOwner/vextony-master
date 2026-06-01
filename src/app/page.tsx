"use client";

/**
 * VEXTONY CORE INFRASTRUCTURE: SOVEREIGN ROOT VIEW PORT CONTROLLER
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: PRIMARY HOMEPAGE MAIN INTERFACE]
 * [ARCHITECTURE STANDARD: NEXT.JS 14+ APP LAYER - CLEAN MODULE RE-ROUTING]
 */

import React from "react";
import DynamicFeed from "../components/DynamicFeed";
import QuantumClock from "../components/QuantumClock";

export default function SovereignHomePage() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#050505",
      padding: "24px",
      boxSizing: "border-box",
      gap: "24px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <h1 style={{ color: "#D4AF37", fontSize: "28px", margin: "0 0 8px 0", letterSpacing: "2px" }}>
          VEXTONY CORES ONLINE
        </h1>
        <p style={{ color: "#737373", fontSize: "12px", margin: 0, letterSpacing: "1px" }}>
          SYSTEM COMPLIANCE ARMED // ZERO RIBA ARCHITECTURE MATRIX
        </p>
      </div>

      {/* Synchronized Core Visual Modules fetched natively from the components vault */}
      <QuantumClock />
      <DynamicFeed />
    </main>
  );
}
