import type { AuthState } from "@/app/types/auth";
import type { Usuario } from "@/app/types/usuarios";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState: AuthState = {
  usuario: null,
  token: "",
  status: "verificando",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    recuperarSessao(state) {
      const usuarioRecover = Cookies.get("usuario");
      const tokenRecover = Cookies.get("token");

      if (usuarioRecover && tokenRecover) {
        try {
          state.usuario = JSON.parse(usuarioRecover) as Usuario;
          state.token = tokenRecover;
          state.status = "autenticado";
          return;
        } catch {
          Cookies.remove("usuario", { path: "/" });
          Cookies.remove("token", { path: "/" });
        }
      }

      state.usuario = null;
      state.token = "";
      state.status = "naoAutenticado";
    },

    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;

      Cookies.set("token", action.payload.token, {
        expires: 7,
        path: "/",
      });
    },

    setUsuario(state, action: PayloadAction<{ usuario: Usuario }>) {
      state.usuario = action.payload.usuario;
      state.status = "autenticado";

      Cookies.set("usuario", JSON.stringify(action.payload.usuario), {
        expires: 7,
        path: "/",
      });
    },

    logout(state) {
      state.token = "";
      state.usuario = null;
      state.status = "naoAutenticado";

      Cookies.remove("usuario", { path: "/" });
      Cookies.remove("token", { path: "/" });
    },
  },
});

export const { recuperarSessao, setToken, setUsuario, logout } =
  authSlice.actions;

export default authSlice.reducer;