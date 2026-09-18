import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { AuthState } from "@/app/types/auth";
import type { Usuario } from "@/app/types/usuarios";

const initialState: AuthState = { usuario: null, token: "", status: "verificando" };

function limparCookies() {
  Cookies.remove('usuario', { path: "/" });
  Cookies.remove('token', { path: "/" });
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    recuperarSessao(state) {
      const token = Cookies.get("token");
      const usuarioCookie = Cookies.get("usuario");
      if (token !== "demo-token" || !usuarioCookie) {
        state.usuario = null;
        state.token = "";
        state.status = "naoAutenticado";
        limparCookies();
        return;
      }

      try {
        const usuario: unknown = JSON.parse(usuarioCookie);
        if (
          typeof usuario === "object" && usuario !== null &&
          "id" in usuario && typeof usuario.id === "number" &&
          "nome" in usuario && typeof usuario.nome === "string" &&
          "email" in usuario && typeof usuario.email === "string" &&
          "status" in usuario && typeof usuario.status === "string" &&
          "senha" in usuario && usuario.senha === ""
        ) {
          state.usuario = usuario as Usuario;
          state.token = token;
          state.status = "autenticado";
          return;
        }
      } catch {
        // Cookies inválidos não recuperam a sessão.
      }

      state.usuario = null;
      state.token = "";
      state.status = "naoAutenticado";
      limparCookies();
    },
    setToken(state, action: PayloadAction<{ token: string }>) {
      const opcoes = {
        expires: 7,
        path: "/",
        sameSite: "Lax" as const,
        secure: window.location.protocol === "https:",
      }
      state.token = action.payload.token;
      Cookies.set('token', action.payload.token, opcoes);
    },
    setUsuario(state, action: PayloadAction<{ usuario: Usuario }>) {
      const opcoes = {
        expires: 7,
        path: "/",
        sameSite: "Lax" as const,
        secure: window.location.protocol === "https:",
      }
      state.usuario = action.payload.usuario;
      state.status = "autenticado";
      Cookies.set('usuario', JSON.stringify(action.payload.usuario), opcoes);
    },
    logout(state) {
      limparCookies();
      state.usuario = null;
      state.token = "";
      state.status = "naoAutenticado";
    },
  },
});

export const { recuperarSessao, setToken, setUsuario, logout } = authSlice.actions;
export default authSlice.reducer;
