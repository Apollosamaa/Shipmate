import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, //on debug mode only
  images: {
    domains: ["lh3.googleusercontent.com", "s.gravatar.com", "cdn.auth0.com"],

  }
};

export default nextConfig;
