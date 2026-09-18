"use client";

import Brand from "@/app/components/Brand";
import Button from "@/app/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";

export default function HomePage() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-md space-y-5 text-center">
        <Brand />
        <h1 className="text-3xl font-semibold">Olá, {usuario?.nome}!</h1>
        <p className="text-muted-foreground">Você entrou no Reabilitah. As próximas funcionalidades estarão disponíveis aqui.</p>
        <Button onClick={() => dispatch(logout())} className="w-full">Sair do sistema</Button>
      </section>
    </main>
  );
}
