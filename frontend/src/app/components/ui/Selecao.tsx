import type { SelectHTMLAttributes, ReactNode } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export default function Selecao({ label, children, className = "", ...props}: Props) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <select {...props} className={`min-h-11 w-full rounded-xl border border-border bg-input-background px-4
          text-base text-foreground focus:ring-2 focus:ring-ring focus:outline-none ${className}
        `}
      >
        {children}
      </select>

    </div>
  );
}