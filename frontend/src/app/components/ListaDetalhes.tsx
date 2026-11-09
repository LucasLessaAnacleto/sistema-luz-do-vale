interface Campo {
    label: string;
    value: string;
}

interface Props {
    campos: Campo[];
    larguraLabel?: string;
}

export default function ListaDetalhes({ campos }: Props) {

    return (
        <dl className="divide-y divide-border">
            {campos.map((campo) => (

                <div key={campo.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[160px_minmax(0,1fr)]">
                    
                    <dt className="text-xs leading-5 text-muted-foreground">{campo.label}</dt>
                    <dd className="break-words text-sm">{campo.value}</dd>

                </div>
            ))}
        </dl>
    );
}