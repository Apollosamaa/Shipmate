import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, //on debug mode only
  images: {
    domains: ["lh3.googleusercontent.com"],

  }
};

export default nextConfig;
