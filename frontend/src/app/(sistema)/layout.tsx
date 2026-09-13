"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { setUsuario, setStatus, logout } from "@/app/redux/slices/authSlice";
import { buscarUsuarioLogado } from "@/app/services/authService";
import SessionStatus from "@/app/components/SessionStatus";

export default function SistemaLayout({ children }: { children: ReactNode }) {
  const status = useSelector((state: RootState) => state.auth.status);
  const router = useRouter();
  const dispatch = useDispatch();

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
    if (status === "naoAutenticado") router.replace("/login");
  }, [status, router]);
  if (status !== "autenticado") return <SessionStatus erro={status === "erro"} onTentarNovamente={() => dispatch(setStatus("verificando"))} />;
  return children;
}
