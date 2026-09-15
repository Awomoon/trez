import type { NextConfig } from "next";

/**
 * The site is 100% client-side, so it exports to plain static files. That means
 * it can be dropped on any host — Vercel, Netlify, GitHub Pages, S3, a USB
 * stick — with no server and no environment variables.
 *
 * `NEXT_PUBLIC_BASE_PATH` covers the one case that needs it: hosting under a
 * sub-path, such as GitHub Pages at `<user>.github.io/trez`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  basePath,
  trailingSlash: true,
  images: {
    // No image optimiser exists in a static export.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["gsap"],
  },
};

export default nextConfig;
