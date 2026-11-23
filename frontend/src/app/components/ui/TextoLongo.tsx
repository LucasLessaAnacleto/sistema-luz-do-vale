import { useId, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  descricao?: string | null;
}

export default function TextoLongo({ label, descricao, id, className = "", ...props }: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descricaoId = descricao ? inputId + "-descricao" : undefined;
  const descricaoCampo = [props["aria-describedby"], descricaoId].filter(Boolean).join(" ") || undefined;

  return (
    <div>

      <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      {descricao && (
        <p id={descricaoId} className="mb-2 text-sm text-muted-foreground">{descricao}</p>
      )}

      <textarea {...props} id={inputId} aria-describedby={descricaoCampo}
        className={`w-full resize-y rounded-xl border border-border bg-input-background px-4 py-3 text-base text-foreground
          focus:ring-2 focus:ring-ring focus:outline-none ${className}
        `}
      />

    </div>
  );
}