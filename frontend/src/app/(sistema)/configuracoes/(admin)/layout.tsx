"use client";

import { useAppSelector } from "@/app/redux/hook";
import { ReactNode } from "react";

export default function ConfigLayout({  children, }: { children: ReactNode; }){

    const usuario = useAppSelector((state) => state.auth.usuario);
    if(usuario?.role !== "ROLE_ADMIN"){
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-lg font-semibold">Acesso Negado</h1>
                <p className="mt-2 text-sm text-muted-foreground">Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }else{
        return children;
    }
}
