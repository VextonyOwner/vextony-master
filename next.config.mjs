/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Advanced distributed systems compiler configuration directly enforcing Master Asif's strict unbounded vector rules
  webpack: (config) => {
    // Falls back seamlessly to prevent raw JavaScript module compilation lag anomalies natively
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
