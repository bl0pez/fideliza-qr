const CLOUDINARY_HOST = "res.cloudinary.com";

// Matches /upload/ plus any existing transform segments up to the version number (/v123/)
// so cldUrl can replace them instead of chaining.
const UPLOAD_SEGMENT_RE = /\/upload\/((?:[^/]+\/)*?)(?=v\d+\/)/;

type CldOpts = {
  w?: number;
  h?: number;
  mode?: "fill" | "fit" | "scale";
  gravity?: "auto" | "face" | "center";
};

function injectTransform(url: string, params: string): string {
  if (UPLOAD_SEGMENT_RE.test(url)) {
    return url.replace(UPLOAD_SEGMENT_RE, `/upload/${params}/`);
  }
  // Fallback for URLs without a /v<version>/ segment
  return url.replace("/upload/", `/upload/${params}/`);
}

export function cldUrl(url: string | null | undefined, opts: CldOpts = {}): string {
  if (!url || !url.includes(CLOUDINARY_HOST)) return url ?? "";
  const params: string[] = ["f_auto", "q_auto"];
  if (opts.mode) params.push(`c_${opts.mode}`);
  if (opts.gravity) params.push(`g_${opts.gravity}`);
  if (opts.w) params.push(`w_${opts.w}`);
  if (opts.h) params.push(`h_${opts.h}`);
  return injectTransform(url, params.join(","));
}

/**
 * Call this in the upload widget's onSuccess before persisting to DB.
 * Converts to WebP and applies quality optimization. The render helpers
 * (cldHero, cldCard, cldThumb) will replace these transforms with their own
 * size+crop params, so no double-transform occurs at render time.
 */
export function cldForStorage(url: string): string {
  if (!url.includes(CLOUDINARY_HOST)) return url;
  return injectTransform(url, "f_webp,q_auto,c_limit,w_2000")
    .replace(/\.(jpe?g|png|gif|bmp|tiff|avif)$/i, ".webp");
}

export const cldHero  = (u?: string | null) => cldUrl(u, { mode: "fill", gravity: "auto", w: 1600, h: 900 });
export const cldCard  = (u?: string | null) => cldUrl(u, { mode: "fill", gravity: "auto", w: 800,  h: 600 });
export const cldThumb = (u?: string | null) => cldUrl(u, { mode: "fill", gravity: "auto", w: 120,  h: 120 });
