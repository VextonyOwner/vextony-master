/**
 * VEXTONY ENGINE: HIGH-PRECISION QUANTUM CHRONO SYNCHRONIZER
 * [STATUS: ARMED & PRODUCTION-READY] | [PRIVILEGE: FRONTIER VISUAL CLOCK]
 */

"use client";

import React, { useEffect, useState, useRef } from "react";
import { VextonyEngineRuntime } from "./master_logic";

export interface IChronoState {
  utcString: string;
  unixEpoch: number;
  systemHealth: string;
}

export default function QuantumClock() {
  const [chronoData, setChronoData] = useState<IChronoState>({
    utcString: "00:00:00 UTC",
    unixEpoch: Date.now(),
    systemHealth: "INITIALIZING"
  });

  const requestRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  /**
   * High-precision render loop hooked into the browser's hardware-refresh cycle
   */
  const renderHeartbeat = (timestamp: number) => {
    const now = Date.now();
    
    // Throttle state update intervals to 100ms to eliminate unnecessary DOM stress
    if (now - lastUpdateRef.current >= 100) {
      lastUpdateRef.current = now;
      
      const metrics = VextonyEngineRuntime.validateSystemInvariants();
      const currentDate = new Date(now);

      setChronoData({
        utcString: currentDate.toUTCString(),
        unixEpoch: now,
        systemHealth: metrics.isSystemStable ? "OPERATIONAL" : "CONGESTED"
      });
    }

    requestRef.current = requestAnimationFrame(renderHeartbeat);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(renderHeartbeat);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      fontFamily: "monospace",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: "#0A0A0A",
      border: "1px solid rgba(214, 175, 55, 0.15)",
      maxWidth: "320px",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ fontSize: "11px", color: "#AA7C11", letterSpacing: "1px", marginBottom: "4px" }}>
        SYSTEM TEMPORAL VECTOR
      </div>
      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#D4AF37", margin: "4px 0" }}>
        {chronoData.utcString}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "10px", color: "#737373" }}>
        <span>EPOCH: {chronoData.unixEpoch}</span>
        <span style={{ color: chronoData.systemHealth === "OPERATIONAL" ? "#4ade80" : "#ef4444", fontWeight: "bold" }}>
          {chronoData.systemHealth}
        </span>
      </div>
    </div>
  );
}
