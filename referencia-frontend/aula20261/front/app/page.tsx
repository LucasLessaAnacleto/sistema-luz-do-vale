'use client';

import Link from "next/link";

export default function LandingPage() {

  return (
    <div className="flex flex-col w-full -mt-8">

      {/* --- REGIÃO 1: HERO BANNER --- */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Detalhe de Fundo Geométrico (W3C SVG) */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-block py-1 px-3 mb-6 text-xs font-bold tracking-widest text-zinc-500 uppercase bg-zinc-100 rounded-full">
            Plataforma Educacional 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-8">
            ALUNÃO<span className="text-zinc-400">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            A inteligência por trás da gestão escolar. Simples, neutro e focado no que importa: o crescimento do aluno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all transform hover:-translate-y-1 inline-block text-center"
            >
              Começar Agora
            </Link>
            <button className="px-10 py-4 bg-white text-zinc-900 border border-zinc-200 font-bold rounded-xl hover:bg-zinc-50 transition-all">
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      {/* --- REGIÃO 2: SOBRE NÓS (A HISTÓRIA) --- */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative p-2 bg-white border border-zinc-200 rounded-3xl shadow-2xl">
                <div className="aspect-square bg-zinc-100 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Nossa Jornada</h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Tudo começou em 2024 com uma pergunta simples: "Por que gerenciar alunos precisa ser difícil?". O Alunão nasceu para ser o contraponto ao caos burocrático.
              </p>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Hoje, evoluímos para uma ferramenta que utiliza **React 19** e tecnologias de ponta para entregar velocidade e clareza para instituições de ensino em todo o país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- REGIÃO 3: A EQUIPE --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Os Criadores</h2>
            <div className="h-1 w-20 bg-zinc-900 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group p-8 border border-zinc-100 rounded-3xl hover:border-zinc-300 transition-all hover:shadow-xl hover:shadow-zinc-100">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Membro da Equipe</h3>
                <p className="text-zinc-500 uppercase text-xs tracking-widest mt-1">Sócio Fundador</p>
                <p className="mt-4 text-zinc-600">Especialista em arquitetura de sistemas responsivos e entusiasta de Next.js.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REGIÃO 4: EVENTOS (TIMELINE) --- */}
      <section className="py-24 bg-zinc-900 text-white rounded-[3rem] mx-4 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Últimos Eventos</h2>
          <div className="space-y-12">
            <div className="relative pl-8 border-l border-zinc-700">
              <div className="absolute -left-[5px] top-0 w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm text-zinc-500 font-mono">FEVEREIRO, 2026</span>
              <h4 className="text-xl font-bold mt-2 italic">Lançamento do Alunão Mobile</h4>
              <p className="text-zinc-400 mt-2">Nossa interface responsiva atinge 100% de cobertura para dispositivos móveis.</p>
            </div>
            <div className="relative pl-8 border-l border-zinc-700">
              <div className="absolute -left-[5px] top-0 w-2 h-2 bg-zinc-600 rounded-full"></div>
              <span className="text-sm text-zinc-500 font-mono">JANEIRO, 2026</span>
              <h4 className="text-xl font-bold mt-2 italic">Conferência EduTech</h4>
              <p className="text-zinc-400 mt-2">Apresentamos nosso novo motor de relatórios em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
