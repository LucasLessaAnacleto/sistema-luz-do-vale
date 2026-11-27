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
import { setToken, setUsuario, logout } from "@/app/redux/slices/authSlice";
import { loginService } from "@/app/services/authService";
import { buscarUsuarioLogado } from "@/app/services/usuarioService";


const estadoInicial: LoginFormState = { email: "", senha: "", erro: "", tentativa: 0 };

export default function LoginPage() {
    const status = useAppSelector((state) => state.auth.status);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (status === "autenticado") router.replace("/");
    }, [status, router]);

    async function actionLogin(estadoAnterior: LoginFormState, dados: FormData): Promise<LoginFormState> {
        const email = String(dados.get("email") ?? "");
        const senha = String(dados.get("senha") ?? "");

        try {
            const { token } = await loginService({ email, senha });

            dispatch(setToken({ token }));

            const usuario = await buscarUsuarioLogado();

            dispatch(setUsuario({ usuario }));

            return estadoInicial;
        } catch {
            dispatch(logout());

            return {
                email,
                senha,
                erro: "E-mail ou senha incorretos.",
                tentativa: estadoAnterior.tentativa + 1,
            };
        }
    }

    const [estado, action, pending] = useActionState(actionLogin, estadoInicial);

    if (status !== "naoAutenticado") return <SessionStatus />;

    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <section className="login-panel w-full max-w-md">
                <header className="mb-10 text-center">
                    <Brand />
                    <h1 className="mb-1 text-3xl font-semibold">Bem-vindo</h1>
                    <p className="text-sm text-muted-foreground">Luz do Vale · Sistema de Reabilitação</p>
                </header>
                <form action={action} className="space-y-5">

                    <Input key={`email-${estado.tentativa}`} label="Email" id="email" name="email" type="email" 
                        defaultValue={estado.email} autoComplete="username"
                        placeholder="seu@email.com" icon={<Mail className="h-5 w-5" />} required disabled={pending} 
                    />
                    <Input key={`senha-${estado.tentativa}`} label="Senha" id="password" name="senha" type="password" 
                        defaultValue={estado.senha} autoComplete="current-password" placeholder="••••••••" 
                        icon={<Lock className="h-5 w-5" />} required disabled={pending} 
                    />

                    <details className="text-sm text-primary">
                        <summary className="w-fit cursor-pointer rounded underline-offset-4 hover:underline focus-visible:outline-2 
                            focus-visible:outline-offset-4 focus-visible:outline-primary">Esqueceu sua senha?</summary>
                        <p className="mt-2 text-muted-foreground">Para recuperar sua senha, entre em contato com a administração da instituição.</p>
                    </details>
                    <Button type="submit" className="w-full" loading={pending} loadingText="Entrando...">Entrar</Button>
                    {estado.erro && (
                        <p role="alert" className="text-center text-sm text-red-600">{estado.erro}</p>
                    )}
                </form>
                <p className="mt-8 text-center text-sm text-muted-foreground">Precisa de ajuda? Entre em contato com o suporte</p>
            </section>
        </main>
    );
}
