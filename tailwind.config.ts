import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./folders/**/*.{js,ts,jsx,tsx,mdx}" // তোর সেই ৩২টি ফোল্ডারের ভেতরের বাটন কানেক্টর পাথ
  ],
  theme: {
    extend: {
      colors: {
        vextonyGold: {
          light: "#F3E5AB",
          base: "#D4AF37", // রাজকীয় খাঁটি সোনা থিম কালার
          dark: "#AA7C11"
        },
        vextonyDark: {
          pure: "#000000",
          core: "#0A0A0A", // ওমেগা কোরের মূল ডার্ক ব্যাকগ্রাউন্ড
          shield: "#121212"
        }
      },
      animation: {
        'liquid-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-pulse': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
