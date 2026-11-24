"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hook";
import SessionStatus from "@/app/components/SessionStatus";

interface Props {
    children: ReactNode;
}

export default function ProtecaoAdmin({ children }: Props) {
    const router = useRouter();

    const status = useAppSelector((state) => state.auth.status);
    const usuario = useAppSelector((state) => state.auth.usuario);

    const isAdmin = usuario?.role === "ROLE_ADMIN";

    useEffect(() => {
        if (status === "autenticado" && !isAdmin) {
            router.replace("/configuracoes");
        }
    }, [status, isAdmin, router]);

    if (status !== "autenticado" || !isAdmin) {
        return <SessionStatus />;
    }

    return <>{children}</>;
}
