"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Settings, Users } from "lucide-react";
import { cn } from "@/app/util";

const links = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/documentos", label: "Documentos", icon: FileText },
  { href: "/configuracoes", label: "Config.", icon: Settings },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="relative z-20 shrink-0 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid min-h-20 max-w-lg grid-cols-4 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={href === "/configuracoes" ? "Configurações" : label}
              className={cn(
                "m-1 flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-2 text-xs font-medium transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active ? "text-primary-dark" : "text-muted-foreground",
              )}
            >
              <span className="relative flex h-8 items-start justify-center">
                <Icon className="h-6 w-6" aria-hidden="true" />
                {active && <span className="absolute bottom-0 h-1 w-1 rounded-full bg-primary" />}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
