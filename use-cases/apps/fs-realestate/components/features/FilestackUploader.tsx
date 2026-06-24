"use client";

import { FC, useCallback, useRef, useState } from "react";
import { Upload, ImagePlus, FilePlus2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IFilestackUploaderProps, IUploadedImage } from "@/interfaces/listing.interface";

const FILESTACK_STORE_URL = "https://www.filestackapi.com/api/store/S3";

interface IUploadingFile {
  id: string;
  name: string;
  error?: string;
}

export const FilestackUploader: FC<IFilestackUploaderProps> = ({
  onUploadDone,
  maxFiles = 10,
  mode = "image",
}) => {
  const isDocument = mode === "document";
  const accept = isDocument ? undefined : "image/*";
  const Icon = isDocument ? FilePlus2 : ImagePlus;
  const idleTitle = isDocument ? "Click or drag documents here" : "Click or drag photos here";
  const subtitle = isDocument
    ? `PDF, DOC, XLS, images — anything · up to ${maxFiles} remaining`
    : `Select multiple files at once · up to ${maxFiles} remaining · JPG, PNG, WebP`;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<IUploadingFile[]>([]);

  const uploadOne = useCallback(async (file: File): Promise<IUploadedImage> => {
    const apiKey = process.env.NEXT_PUBLIC_FILESTACK_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_FILESTACK_API_KEY is not set");
    }

    const url = `${FILESTACK_STORE_URL}?key=${apiKey}&filename=${encodeURIComponent(file.name)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });

    if (!res.ok) {
      throw new Error(`Upload failed (${res.status})`);
    }

    const data = (await res.json()) as {
      url: string;
      size: number;
      type: string;
      filename: string;
      key: string;
    };

    const handle = data.url.split("/").pop() ?? "";

    return {
      handle,
      url: data.url,
      filename: data.filename,
      mimetype: data.type,
      size: data.size,
    };
  }, []);

  const handleFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const files = Array.from(incoming)
        .filter((f) => (isDocument ? true : f.type.startsWith("image/")))
        .slice(0, maxFiles);
      if (files.length === 0) return;

      const tickets: IUploadingFile[] = files.map((f) => ({
        id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
      }));
      setUploading((prev) => [...prev, ...tickets]);

      const results = await Promise.all(
        files.map(async (file, i) => {
          try {
            const uploaded = await uploadOne(file);
            setUploading((prev) => prev.filter((t) => t.id !== tickets[i].id));
            return uploaded;
          } catch (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            setUploading((prev) =>
              prev.map((t) => (t.id === tickets[i].id ? { ...t, error: message } : t)),
            );
            return null;
          }
        }),
      );

      const successful = results.filter((r): r is IUploadedImage => r !== null);
      if (successful.length > 0) onUploadDone(successful);
    },
    [isDocument, maxFiles, onUploadDone, uploadOne],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        void handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) void handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles],
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 transition-all outline-none focus-visible:ring-4 focus-visible:ring-rose-500/20",
          isDragging
            ? "border-rose-500 bg-rose-50/60 scale-[1.01]"
            : "border-slate-200 bg-slate-50/50 hover:border-rose-400 hover:bg-slate-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl transition-transform",
            isDragging ? "bg-rose-500/20 scale-110" : "bg-rose-500/10 group-hover:scale-110",
          )}
        >
          <Icon className="h-7 w-7 text-rose-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">
            {isDragging ? "Drop to upload" : idleTitle}
          </p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          <Upload className="h-3 w-3" />
          Powered by Filestack
        </div>
      </div>

      {uploading.length > 0 && (
        <ul className="space-y-2">
          {uploading.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
            >
              {t.error ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              ) : (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-rose-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">
                  {t.error ? t.error : "Uploading…"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};