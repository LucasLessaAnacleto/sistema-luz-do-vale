'use client';

import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";

export default function Header() {

  const dispatch = useDispatch();
  const usuario = store.getState().auth.usuario;

  return (
    <header className="w-full bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Identificação do Usuário */}
          <div className="flex items-center gap-3">
            {/* SVG Ícone de Usuário (Padrão W3C) */}
            <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-zinc-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-800 hidden sm:block">
              {usuario?.nome.toLocaleUpperCase() || 'Usuario indefinido!'}
            </span>
          </div>

          {/* Botão Sair */}
          <button
            type="button"
            onClick={(e) => {
              dispatch(logout());
            }
            }
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 transition-all rounded-lg hover:bg-zinc-50 hover:text-red-600 border border-transparent hover:border-zinc-200"

          >
            <span>Sair</span>
            {/* SVG Ícone de LogOut (Padrão W3C) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}