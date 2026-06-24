/**
 * Filestack CDN transformation helpers.
 *
 * Transformation URLs follow the pattern:
 *   https://cdn.filestackcontent.com/[TASK]/[HANDLE]
 *
 * Tasks can be chained with forward slashes.
 */

const CDN_BASE = "https://cdn.filestackcontent.com";

export interface ITransformOptions {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "scale" | "max";
  quality?: number;
  format?: "webp" | "jpg" | "png" | "avif";
}

/**
 * Build a Filestack CDN URL with transformation tasks applied.
 */
export function getTransformedUrl(
  handle: string,
  options: ITransformOptions = {},
): string {
  const tasks: string[] = [];

  // Resize
  if (options.width || options.height) {
    const parts: string[] = [];
    if (options.width) parts.push(`width:${options.width}`);
    if (options.height) parts.push(`height:${options.height}`);
    if (options.fit) parts.push(`fit:${options.fit}`);
    tasks.push(`resize=${parts.join(",")}`);
  }

  // Quality
  if (options.quality) {
    tasks.push(`quality=value:${options.quality}`);
  }

  // Format
  if (options.format) {
    tasks.push(`output=format:${options.format}`);
  }

  if (tasks.length === 0) {
    return `${CDN_BASE}/${handle}`;
  }

  return `${CDN_BASE}/${tasks.join("/")}/${handle}`;
}

/** Preset transformation sizes for real estate images. */
export const imagePresets = {
  /** Thumbnail for grid cards — 400×270, cropped, webp */
  thumbnail: (handle: string) =>
    getTransformedUrl(handle, {
      width: 400,
      height: 270,
      fit: "crop",
      format: "webp",
      quality: 80,
    }),

  /** Card image — 600×400, cropped, webp */
  card: (handle: string) =>
    getTransformedUrl(handle, {
      width: 600,
      height: 400,
      fit: "crop",
      format: "webp",
      quality: 85,
    }),

  /** Hero/detail main image — 1200×800, cropped, webp */
  hero: (handle: string) =>
    getTransformedUrl(handle, {
      width: 1200,
      height: 800,
      fit: "crop",
      format: "webp",
      quality: 90,
    }),

  /** Gallery thumbnail — 200×150, cropped, webp */
  galleryThumb: (handle: string) =>
    getTransformedUrl(handle, {
      width: 200,
      height: 150,
      fit: "crop",
      format: "webp",
      quality: 75,
    }),

  /** Full-size original */
  full: (handle: string) => `${CDN_BASE}/${handle}`,
} as const;
