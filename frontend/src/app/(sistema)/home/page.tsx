"use client";

import { useState } from "react";
import Brand from "@/app/components/Brand";
import Button from "@/app/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { logout } from "@/app/redux/slices/authSlice";
import { logoutService } from "@/app/services/authService";

export default function HomePage() {
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function sair() {
    if (loading) return;
    setLoading(true);
    setErro("");
    try {
      await logoutService();
      dispatch(logout());
    } catch {
      setErro("Não foi possível encerrar a sessão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-md space-y-5 text-center">
        <Brand />
        <h1 className="text-3xl font-semibold">Olá, {usuario?.nome}!</h1>
        <p className="text-muted-foreground">Você entrou no Reabilitah. As próximas funcionalidades estarão disponíveis aqui.</p>
        <Button onClick={sair} className="w-full" loading={loading} loadingText="Saindo...">Sair do sistema</Button>
        <p role="status" className="text-sm text-muted-foreground">{erro}</p>
      </section>
    </main>
  );
}
