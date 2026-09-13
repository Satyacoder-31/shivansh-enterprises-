"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { saveMediaRecord, deleteMediaFile } from "@/lib/actions/admin";
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  ExternalLink, 
  FileImage, 
  Folder,
  FolderOpen
} from "lucide-react";

export default function MediaManagerClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<string>("products");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = [
    { id: "all", label: "All Media" },
    { id: "products", label: "Products" },
    { id: "hero", label: "Hero Slides" },
    { id: "gallery", label: "Gallery" },
    { id: "logos", label: "Branding / Logos" },
    { id: "general", label: "General Assets" },
  ];

  const filteredMedia = mediaList.filter(item => {
    const matchesFolder = selectedFolder === "all" || item.folder === selectedFolder;
    const matchesSearch = 
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const supabase = createClient();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${uploadFolder}/${Date.now()}_${cleanName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("website-media")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          alert(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("website-media")
          .getPublicUrl(filePath);

        const newRecord = await saveMediaRecord({
          file_name: cleanName,
          storage_path: filePath,
          public_url: publicUrlData.publicUrl,
          mime_type: file.type,
          file_size: file.size,
          folder: uploadFolder,
          alt_text: cleanName.split(".")[0],
          caption: null
        });

        setMediaList(prev => [newRecord, ...prev]);
      }
      router.refresh();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, path: string, name: string) => {
    if (!confirm(`Permanently delete media file "${name}"?`)) return;
    try {
      await deleteMediaFile(id, path);
      setMediaList(prev => prev.filter(m => m.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const formatBytes = (bytes?: number | null) => {
    if (!bytes) return "Unknown";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Media Assets Library</h1>
          <p className="text-neutral-400 text-sm mt-1">High-resolution brand photos, product shots, hero media stored in Supabase</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-[#141414] border border-dashed border-[#c5a059]/40 hover:border-[#c5a059] rounded-lg p-6 text-center transition-colors">
        <div className="max-w-md mx-auto space-y-4">
          <UploadCloud className="w-10 h-10 mx-auto text-[#c5a059]" />
          <div>
            <h3 className="text-white font-medium text-sm">Upload High-Res Assets</h3>
            <p className="text-neutral-400 text-xs mt-1">Select folder destination and choose images (JPG, PNG, WebP, SVG)</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">Target Folder:</span>
            <select
              value={uploadFolder}
              onChange={e => setUploadFolder(e.target.value)}
              className="bg-black/60 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
            >
              <option value="products">products</option>
              <option value="hero">hero</option>
              <option value="gallery">gallery</option>
              <option value="logos">logos</option>
              <option value="general">general</option>
            </select>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,video/*"
              onChange={e => handleFileUpload(e.target.files)}
              className="hidden"
              id="media-file-input"
            />
            <label
              htmlFor="media-file-input"
              className={`btn-luxury inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-wider rounded-sm cursor-pointer ${
                uploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? "Uploading Assets..." : "Browse Local Files"}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Folder Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {folders.map(f => {
            const count = f.id === "all" ? mediaList.length : mediaList.filter(m => m.folder === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-mono rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedFolder === f.id
                    ? "bg-[#c5a059] text-black font-semibold"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {selectedFolder === f.id ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                <span>{f.label} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="group bg-[#141414] border border-white/5 rounded overflow-hidden flex flex-col hover:border-[#c5a059]/40 transition-all duration-200"
          >
            {/* Thumbnail Preview */}
            <div className="relative aspect-square bg-black/40 overflow-hidden flex items-center justify-center">
              <img
                src={item.public_url}
                alt={item.alt_text || item.file_name}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Quick Actions Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copyToClipboard(item.public_url, item.id)}
                  className="p-2 bg-white/10 hover:bg-[#c5a059] text-white hover:text-black rounded transition-colors cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={item.public_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                  title="View High-Res"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(item.id, item.storage_path, item.file_name)}
                  className="p-2 bg-white/10 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="p-2.5 flex-1 flex flex-col justify-between text-[11px]">
              <div>
                <p className="text-white font-medium truncate" title={item.file_name}>
                  {item.file_name}
                </p>
                <div className="flex items-center justify-between text-neutral-500 font-mono text-[10px] mt-1">
                  <span className="uppercase">{item.folder || "general"}</span>
                  <span>{formatBytes(item.file_size)}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => copyToClipboard(item.public_url, item.id)}
                  className="text-[10px] font-mono uppercase text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-16 text-center text-neutral-400 border border-dashed border-white/10 rounded">
            <FileImage className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#c5a059]" />
            <p className="text-base font-serif text-white">No media found</p>
            <p className="text-xs mt-1">Upload images using the box above to store in your Supabase media bucket.</p>
          </div>
        )}
      </div>
    </div>
  );
}
