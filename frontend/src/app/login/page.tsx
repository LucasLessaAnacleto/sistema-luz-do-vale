"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Brand from "@/app/components/Brand";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import SessionStatus from "@/app/components/SessionStatus";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { LoginFormState } from "@/app/types/auth";
import { setToken, setUsuario } from "@/app/redux/slices/authSlice";
import { loginService } from "@/app/services/authService";



const initialState: LoginFormState = { email: "", senha: "", erro: "", tentativa: 0 };

export default function LoginPage() {
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (status === "autenticado") router.replace("/");
  }, [status, router]);

  async function loginAction(previousState: LoginFormState, dados: FormData): Promise<LoginFormState> {
    const email = String(dados.get("email") ?? "");
    const senha = String(dados.get("senha") ?? "");
    try {
      const { usuario, token } = await loginService({ email, senha });
      dispatch(setToken({ token }));
      dispatch(setUsuario({ usuario }));
      return initialState;
    } catch (error) {
      return {
        email,
        senha,
        erro: error instanceof Error ? error.message : "Não foi possível entrar. Tente novamente.",
        tentativa: previousState.tentativa + 1,
      };
    }
  }

  const [formState, formAction, isPending] = useActionState(loginAction, initialState);

  if (status !== "naoAutenticado") return <SessionStatus />;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="login-panel w-full max-w-md" aria-labelledby="login-title">
        <header className="mb-10 text-center">
          <Brand />
          <h1 id="login-title" className="mb-1 text-3xl font-semibold">Bem-vindo</h1>
          <p className="text-sm text-muted-foreground">Luz do Vale · Sistema de Reabilitação</p>
        </header>
        <form action={formAction} className="space-y-5" aria-busy={isPending}>
          <Input key={`email-${formState.tentativa}`} label="Email" id="email" name="email" type="email" defaultValue={formState.email} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="seu@email.com" icon={<Mail className="h-5 w-5" />} required disabled={isPending} />
          <Input key={`senha-${formState.tentativa}`} label="Senha" id="password" name="senha" type="password" defaultValue={formState.senha} autoComplete="current-password" placeholder="••••••••" icon={<Lock className="h-5 w-5" />} required disabled={isPending} />
          <details className="text-sm text-primary">
            <summary className="w-fit cursor-pointer rounded underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Esqueceu sua senha?</summary>
            <p className="mt-2 text-muted-foreground">Para recuperar sua senha, entre em contato com a administração da instituição.</p>
          </details>
          <Button type="submit" className="w-full" loading={isPending} loadingText="Entrando...">Entrar</Button>
          <p role="alert" aria-live="polite" aria-atomic="true" className={formState.erro ? "text-center text-sm text-muted-foreground" : "sr-only"}>{formState.erro}</p>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">Precisa de ajuda? Entre em contato com o suporte</p>
      </section>
    </main>
  );
}
