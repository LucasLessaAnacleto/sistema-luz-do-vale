import type { ReactNode } from "react";
import ProtecaoAdmin from "@/app/components/protecaoAdmin";

export default function PerfisLayout({ children }: { children: ReactNode; }) {
    return <ProtecaoAdmin>{children}</ProtecaoAdmin>;
}