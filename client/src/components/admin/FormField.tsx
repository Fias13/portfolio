import { useId, useState, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { X } from "lucide-react";

function Label({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm focus:border-brand-500 dark:border-ink-700 dark:bg-ink-950";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, required, id, ...props }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div>
      <Label htmlFor={fieldId} label={label} required={required} />
      <input id={fieldId} required={required} className={baseInput} aria-invalid={!!error} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({ label, error, required, rows = 4, id, ...props }: TextAreaFieldProps) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div>
      <Label htmlFor={fieldId} label={label} required={required} />
      <textarea id={fieldId} required={required} rows={rows} className={`${baseInput} resize-y`} aria-invalid={!!error} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
}

export function SelectField({ label, options, required, id, ...props }: SelectFieldProps) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <div>
      <Label htmlFor={fieldId} label={label} required={required} />
      <select id={fieldId} required={required} className={baseInput} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-ink-200 px-3.5 py-2.5 dark:border-ink-700">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-ink-500 dark:text-ink-400">{description}</span>}
      </span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-brand-600" : "bg-ink-300 dark:bg-ink-700"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </label>
  );
}

export function TagsField({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const fieldId = useId();

  const addTag = () => {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  };

  return (
    <div>
      <Label htmlFor={fieldId} label={label} />
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-ink-200 p-2 dark:border-ink-700">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-md bg-ink-100 px-2 py-1 text-xs font-medium dark:bg-ink-800">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={fieldId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}
