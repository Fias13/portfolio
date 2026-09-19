import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "blockquote", "code-block"],
    ["clean"],
  ],
};

export default function RichTextEditor({ value, onChange, label }: { value: string; onChange: (html: string) => void; label?: string }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
      <div className="quill-content overflow-hidden rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-950">
        <ReactQuill theme="snow" value={value} onChange={onChange} modules={MODULES} />
      </div>
    </div>
  );
}
