interface Props {
  texto: string;
  tipo?: "sucesso" | "alerta" | "neutro";
}

export default function BadgeStatus({ texto, tipo = "neutro" }: Props) {

  const estilos = {
    sucesso: "border-primary/20 bg-primary/10 text-primary-dark",
    alerta: "border-amber-200 bg-amber-50 text-amber-800",
    neutro: "border-border bg-secondary/20 text-muted-foreground",
  };

  return (
    <span className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${estilos[tipo]}`}>
      {texto}
    </span>
  );
}