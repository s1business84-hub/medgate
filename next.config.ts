import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.0.179", "localhost"],
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // /about and /faq are merged into the homepage; keep the old URLs working.
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/faq", destination: "/#faq", permanent: true },
    ];
  },
};

export default nextConfig;
