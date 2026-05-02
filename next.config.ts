import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    '.space-z.ai',
    'preview-chat-76234511-4cd3-4504-91c3-1c29013b21be.space-z.ai',
  ],
};

export default nextConfig;
