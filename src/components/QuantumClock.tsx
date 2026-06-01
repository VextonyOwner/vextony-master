"use client";

/**
 * VEXTONY CORE INFRASTRUCTURE: MULTI-TENANT VISUAL CLOCK SYSTEM
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: VISUAL COMPONENT VAULT]
 * [ARCHITECTURE STANDARD: NEXT.JS 14+ APP LAYER - COMPONENT ISOLATION SYSTEM]
 */

import React, { useState, useEffect } from "react";

export default function QuantumClock() {
  const [liveSystemTime, setLiveSystemTime] = useState<string>("");

  useEffect(() => {
    // Client-side execution loop ensuring zero server dehydration sync drifts natively
    const executeTimeUpdateLoop = () => {
      const currentRawDate = new Date();
      setLiveSystemTime(currentRawDate.toLocaleTimeString());
    };

    executeTimeUpdateLoop();
    const globalIntervalThreadId = setInterval(executeTimeUpdateLoop, 1000);

    return () => clearInterval(globalIntervalThreadId);
  }, []);

  return (
    <div style={{
      padding: "16px 24px",
      backgroundColor: "#0d0d0d",
      borderRadius: "12px",
      border: "1px solid #1a1a1a",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "200px",
      boxSizing: "border-box"
    }}>
      <span style={{
        color: "#D4AF37",
        fontFamily: "monospace",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "2px"
      }}>
        {liveSystemTime || "SYNCHRONIZING..."}
      </span>
    </div>
  );
}
