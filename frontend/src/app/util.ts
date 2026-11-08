import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSearch(value: string) {
  return value.normalize("NFD").trim().toLowerCase();
}

export function iniciais(nome: string) {
  const palavras = nome.split(" ");
  const iniciais = palavras.map((palavra) => palavra.charAt(0).toUpperCase());
  return iniciais.join("");
}
