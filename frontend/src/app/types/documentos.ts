export interface DocumentPreview {
  id: number;
  code: string;
  title: string;
  patientId: number;
  patient: string;
  nickname: string;
  author: string;
  date: string;
  updatedAt: string;
  status: "pendente" | "assinado";
}
