import ErroCarregamento from "@/app/components/ErroCarregamento";
import { indicadoresGerais } from "@/app/services/dashService";
import { DashResponse } from "@/app/types/dash";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Clock3, FileText, PenLine, Users } from "lucide-react";
import { useEffect, useState } from "react";
import MiniLoader from "./MiniLoader";
import { mensagemErro } from "@/app/util";

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
            setErro(mensagemErro(error, "Erro ao carregar indicadores."));
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarIndicadores();
    }, []);

    const itens = [
        {
            label: "Pacientes ativos",
            valor: indicadores?.pacientesAtivos,
            icon: Users,
            alerta: false,
        },
        {
            label: "Média de acolhimento (dias)",
            valor: indicadores?.mediaAcolhimentos,
            icon: Clock3,
            alerta: false,
        },
        {
            label: "Documentos",
            valor: indicadores?.qtdDocumentos,
            icon: FileText,
            alerta: false,
        },
        {
            label: "Documentos pendentes",
            valor: indicadores?.documentosPendentes,
            icon: PenLine,
            alerta: true,
        },
    ];


    return (
        <>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                {itens.map(({ label, valor, icon: Icon, alerta }) => (
                    <div key={label}
                        className={twMerge(clsx("flex flex-col rounded-xl border p-3 shadow-sm sm:p-4",
                            alerta ? "border-amber-200 bg-amber-50" : "border-border bg-primary/5",
                        ))}
                    >
                        <Icon className={twMerge(clsx("mb-2 h-4 w-4", alerta ? "text-amber-700" : "text-primary"))} />
                        <p className="mb-1 flex h-8 items-center text-2xl font-bold leading-tight tabular-nums">
                            {carregando ?  <MiniLoader />  : (valor ?? "-")}
                        </p>
                        <p className="text-xs leading-relaxed text-zinc-600">{label}</p>
                    </div>
                ))}
            </div>
            {erro && (
                <ErroCarregamento mensagem={erro} onRetry={carregarIndicadores} />
            )}    
        </>
    )
}