export interface PatientField {
  label: string;
  value: string;
}

export interface PatientPreview {
  id: number;
  name: string;
  nickname: string;
  age: number;
  birthDate: string;
  admission: string;
  lastUpdate: string | null;
  fields: PatientField[];
  dependencies: string[];
  dependencyHistory: PatientField[];
  responsibles: PatientField[][];
}
