interface Props {
    mensagem?: string;
}

export default function ErroCarregamento({ mensagem = "Não foi possível carregar os dados." }: Props) {

    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 flex items-center justify-center gap-3">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            
            <p>{mensagem}</p>
        </div>
    );
}