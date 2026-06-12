import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dev server lewat tunnel Cloudflare.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
