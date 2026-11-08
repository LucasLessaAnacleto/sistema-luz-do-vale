interface OpcaoFiltro {
  valor: string;
  label: string;
}

interface Props {
  valor: string;
  opcoes: OpcaoFiltro[];
  onChange: (valor: string) => void;
}

export default function BudgetFiltros({ valor, opcoes,  onChange }: Props) {
  
    return (
    <div className="flex gap-2">

      {opcoes.map((opcao) => (

        <button key={opcao.valor} onClick={() => onChange(opcao.valor)}
          className={`cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-colors
            ${valor === opcao.valor ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          {opcao.label}
        </button>

      ))}

    </div>
  );
}