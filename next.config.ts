import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // GitHub Pages requires static export; local dev uses standalone
  output: isGitHubPages ? "export" : "standalone",

  // GitHub Pages serves from repo subdirectory — only in production build
  basePath: isGitHubPages ? "/L-Alchimie-du-Miroir-2" : "",

  // Static export doesn't support image optimization
  images: {
    unoptimized: isGitHubPages,
  },

  // Trailing slash for GitHub Pages compatibility
  trailingSlash: isGitHubPages,

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
