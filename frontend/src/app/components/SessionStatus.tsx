import Button from "./ui/Button";

interface SessionStatusProps {
  erro?: boolean;
  onTentarNovamente?: () => void;
}

export default function SessionStatus({ erro = false, onTentarNovamente }: SessionStatusProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <p role="status">{erro ? "Não foi possível verificar sua sessão. Tente novamente." : "Verificando acesso..."}</p>
      {erro && <Button onClick={onTentarNovamente}>Tentar novamente</Button>}
    </main>
  );
}
