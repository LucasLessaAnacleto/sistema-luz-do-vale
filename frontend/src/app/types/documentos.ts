export interface DocumentField {
  label: string;
  value: string;
}

export interface DocumentPreview {
  id: string;
  code: string;
  title: string;
  patientId: number;
  patient: string;
  nickname: string;
  author: string;
  date: string;
  updatedAt: string;
  status: "pendente" | "assinado";
  statement?: string;
  fields: DocumentField[];
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  statement?: string;
  fields: {
    name: string;
    label: string;
    type: "textarea" | "date" | "time";
    placeholder?: string;
  }[];
}
