import type { DocumentTemplate } from "@/app/types/documentos";

export const termoAcolhimento = "Estou ciente de que o tratamento é de caráter gratuito, sendo que fico isento de pagar qualquer valor referente à mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para inclusão no tratamento, com as quais concordo, e estou ciente dos meus direitos e deveres junto a esta instituição.";

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "evolucao-enfermagem", title: "Evolução de Enfermagem",
    description: "Registro de evolução pela equipe de enfermagem", fields: [],
  },
  {
    id: "ficha-acolhimento", title: "Ficha de Acolhimento",
    description: "Ficha completa de acolhimento do paciente", fields: [],
  },
  {
    id: "avaliacao-enfermagem", title: "Avaliação de Enfermagem",
    description: "Avaliação inicial e periódica de enfermagem", fields: [],
  },
  {
    id: "termo-acolhimento", title: "Termo de Acolhimento",
    description: "Declaração de aceite das normas da instituição",
    statement: termoAcolhimento,
    fields: [
      { name: "pertences", label: "Lista de pertences", type: "textarea", placeholder: "Liste os pertences deixados sob a guarda da instituição." },
    ],
  },
  {
    id: "controle-saida", title: "Controle de Saída de Pacientes",
    description: "Registro de saída temporária do paciente",
    fields: [
      { name: "dataSaida", label: "Data de saída", type: "date" },
      { name: "horaSaida", label: "Horário de saída", type: "time" },
      { name: "dataRetorno", label: "Data de retorno", type: "date" },
      { name: "horaRetorno", label: "Horário de retorno", type: "time" },
      { name: "motivo", label: "Motivo da saída", type: "textarea", placeholder: "Descreva o motivo da saída do paciente." },
    ],
  },
  {
    id: "evolucao-geral", title: "Evolução Geral",
    description: "Registro de evolução geral da equipe técnica",
    fields: [
      { name: "registro", label: "Registro de evolução", type: "textarea", placeholder: "Registre a evolução do paciente neste período." },
    ],
  },
];
