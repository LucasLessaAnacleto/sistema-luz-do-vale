"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Brand from "@/app/components/Brand";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import SessionStatus from "@/app/components/SessionStatus";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUsuario, setStatus, logout } from "@/app/redux/slices/authSlice";
import { loginService, buscarUsuarioLogado } from "@/app/services/authService";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
  const router = useRouter();


  useEffect(() => {
    if (status !== "verificando") return;
    let cancelado = false;

    async function verificarSessao() {
      try {
        const usuario = await buscarUsuarioLogado();
        if (cancelado) return;
        if (usuario) {
          dispatch(setUsuario({ usuario }));
        } else {
          dispatch(logout());
        }
      } catch {
        if (!cancelado) dispatch(setStatus("erro"));
      }
    }

    void verificarSessao();
    return () => { cancelado = true; };
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "autenticado") router.replace("/home");
  }, [status, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const dados = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");
    try {
      const { usuario } = await loginService({
        email: String(dados.get("email") ?? ""),
        senha: String(dados.get("senha") ?? ""),
      });
      dispatch(setUsuario({ usuario }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (status !== "naoAutenticado") return <SessionStatus erro={status === "erro"} onTentarNovamente={() => dispatch(setStatus("verificando"))} />;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="login-panel w-full max-w-md" aria-labelledby="login-title">
        <header className="mb-10 text-center">
          <Brand />
          <h1 id="login-title" className="mb-1 text-3xl font-semibold">Bem-vindo</h1>
          <p className="text-sm text-muted-foreground">Luz do Vale · Sistema de Reabilitação</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
          <Input label="Email" id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="seu@email.com" icon={<Mail className="h-5 w-5" />} required disabled={loading} />
          <Input label="Senha" id="password" name="senha" type="password" autoComplete="current-password" placeholder="••••••••" icon={<Lock className="h-5 w-5" />} required disabled={loading} />
          <button type="button" disabled={loading} className="cursor-pointer rounded text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60" onClick={() => setMessage("Para recuperar sua senha, entre em contato com a administração da instituição.")}>
            Esqueceu sua senha?
          </button>
          <Button type="submit" className="w-full" loading={loading} loadingText="Entrando...">Entrar</Button>
          <p role="status" aria-live="polite" aria-atomic="true" className={message ? "text-center text-sm text-muted-foreground" : "sr-only"}>{message}</p>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">Precisa de ajuda? Entre em contato com o suporte</p>
      </section>
    </main>
  );
}
