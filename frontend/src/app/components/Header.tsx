"use client";

import { Building2, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";

export default function Header() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

  return (
    <header className="relative z-30 shrink-0 border-b border-white/10 bg-primary text-white shadow-[0_3px_8px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>

          <div>
            <p className="text-base font-semibold leading-tight">
              Luz do Vale
            </p>
            <p className="mt-0.5 text-xs text-white/75">
              Reabilitah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden max-w-40 truncate text-xs text-white/90 sm:block">
            {usuario?.nome ?? ""}
          </span>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-medium transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}