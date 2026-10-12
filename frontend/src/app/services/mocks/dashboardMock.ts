export const dashboardMock = {
  pacientesAtivos: 8,
  mediaAcolhimentoDias: 106,
  documentos: 15,
  pendentesAssinatura: 3,
  mesReferencia: "2026-10",
  documentosPorMes: {
    "2026-08": 6,
    "2026-09": 6,
    "2026-10": 3,
  },
  avisos: [
    {
      id: 1,
      mensagem: "Reunião de equipe quinta-feira às 14h30 no auditório.",
      autor: "Equipe Administrativa",
    },
    {
      id: 2,
      mensagem: "Visita de familiares programada para sábado.",
      autor: "Equipe de Acolhimento",
    },
  ],
  documentosRecentes: [
    {
      id: 1,
      titulo: "Controle de Saída de Pacientes",
      paciente: "Marcos Santos",
      data: "01/10/2026",
      responsavel: "Enf. Maria Rodrigues",
      status: "Pendente",
    },
    {
      id: 2,
      titulo: "Termo de Acolhimento",
      paciente: "João Silva",
      data: "01/10/2026",
      responsavel: "Abel Rodrigues",
      status: "Pendente",
    },
  ],
  aniversariantes: [
    {
      id: 1,
      nome: "Carlos Ferreira",
      data: "14/10",
      idade: 38,
      vinculo: "Paciente",
    },
  ],
};
