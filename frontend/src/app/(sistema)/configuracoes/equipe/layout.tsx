import type { ReactNode } from "react";
import ProtecaoAdmin from "@/app/components/protecaoAdmin";

export default function EquipeLayout({ children }: { children: ReactNode; }) {
    return <ProtecaoAdmin>{children}</ProtecaoAdmin>;
}