'use client'
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UsuarioForm from "../../componentes/UsuarioForm";
import axios from "axios";
import { Usuario } from "@/app/types/usuarios";
import { buscarPorId } from "@/app/services/usuarioService";


export default function EditarUsuario(){

    const params = useParams()
    const router = useRouter()
    const codigo = Number(params.codigo);

    const [usuario,setUsuario] = useState<Usuario|null>(null);

    useEffect(()=>
    {
        buscarDados();
    },[]);

    const buscarDados = async ()=>{
        debugger;
      const user = await buscarPorId(codigo)

      if (user) setUsuario(user)
        else router.push("/usuarios")
    }
    
    if(!usuario) return(<div className="p-8">Carregando dados...</div>)

    return(
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto"> {/* Limite máximo opcional para não esticar ao infinito em monitores UltraWide */}
        <div className="flex flex-col gap-3 mb-8">
            <Link 
                href="/usuarios" 
                className="group flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
                <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                Voltar para listagem
            </Link>

            <div className="space-y-1 border-l-4 border-blue-500 pl-4">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {codigo ? `Editar Usuário #${codigo}` : 'Cadastro de Novo Usuário'}
                </h1>
            </div>
        </div>

        {/* Container que envolve o formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
            <UsuarioForm usuarioExistente={usuario} />
        </div>
    </div>
</div>
    );
}