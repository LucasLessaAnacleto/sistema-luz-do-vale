interface Props {
  nome: string;
  tamanho?: "sm" | "md" | "lg";
}

function iniciais(nome: string) {
    return nome.trim().split(/\s+/).slice(0, 2)
        .map((palavra) => palavra.charAt(0).toUpperCase())
        .join("");
}

export default function AvatarIniciais({ nome, tamanho = "md"}: Props) {

    const tamanhos = {
        sm: "h-8 w-8 text-xs",
        md: "h-12 w-12 text-sm",
        lg: "h-16 w-16 text-base",
    };

    return (
        <span className={`flex shrink-0 items-center justify-center rounded-full bg-secondary
            font-medium text-foreground ${tamanhos[tamanho]}`}
        >
        {iniciais(nome)}
        </span>
    );
}