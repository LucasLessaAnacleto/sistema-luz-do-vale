import type { Paciente } from "@/app/types/pacientes";

const pacientes: Paciente[] = [
  {
    id: 1,
    nome: "Joao da Silva",
    apelido: "Joao",
    cpf: "111.444.777-35",
    rg: "123456789",
    telefone: "48999998888",
    endereco: {
      rua: "Rua das Palmeiras",
      numero: "150",
      bairro: "Centro",
      municipio: "Criciuma",
      estado: "SC",
    },
    dtNasc: "1990-08-15",
    ativo: true,
    dtCriacao: "2026-11-03T20:40:48.909978",
    dtDesativado: null,
    responsavel: {
      id: 1,
      nome: "Maria da Silva",
      parentesco: "Mae",
      cpf: "529.982.247-25",
      rg: "987654321",
      telefone: "48999997777",
      endereco: {
        rua: "Rua das Palmeiras",
        numero: "150",
        bairro: "Centro",
        municipio: "Criciuma",
        estado: "SC",
      },
      dtNasc: "1965-04-10",
    },
  },
];

export async function buscarListaPacientesMock(): Promise<Paciente[]> {
  return pacientes;
}