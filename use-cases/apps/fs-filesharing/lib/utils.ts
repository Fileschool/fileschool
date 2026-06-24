export const MAX_FILE_BYTES = 500 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isVideoMime(mime: string): boolean {
  return mime.startsWith("video/");
}

export function isAudioMime(mime: string): boolean {
  return mime.startsWith("audio/");
}

export function isPdfMime(mime: string): boolean {
  return mime === "application/pdf";
}

export function fileIconKind(
  mime: string,
): "image" | "video" | "audio" | "pdf" | "file" {
  if (isImageMime(mime)) return "image";
  if (isVideoMime(mime)) return "video";
  if (isAudioMime(mime)) return "audio";
  if (isPdfMime(mime)) return "pdf";
  return "file";
}
