import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextoLongo({ label, className = "", ...props }: Props) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <textarea {...props}
        className={`w-full resize-y rounded-xl border border-border bg-input-background px-4 py-3 text-base text-foreground
          focus:ring-2 focus:ring-ring focus:outline-none ${className}
        `}
      />

    </div>
  );
}