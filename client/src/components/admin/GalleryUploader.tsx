import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import { mediaApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";

export interface GalleryImage {
  url: string;
  caption?: string | null;
  sortOrder: number;
}

export default function GalleryUploader({ images, onChange }: { images: GalleryImage[]; onChange: (images: GalleryImage[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((f) => mediaApi.upload(f, "projects")));
      onChange([
        ...images,
        ...uploaded.map((m, i) => ({ url: m.url, caption: "", sortOrder: images.length + i })),
      ]);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const remove = (index: number) => onChange(images.filter((_, i) => i !== index));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next.map((img, i) => ({ ...img, sortOrder: i })));
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Gallery Images</label>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.url + i} className="group relative overflow-hidden rounded-lg border border-ink-200 dark:border-ink-700">
            <img src={img.url} alt="" className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
              <button type="button" onClick={() => move(i, i - 1)} className="rounded bg-white/20 p-1 text-white" aria-label="Move left">
                <GripVertical size={14} />
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded bg-red-600 p-1 text-white" aria-label="Remove image">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink-300 text-ink-400 hover:border-brand-400 hover:text-brand-500 dark:border-ink-700"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          <span className="text-[11px]">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
