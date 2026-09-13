"use client";

import React, { useState, useRef } from "react";
import { getMediaLibrary } from "@/lib/actions/admin";
import type { MediaItem } from "@/types/database";
import { UploadCloud, Image as ImageIcon, Video, X, Check } from "lucide-react";

interface MediaUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string, mediaType?: "image" | "video") => void;
  mediaType?: "image" | "video" | "both";
  folder?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export default function MediaUploadInput({
  label,
  value,
  onChange,
  mediaType = "image",
  folder = "general",
  placeholder = "https://... or /assets/images/...",
  helperText,
  required = false,
}: MediaUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = 
    mediaType === "video" || 
    value.endsWith(".mp4") || 
    value.endsWith(".webm") || 
    value.endsWith(".mov") ||
    value.includes("video");

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload file.");
      }

      onChange(data.url, data.mediaType);
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    setLoadingLibrary(true);
    try {
      const items = await getMediaLibrary();
      setLibraryItems(items);
    } catch (err: any) {
      console.error("Failed to load media library:", err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const selectFromLibrary = (item: MediaItem) => {
    const detectedType = item.mime_type?.startsWith("video/") || item.public_url.endsWith(".mp4") ? "video" : "image";
    onChange(item.public_url, detectedType);
    setLibraryOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Clear Media
          </button>
        )}
      </div>

      {/* Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
        />

        <div className="flex items-center gap-2">
          {/* Direct File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept={mediaType === "video" ? "video/*" : mediaType === "image" ? "image/*" : "image/*,video/*"}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id={`upload-${label.replace(/[^a-zA-Z0-9]/g, "-")}`}
          />
          <label
            htmlFor={`upload-${label.replace(/[^a-zA-Z0-9]/g, "-")}`}
            className={`px-3 py-2 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{uploading ? "Uploading..." : "Upload File"}</span>
          </label>

          {/* Select from Media Library */}
          <button
            type="button"
            onClick={openLibrary}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Library</span>
          </button>
        </div>
      </div>

      {helperText && <p className="text-[11px] text-neutral-500">{helperText}</p>}

      {/* Live Preview */}
      {value && (
        <div className="relative mt-2 p-2 bg-black/40 border border-white/10 rounded-lg max-w-md">
          {isVideo ? (
            <video
              src={value}
              controls
              className="w-full h-44 object-contain rounded bg-black"
            />
          ) : (
            <div className="h-44 w-full rounded overflow-hidden bg-black/50 flex items-center justify-center">
              <img
                src={value}
                alt="Media Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-[#c5a059] border border-[#c5a059]/30">
            {isVideo ? "Video Media" : "Image Media"}
          </span>
        </div>
      )}

      {/* Media Library Modal Picker */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#c5a059]" />
                <span>Select Asset from Media Library</span>
              </h3>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="text-neutral-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {loadingLibrary ? (
              <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                Loading brand assets from Supabase...
              </div>
            ) : libraryItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 font-mono">
                No assets found in media library. Click "Upload File" to upload from your computer.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-1">
                {libraryItems.map((item) => {
                  const isSelected = item.public_url === value;
                  const itemIsVideo = item.mime_type?.startsWith("video/") || item.public_url.endsWith(".mp4");
                  return (
                    <div
                      key={item.id}
                      onClick={() => selectFromLibrary(item)}
                      className={`group relative aspect-square bg-[#1c1c1c] rounded border overflow-hidden cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#c5a059] ring-2 ring-[#c5a059]/50"
                          : "border-white/10 hover:border-[#c5a059]/60"
                      }`}
                    >
                      {itemIsVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-gold">
                          <Video className="w-6 h-6 mb-1" />
                          <span className="text-[9px] uppercase font-mono">Video</span>
                        </div>
                      ) : (
                        <img
                          src={item.public_url}
                          alt={item.file_name}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5">
                        <p className="text-[10px] text-white font-mono truncate">{item.file_name}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-[#c5a059] text-black">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
