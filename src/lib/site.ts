import type { Metadata } from "next";

/** Canonical public origin, used for canonical URLs, the sitemap, robots.txt and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.westcampjaisalmer.com").replace(/\/+$/, "");

export const SITE_NAME = "West Camp Jaisalmer";

/** Default social-share image (relative to SITE_URL). */
export const OG_IMAGE = "/images/banners/hero-fort.jpg";

/** Public, indexable pages. Admin and API routes are deliberately excluded. */
export const PUBLIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/camps-hotels", changeFrequency: "daily", priority: 0.9 },
  { path: "/tours-places", changeFrequency: "weekly", priority: 0.9 },
  { path: "/packages", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
] as const;

/** Per-page metadata. Canonical ignores query strings (?type=camp etc.) so filtered views don't compete. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description, siteName: SITE_NAME, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
