"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hook";
import SessionStatus from "@/app/components/SessionStatus";

export default function SistemaLayout({ children }: { children: ReactNode }) {
  const status = useAppSelector((state) => state.auth.status);
  const router = useRouter();
  useEffect(() => {
    if (status === "naoAutenticado") router.replace("/login");
  }, [status, router]);
  if (status !== "autenticado")
    return <SessionStatus />;
  return children;
}
