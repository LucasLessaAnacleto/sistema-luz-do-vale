import { useId, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export default function Input({ label, icon, id, className = "", ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div>
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium">{label}</label>
      <div className="relative">
        {icon && <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          {...props}
          id={inputId}
          className={`w-full rounded-xl border border-border bg-input-background py-3 pr-4 ${icon ? "pl-12" : "pl-4"} text-base text-foreground placeholder:text-muted-foreground transition duration-200 focus:border-transparent focus:ring-2 focus:ring-ring focus:outline-none disabled:opacity-60 motion-reduce:transition-none ${className}`}
        />
      </div>
    </div>
  );
}
