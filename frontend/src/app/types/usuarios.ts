import { EnderecoUsuario } from "./endereco";

export interface Usuario {
  id: number;
  profissionalId: number | null;
  nome: string;
  telefone: string | null;
  regProfissional: string | null;
  cpf: string | null;
  dtNasc: string | null;
  endereco: EnderecoUsuario | null;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  perfilId: number | null;
  perfil: string | null;
  ativo: boolean;
  dtCriacao: string;
  dtDesativado: string | null;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export interface UsuarioFormProps {
  usuarioExistente?: Usuario;
}


