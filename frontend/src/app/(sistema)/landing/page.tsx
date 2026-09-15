import Image from "next/image";
import Link from "next/link";

const pilares = [
  { numero: "01", titulo: "Pacientes", descricao: "Uma proposta de cadastro centralizado para acolhidos, responsáveis e informações de acompanhamento." },
  { numero: "02", titulo: "Documentos", descricao: "Formulários organizados para apoiar os registros clínicos e administrativos da instituição." },
  { numero: "03", titulo: "Histórico e auditoria", descricao: "Rastreabilidade dos registros para facilitar a consulta do prontuário e a preparação das auditorias." },
];

const equipe = ["Bianca Birolo", "Danilo Dias", "Gabriel Vieira", "Lucas Anacleto"];
const foco = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function LandingPage() {
  return (
    <div>
      <a href="#conteudo" className={`sr-only focus:not-sr-only focus:absolute focus:z-20 focus:bg-white focus:p-4 ${foco}`}>
        Pular para o conteúdo
      </a>
      <header className="border-b border-border bg-white/80">
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link href="/" aria-label="Reabilitah — início" className={`flex items-center gap-3 rounded-lg ${foco}`}>
            <Image src="/logo-login.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="text-xl font-semibold tracking-tight text-primary">Reabilitah</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <a href="#sobre" className={`hidden rounded hover:text-primary sm:inline ${foco}`}>O projeto</a>
            <a href="#equipe" className={`hidden rounded hover:text-primary sm:inline ${foco}`}>Equipe</a>
            <Link href="/login" className={`rounded-xl bg-primary px-4 py-2.5 text-white hover:opacity-90 ${foco}`}>Entrar no sistema</Link>
          </div>
        </nav>
      </header>

      <main id="conteudo">
        {/* Apresentação principal, seguindo a estrutura do projeto de aula. */}
        <section className="relative isolate overflow-hidden px-6 py-24 text-center sm:py-32" aria-labelledby="titulo-principal">
          <div aria-hidden="true" className="pointer-events-none absolute -top-36 -right-36 -z-10 h-96 w-96 rounded-full bg-[#e7ecdd] blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 -left-40 -z-10 h-80 w-80 rounded-full bg-[#ece8dc] blur-3xl" />
          <div className="mx-auto max-w-4xl">
            <span className="inline-block rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-primary uppercase">Tecnologia a serviço do acolhimento</span>
            <h1 id="titulo-principal" className="mt-8 text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">Mais organização.<br /><span className="text-primary">Mais tempo para cuidar.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">O Reabilitah é um projeto de prontuário eletrônico para apoiar a equipe da Luz do Vale no acompanhamento de acolhidos e na organização de documentos.</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login" className={`w-full rounded-xl bg-primary px-8 py-4 font-medium text-white hover:opacity-90 sm:w-auto ${foco}`}>Entrar no sistema <span aria-hidden="true">↗</span></Link>
              <a href="#sobre" className={`w-full rounded-xl border border-border bg-white px-8 py-4 font-medium hover:border-primary sm:w-auto ${foco}`}>Conheça o projeto</a>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Projeto em desenvolvimento · Acesso destinado à equipe da instituição</p>
          </div>
        </section>

        <section id="sobre" aria-labelledby="titulo-sobre" className="scroll-mt-6 bg-white px-6 py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-20">
            <div className="rounded-3xl border border-primary/15 bg-background p-8 sm:p-12">
              <Image src="/logo-login.png" alt="" width={96} height={96} className="mb-8 h-24 w-24 object-contain" />
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">Luz do Vale</p>
              <h2 id="titulo-sobre" className="mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">O cuidado com as pessoas inspira o nosso projeto.</h2>
              <p className="mt-6 text-sm text-muted-foreground">Centro de Recuperação Luz no Vale · Nova Veneza, SC</p>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>A rotina da instituição reúne cadastros, documentos e registros de acompanhamento em papel, planilhas e arquivos separados. Consultar essas informações e preparar a documentação para auditorias exige tempo da equipe.</p>
              <p>O Reabilitah nasceu para ajudar a organizar esse trabalho em um prontuário eletrônico, reunindo as informações necessárias ao acompanhamento de cada acolhido.</p>
              <p>Desenvolvido como projeto acadêmico de Análise e Desenvolvimento de Sistemas do SENAC Criciúma, conecta o aprendizado em sala de aula a uma necessidade da comunidade.</p>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
            {pilares.map((pilar) => (
              <article key={pilar.numero} className="rounded-2xl border border-border p-7">
                <span aria-hidden="true" className="text-sm font-semibold text-primary">{pilar.numero}</span>
                <h3 className="mt-5 text-xl font-semibold">{pilar.titulo}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{pilar.descricao}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="equipe" aria-labelledby="titulo-equipe" className="scroll-mt-6 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">Quem está construindo</p>
              <h2 id="titulo-equipe" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Nossa equipe</h2>
              <p className="mt-4 text-muted-foreground">Estudantes de Análise e Desenvolvimento de Sistemas · SENAC Criciúma</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {equipe.map((nome) => (
                <article key={nome} className="rounded-2xl border border-border bg-white p-7">
                  <div aria-hidden="true" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">{nome.split(" ").map((parte) => parte[0]).join("")}</div>
                  <h3 className="text-lg font-semibold">{nome}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Equipe de desenvolvimento</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="titulo-jornada" className="mx-4 mb-12 rounded-[2rem] bg-[#35432e] px-6 py-16 text-white sm:mx-6 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium tracking-widest text-[#d3dfbf] uppercase">Do aprendizado à prática</p>
            <h2 id="titulo-jornada" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Nossa jornada</h2>
            <ol className="mt-10 space-y-8 border-l border-white/25 pl-6">
              <li><h3 className="text-xl font-medium">Entender a rotina</h3><p className="mt-2 leading-relaxed text-white/80">Levantamento das necessidades da instituição e mapeamento dos documentos utilizados pela equipe.</p></li>
              <li><h3 className="text-xl font-medium">Desenhar a experiência</h3><p className="mt-2 leading-relaxed text-white/80">Organização dos fluxos e criação do protótipo para orientar as telas do Reabilitah.</p></li>
              <li><span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Em desenvolvimento</span><h3 className="text-xl font-medium">Construir o sistema</h3><p className="mt-2 leading-relaxed text-white/80">Implementação das telas e dos serviços que vão conectar o prontuário à rotina da instituição.</p></li>
            </ol>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-6 pb-8 text-sm text-muted-foreground sm:flex-row">
        <p><span className="font-semibold text-primary">Reabilitah</span> · Projeto para a Luz do Vale</p>
        <p>ADS · SENAC Criciúma</p>
      </footer>
    </div>
  );
}