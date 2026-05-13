import type { Metadata } from "next"; 

export const metadata: Metadata = {
  title: "VEXTONY MASTER ENGINE",
  description: "The absolute multi-dimensional data and AI ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#000000", color: "#ffffff", margin: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
