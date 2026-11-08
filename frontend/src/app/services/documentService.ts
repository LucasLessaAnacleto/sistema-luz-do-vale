"use client";

import { useEffect, useState } from "react";
import { documentsMock } from "./mocks/recordsMock";
import type { DocumentPreview } from "@/app/types/documentos";

const prefix = "reabilitah:documentos:demo:v1:";

function readDocuments(): DocumentPreview[] {
  const saved: DocumentPreview[] = [];

  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(prefix)) continue;
    try {
      const doc: DocumentPreview = JSON.parse(localStorage.getItem(key) ?? "null");
      if (doc && key === prefix + doc.id && Array.isArray(doc.fields)) saved.push(doc);
    } catch {
      // Ignora um registro local inválido e continua a lista.
    }
  }

  return [...saved.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), ...documentsMock];
}

export function useDocuments() {
  const [documents, setDocuments] = useState(documentsMock);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function refresh() {
      try {
        setDocuments(readDocuments());
      } catch {
        setDocuments(documentsMock);
      }
      setReady(true);
    }
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("documento-criado", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("documento-criado", refresh);
    };
  }, []);

  return { documents, ready };
}

type NewDocument = Pick<DocumentPreview, "title" | "patientId" | "patient" | "nickname" | "author" | "statement" | "fields">;

export function createDocument(input: NewDocument): DocumentPreview {
  const id = crypto.randomUUID();
  const now = new Date();
  const date = now.toLocaleDateString("pt-BR") + " · " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const document: DocumentPreview = {
    ...input, id, code: "DOC-" + id.slice(0, 8).toUpperCase(),
    date, updatedAt: now.toISOString(), status: "pendente",
  };

  localStorage.setItem(prefix + id, JSON.stringify(document));
  window.dispatchEvent(new Event("documento-criado"));
  return document;
}
