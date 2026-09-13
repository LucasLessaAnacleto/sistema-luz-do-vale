import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/app/types/auth";
import type { Usuario } from "@/app/types/usuarios";

const initialState: AuthState = { usuario: null, status: "verificando" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUsuario(state, action: PayloadAction<{ usuario: Usuario }>) {
      state.usuario = action.payload.usuario;
      state.status = "autenticado";
    },
    setStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
    },
    logout(state) {
      state.usuario = null;
      state.status = "naoAutenticado";
    },
  },
});

export const { setUsuario, setStatus, logout } = authSlice.actions;
export default authSlice.reducer;
