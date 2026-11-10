export default function CarregandoConteudo({ mensagem }: { mensagem?: string }) {
    return (
        <p className="py-8 text-center text-sm text-muted-foreground">
            {mensagem || "Carregando..."}
        </p>
    );
}