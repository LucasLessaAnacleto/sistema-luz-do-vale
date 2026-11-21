import ErroCarregamento from "@/app/components/ErroCarregamento";
import { indicadoresGerais } from "@/app/services/dashService";
import { DashResponse } from "@/app/types/dash";
import { cn } from "@/app/util";
import { Clock3, FileText, PenLine, Users } from "lucide-react";
import { useEffect, useState } from "react";
import MiniLoader from "./MiniLoader";

export default function IndicadoresGerais() {
    const [indicadores, setIndicadores] = useState<DashResponse | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarIndicadores(){
        try {
            setCarregando(true);
            setErro("");

            const dados = await indicadoresGerais();
            setIndicadores(dados);
        } catch(error) {
            setErro( error instanceof Error ? error.message : "Erro ao carregar indicadores.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarIndicadores();
    }, []);

    const indicators = [
        {
            label: "Pacientes ativos",
            value: indicadores?.pacientesAtivos,
            icon: Users,
            warning: false,
        },
        {
            label: "Média de acolhimento (dias)",
            value: indicadores?.mediaAcolhimentos,
            icon: Clock3,
            warning: false,
        },
        {
            label: "Documentos",
            value: indicadores?.qtdDocumentos,
            icon: FileText,
            warning: false,
        },
        {
            label: "Documentos pendentes",
            value: indicadores?.documentosPendentes,
            icon: PenLine,
            warning: true,
        },
    ];


    return (
        <>
            <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                {indicators.map(({ label, value, icon: Icon, warning }) => (
                    <div key={label} 
                        className={cn("flex flex-col rounded-xl border p-3 shadow-sm sm:p-4", 
                            warning ? "border-amber-200 bg-amber-50" : "border-border bg-primary/5",
                        )}
                    >
                        <Icon className={cn("mb-2 h-4 w-4", warning ? "text-amber-700" : "text-primary")} />
                        <dt className="order-2 text-xs leading-relaxed text-zinc-600">{label}</dt>
                        <dd className="mb-1 flex h-8 items-center text-2xl font-bold leading-tight tabular-nums">
                            {carregando ?  <MiniLoader />  : (value ?? "—")}
                        </dd>
                    </div>
                ))}
            </dl>
            {erro && (
                <ErroCarregamento mensagem={erro} onRetry={carregarIndicadores} />
            )}    
        </>
    )
}