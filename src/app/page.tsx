"use client";

import React, { useState } from "react";

export default function VextonyMasterPage() {
  const [status, setStatus] = useState("VEXTONY ENGINE ARMED & OPERATIONAL");

  return (
    <main style={{
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      backgroundColor: "#000000",
      height: "100vh",
      boxSizing: "border-box"
    }}>
      <div style={{
        border: "1px solid rgba(214, 175, 55, 0.3)",
        backgroundColor: "#0a0a0a",
        padding: "32px",
        borderRadius: "16px",
        textAlign: "center",
        maxWidth: "600px",
        width: "100%"
      }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "#D4AF37",
          marginBottom: "16px",
          marginTop: "0"
        }}>
          👑 VEXTONY MASTER ENGINE
        </h1>
        <div style={{ height: "1px", width: "100%", backgroundColor: "rgba(214, 175, 55, 0.2)", margin: "16px 0" }} />
        <p style={{ color: "#a3a3a3", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "24px" }}>
          STATUS: <span style={{ color: "#4ade80", fontWeight: "bold" }}>{status}</span>
        </p>
        <button 
          onClick={() => setStatus("COMPILING ALL 209 MASTER NODES... SUCCESS.")}
          style={{
            padding: "12px 24px",
            border: "1px solid #D4AF37",
            borderRadius: "8px",
            backgroundColor: "transparent",
            color: "#D4AF37",
            fontFamily: "monospace",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s"
          }}
        >
          EXECUTE SYSTEM CORE COMMAND
        </button>
      </div>
    </main>
  );
}
