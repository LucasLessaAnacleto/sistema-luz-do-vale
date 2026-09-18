type UsuarioProps = {
  id?: number | null;
  nome: string;
  email: string;
  status?: string;
  senha: string;
};

export class Usuario {
  id: number | null;
  nome: string;
  email: string;
  status: string;
  senha: string;

  // Forma com objeto
  constructor(props: UsuarioProps);

  // Forma com parâmetros
  constructor(
    id: number | null,
    nome: string,
    email: string,
    status: string | undefined,
    senha: string,
  );

  constructor(
    idOuProps: number | null | UsuarioProps,
    nome?: string,
    email?: string,
    status?: string,
    senha?: string,
  ) {
    if (typeof idOuProps === "object" && idOuProps !== null) {
      this.id = idOuProps.id ?? null;
      this.nome = idOuProps.nome;
      this.email = idOuProps.email;
      this.status = idOuProps.status ?? "ATIVO";
      this.senha = idOuProps.senha;
    } else {
      this.id = idOuProps;
      this.nome = nome!;
      this.email = email!;
      this.status = status ?? "ATIVO";
      this.senha = senha!;
    }
  }
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
