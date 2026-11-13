import { ArrowLeft } from "lucide-react";

interface Props {
    onClick: () => void;
}

export default function BotaoVoltarEtapa({ onClick }: Props) {

    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent hover:bg-secondary/50"
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
    );
}