import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEXTONY | Sovereign Era",
  description: "The 1% Elite Knowledge Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
