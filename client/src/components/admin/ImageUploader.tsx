import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { mediaApi } from "@/api/resources";
import { apiErrorMessage } from "@/api/client";

const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export default function ImageUploader({
  label,
  value,
  onChange,
  folder = "general",
}: {
  label: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const media = await mediaApi.upload(file, folder);
      onChange(media.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>
      {value ? (
        <div className="relative w-fit">
          <img src={value} alt="" className="h-32 w-32 rounded-lg border border-ink-200 object-cover dark:border-ink-700" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white shadow"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-ink-300 text-ink-400 hover:border-brand-400 hover:text-brand-500 dark:border-ink-700"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
          <span className="text-xs">{uploading ? "Uploading..." : "Upload"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
