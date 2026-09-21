/**
 * Prefix for anything served out of `public/`.
 *
 * GitHub Pages serves the site from a sub-path (`/trez`), and `next/image`
 * does not put `basePath` in front of a plain string src the way it does for
 * an imported file. Without this, every picture 404s in production while
 * working perfectly on a local build, which is exactly how it got missed.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return path.startsWith("/") ? `${base}${path}` : path;
}
