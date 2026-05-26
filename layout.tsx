import React from "react";

/**
 * VEXTONY CORE INFRASTRUCTURE: MASTER GLOBAL FRAMEWORK LAYOUT SYSTEM
 * [STATUS: OMNIPOTENT ULTRA-MAX PRODUCTION LIVE] | [PRIVILEGE: SYSTEM INGRESS EDGE VIEWPORT]
 */

export const metadata = {
  title: "Vextony Master Empire",
  description: "Sovereign Unbounded Multi-Tenant Autonomous Network Shell Core",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#000000" }}>
        {children}
      </body>
    </html>
  );
}
