import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = "", ...props }: Props) {

  return (
    <div {...props} className={`rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}