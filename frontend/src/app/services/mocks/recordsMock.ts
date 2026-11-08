import { termoAcolhimento } from "./documentTemplates";
import type { DocumentPreview } from "@/app/types/documentos";
import type { PatientPreview } from "@/app/types/pacientes";

export const patientsMock: PatientPreview[] = [
  {
    id: 1,
    name: "João Silva",
    nickname: "Joãozinho",
    age: 33,
    birthDate: "15/06/1993",
    admission: "Internado há 6 meses",
    lastUpdate: "há 2 horas",
    fields: [
      { label: "CPF", value: "123.456.789-00" },
      { label: "RG", value: "12.345.678-9" },
      { label: "Nacionalidade", value: "Brasileira" },
      { label: "Naturalidade", value: "São Paulo" },
      { label: "Município (origem)", value: "São Paulo - SP" },
      { label: "Nome do pai", value: "José da Silva" },
      { label: "Nome da mãe", value: "Maria da Silva" },
      { label: "Escolaridade", value: "Ensino Médio Completo" },
      { label: "Profissão", value: "Auxiliar de Serviços Gerais" },
      { label: "Cor/Raça", value: "Parda" },
      { label: "Estado civil", value: "Casado" },
      { label: "Filhos", value: "Sim" },
      { label: "Endereço", value: "Rua das Flores, 123" },
      { label: "Bairro", value: "Jardim América" },
      { label: "Município (residência)", value: "São Paulo" },
      { label: "Estado", value: "SP" },
      { label: "Data de acolhimento", value: "10/04/2026" },
      { label: "Convênio", value: "SUS" },
    ],
    dependencies: ["Álcool", "Crack"],
    dependencyHistory: [
      { label: "Primeira droga lícita", value: "Álcool (15 anos)" },
      { label: "Primeira droga ilícita", value: "Maconha/Haxixe (17 anos)" },
    ],
    responsibles: [[
      { label: "Nome", value: "Maria Oliveira Silva" },
      { label: "Parentesco", value: "Esposa" },
      { label: "CPF", value: "987.654.321-00" },
      { label: "RG", value: "98.765.432-1" },
      { label: "Contato", value: "(11) 98888-8888" },
      { label: "Endereço", value: "Rua das Flores, 123 - Jardim América, São Paulo - SP" },
      { label: "Data", value: "10/04/2026" },
    ]],
  },
  {
    id: 2,
    name: "Marcos Santos",
    nickname: "Marquinho",
    age: 34,
    birthDate: "08/07/1992",
    admission: "Internado há 1 mês",
    lastUpdate: "há 15 minutos",
    fields: [
      { label: "Município (residência)", value: "Criciúma" },
      { label: "Estado", value: "SC" },
      { label: "Data de acolhimento", value: "25/09/2026" },
    ],
    dependencies: ["Álcool"],
    dependencyHistory: [],
    responsibles: [[
      { label: "Nome", value: "Ana Santos" },
      { label: "Parentesco", value: "Irmã" },
      { label: "Contato", value: "Não informado" },
    ]],
  },
  {
    id: 3,
    name: "Carlos Ferreira",
    nickname: "Carlão",
    age: 38,
    birthDate: "14/10/1988",
    admission: "Acolhimento encerrado",
    lastUpdate: null,
    fields: [
      { label: "Município (residência)", value: "Nova Veneza" },
      { label: "Estado", value: "SC" },
    ],
    dependencies: [],
    dependencyHistory: [],
    responsibles: [],
  },
];

export const documentsMock: DocumentPreview[] = [
  {
    id: "1", code: "DOC-000005", title: "Controle de Saída de Pacientes",
    patientId: 2, patient: "Marcos Santos", nickname: "Marquinho", author: "Enf. Maria Rodrigues",
    date: "25/10/2026 · 14:45", updatedAt: "2026-10-25T17:45:00Z", status: "pendente",
    fields: [
      { label: "Data de saída", value: "26/10/2026" }, { label: "Horário de saída", value: "09:00" },
      { label: "Data de retorno", value: "26/10/2026" }, { label: "Horário de retorno", value: "12:30" },
      { label: "Motivo da saída", value: "Visita à família, acompanhado pelo responsável." },
    ],
  },
  {
    id: "2", code: "DOC-000003", title: "Termo de Acolhimento",
    patientId: 1, patient: "João Silva", nickname: "Joãozinho", author: "Abel Rodrigues",
    date: "25/10/2026 · 13:00", updatedAt: "2026-10-25T16:00:00Z", status: "pendente",
    statement: termoAcolhimento,
    fields: [{ label: "Lista de pertences", value: "Uma mochila azul, duas camisetas e um par de tênis." }],
  },
  {
    id: "3", code: "DOC-000002", title: "Evolução Geral",
    patientId: 1, patient: "João Silva", nickname: "Joãozinho", author: "Dra. Ana Paula",
    date: "24/10/2026 · 15:00", updatedAt: "2026-10-24T18:00:00Z", status: "assinado",
    fields: [{ label: "Registro de evolução", value: "Participou da atividade em grupo e relatou como foi sua adaptação à rotina da instituição." }],
  },
];
