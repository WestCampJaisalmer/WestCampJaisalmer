/**
 * next/image refuses to render hosts that aren't whitelisted in next.config.js, which would break
 * the whole page. So only same-site paths and the whitelisted hosts are accepted from the admin.
 * Keep this list in sync with `images.remotePatterns` in next.config.js.
 */
export const ALLOWED_IMAGE_HOSTS = ["ik.imagekit.io", "images.unsplash.com"];

export function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export const IMAGE_URL_ERROR = "Upload the image here, or use a site path (/images/…) or an ImageKit / Unsplash link.";
