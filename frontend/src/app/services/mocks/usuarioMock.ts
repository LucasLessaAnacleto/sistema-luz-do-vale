import Cookies from "js-cookie";
import type {
  Usuario,
  CriarUsuarioRequest,
  EditarUsuarioRequest,
} from "@/app/types/usuarios";

const base: Usuario = {
  id: 1,
  profissionalId: 1,
  nome: "Usuário de teste",
  telefone: null,
  regProfissional: null,
  cpf: "111.444.777-35",
  dtNasc: "1990-08-15",
  endereco: null,
  email: "teste@teste.com",
  role: "ROLE_USER",
  perfilId: null,
  perfil: null,
  ativo: true,
  dtCriacao: "2026-10-29T00:00:00",
  dtDesativado: null,
};

const iniciais: Usuario[] = [
  base,
  {
    ...base,
    id: 2,
    profissionalId: 2,
    nome: "Administrador de teste",
    email: "admin@teste.com",
    role: "ROLE_ADMIN",
  },
  {
    ...base,
    id: 3,
    profissionalId: 3,
    nome: "Ana Paula",
    email: "ana@teste.com",
    regProfissional: "CRP 00/00000",
  },
  {
    ...base,
    id: 4,
    profissionalId: 4,
    nome: "Carlos Lima",
    email: "carlos@teste.com",
    ativo: false,
    dtDesativado: "2026-10-30T10:00:00",
  },
];

function lerUsuarios(): Usuario[] {
  const salvos = localStorage.getItem("reabilitah-equipe-mock");
  return salvos ? JSON.parse(salvos) : structuredClone(iniciais);
}

function exigirAdmin() {
  const cookie = Cookies.get("usuario");
  const usuario: Usuario | null = cookie ? JSON.parse(cookie) : null;
  if (usuario?.role !== "ROLE_ADMIN")
    throw new Error("Somente administradores podem alterar a equipe.");
}

export async function buscarListaUsuariosMock(): Promise<Usuario[]> {
  return lerUsuarios();
}

export async function buscarUsuarioPorIdMock(id: number): Promise<Usuario> {
  exigirAdmin();
  const usuario = lerUsuarios().find((item) => item.id === id);
  if (!usuario) throw new Error("Usuário não encontrado.");
  return usuario;
}

export async function salvarUsuarioMock(
  dados: CriarUsuarioRequest,
): Promise<Usuario> {
  exigirAdmin();
  const usuarios = lerUsuarios();
  if (
    usuarios.some(
      (item) => item.email.toLowerCase() === dados.email.toLowerCase(),
    )
  ) {
    throw new Error("E-mail já cadastrado.");
  }
  const { senha, ...campos } = dados;
  void senha;
  const id = Math.max(...usuarios.map((item) => item.id), 0) + 1;
  const usuario: Usuario = {
    ...base,
    ...campos,
    id,
    profissionalId: id,
    dtCriacao: new Date().toISOString(),
  };
  localStorage.setItem(
    "reabilitah-equipe-mock",
    JSON.stringify([...usuarios, usuario]),
  );
  return usuario;
}

export async function atualizarUsuarioMock(
  id: number,
  dados: EditarUsuarioRequest,
): Promise<Usuario> {
  exigirAdmin();
  const usuarios = lerUsuarios();
  const existente = usuarios.find((item) => item.id === id);
  if (!existente) throw new Error("Usuário não encontrado.");
  if (
    usuarios.some(
      (item) =>
        item.id !== id &&
        item.email.toLowerCase() === dados.email.toLowerCase(),
    )
  ) {
    throw new Error("E-mail já cadastrado.");
  }
  const usuario = {
    ...existente,
    ...dados,
    dtDesativado: dados.ativo
      ? null
      : (existente.dtDesativado ?? new Date().toISOString()),
  };
  localStorage.setItem(
    "reabilitah-equipe-mock",
    JSON.stringify(usuarios.map((item) => (item.id === id ? usuario : item))),
  );
  return usuario;
}
