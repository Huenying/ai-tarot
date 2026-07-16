import type { NextConfig } from "next";

const repo = "ai-tarot";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
