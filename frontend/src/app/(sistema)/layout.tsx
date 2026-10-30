"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hook";
import SessionStatus from "@/app/components/SessionStatus";
import Header from "@/app/components/Header";
import BottomNavigation from "@/app/components/BottomNavigation";

export default function SistemaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const status = useAppSelector((state) => state.auth.status);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "naoAutenticado") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "autenticado") {
    return <SessionStatus />;
  }

  if (pathname === "/landing") {
    return children;
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-30 focus:rounded-lg focus:bg-card focus:p-3 focus:text-primary-dark"
      >
        Ir para o conteúdo
      </a>

      <Header />

      <main
        id="conteudo"
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6 [scrollbar-gutter:stable_both-edges]"
      >
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}