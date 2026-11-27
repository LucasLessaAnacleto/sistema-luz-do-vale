import type { InputHTMLAttributes } from "react";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Toggle({ label, ...props }: ToggleProps) {

    return (
        <label className="relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-input-background px-4 py-3">

            <span className="text-sm">
                {label}
            </span>

            <input {...props} type="checkbox" className="peer sr-only" />

            <span
                className="
                    relative h-6 w-11 shrink-0 rounded-full bg-zinc-300 transition-colors
                    after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5
                    after:rounded-full after:bg-white after:transition-transform after:content-['']
                    peer-checked:bg-primary peer-checked:after:translate-x-5
                    peer-focus-visible:ring-2 peer-focus-visible:ring-ring
                "
            />

        </label>
    );
}
