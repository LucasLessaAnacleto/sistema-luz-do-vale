"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BotaoVoltarHistorico() {
    const router = useRouter();

    return (
        <button type="button" onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent hover:bg-secondary/50"
        >
            <ArrowLeft className="h-5 w-5" />
        </button>
    );
}