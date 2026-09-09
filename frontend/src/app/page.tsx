"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("O acesso ao sistema ainda não está disponível.");
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <section className="login-panel w-full max-w-md" aria-labelledby="login-title">
        <header className="mb-10 text-center">
          <Image
            src="/logo-login.png"
            alt="ReIntegra"
            width={80}
            height={80}
            priority
            className="mx-auto mb-4 h-20 w-20 object-contain"
          />
          <h1 id="login-title" className="mb-1 text-3xl font-semibold">
            Bem-vindo
          </h1>
          <p className="text-sm text-muted-foreground">
            Luz do Vale · Sistema de Reabilitação
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="seu@email.com"
                required
                className="login-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Senha
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="login-input"
              />
            </div>
          </div>

          <button
            type="button"
            className="cursor-pointer rounded text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            onClick={() =>
              setMessage("Para recuperar sua senha, entre em contato com a administração da instituição.")
            }
          >
            Esqueceu sua senha?
          </button>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-medium text-white transition duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
          >
            Entrar
          </button>

          <p role="status" aria-live="polite" aria-atomic="true" className={message ? "text-center text-sm text-muted-foreground" : "sr-only"}>
            {message}
          </p>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Precisa de ajuda? Entre em contato com o suporte
        </p>
      </section>
    </main>
  );
}
