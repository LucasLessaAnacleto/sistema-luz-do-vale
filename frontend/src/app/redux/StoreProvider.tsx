"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { recuperarSessao } from "./slices/authSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(recuperarSessao());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
