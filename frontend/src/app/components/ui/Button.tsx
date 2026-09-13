import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export default function Button({
  children, loading = false, loadingText = "Aguarde...", disabled,
  className = "", type = "button", ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-medium text-white transition duration-200 enabled:cursor-pointer enabled:hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none ${className}`}
    >
      {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />}
      {loading ? loadingText : children}
    </button>
  );
}
