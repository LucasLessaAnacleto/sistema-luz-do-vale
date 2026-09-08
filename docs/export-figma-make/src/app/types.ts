export interface Responsible {
  id: string;
  name: string;
  relationship?: string;
  cpf?: string;
  rg?: string;
  address?: string;
  contact?: string;
  date?: string;
}

export interface Patient {
  id: string;
  name: string;
  nickname?: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  nationality?: string;
  naturalidade?: string;
  municipio?: string;
  fatherName?: string;
  motherName?: string;
  education?: string;
  profession?: string;
  color?: string;
  maritalStatus?: string;
  hasChildren?: boolean;
  address?: string;
  bairro?: string;
  municipioEndereco?: string;
  estado?: string;
  admissionDate: string;
  dischargeDate?: string;
  convenio?: string;
  photoUrl?: string;
  dependencies?: string[];
  firstLicitDrug?: string;
  firstLicitDrugAge?: string;
  firstIllicitDrug?: string;
  firstIllicitDrugAge?: string;
  responsibles?: Responsible[];
}

export type DocumentStatus = 'pending-signature' | 'signed' | 'disabled';

export type DocumentType =
  | 'ficha-acolhimento'
  | 'termo-acolhimento'
  | 'controle-saida'
  | 'evolucao-geral'
  | 'evolucao-enfermagem'
  | 'avaliacao-enfermagem'
  | 'termos';

export interface DocumentVersion {
  version: number;
  action: 'created' | 'pdf-downloaded' | 'pdf-attached' | 'disabled' | 'reactivated' | 'signed';
  timestamp: number;
  date: string;
  time: string;
  author: string;
  justification?: string;
  fileName?: string;
  contentSnapshot?: Record<string, any>;
}

export interface Signature {
  id: string;
  documentId: string;
  documentVersion: number;
  signerName: string;
  signerType: 'patient' | 'responsible';
  timestamp: number;
  date: string;
  time: string;
  method: 'presencial' | 'gov-br';
  imageData: string;
}

export interface PatientDocument {
  id: string;
  docId: string;
  patientId: string;
  type: DocumentType;
  title: string;
  status: DocumentStatus;
  currentVersion: number;
  timestamp: number;
  createdAt: string;
  createdTime: string;
  updatedAt: string;
  updatedTime: string;
  createdBy: string;
  content: Record<string, any>;
  versions: DocumentVersion[];
  signedPdfName?: string;
}

export interface Notice {
  id: string;
  message: string;
  author: string;
  startDate: number;
  endDate: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  birthDate: string;
  birthYear: number;
}

export interface Permission {
  // Pacientes
  canViewPatients: boolean;
  canCreatePatients: boolean;
  canEditPatients: boolean;
  canDeactivatePatients: boolean;
  canViewPatientHistory: boolean;
  // Documentos
  canViewDocuments: boolean;
  canCreateDocuments: boolean;
  canDisableDocuments: boolean;
  canViewDisabledDocuments: boolean;
  canReactivateDocuments: boolean;
  canViewAudit: boolean;
  canViewVersions: boolean;
  canExportPdf: boolean;
  canDownloadPdf: boolean;
  canAttachSignedPdf: boolean;
  canFinalizeDocument: boolean;
  // Administrativo
  canViewTeam: boolean;
  canCreateProfessional: boolean;
  canEditProfessional: boolean;
  canDeactivateProfessional: boolean;
  canReactivateProfessional: boolean;
  canChangePermissions: boolean;
  canChangePassword: boolean;
  canViewAdminLog: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  isAdmin: boolean;
  permissions: Permission;
  auditLog?: { action: string; by: string; date: string; time: string }[];
}

export interface InstitutionalLayout {
  headerImageUrl?: string;
  footerImageUrl?: string;
  orgName: string;
  orgLocation: string;
  footerText: string;
}

export const FULL_PERMISSION: Permission = {
  canViewPatients: true, canCreatePatients: true, canEditPatients: true,
  canDeactivatePatients: true, canViewPatientHistory: true,
  canViewDocuments: true, canCreateDocuments: true,
  canDisableDocuments: true, canViewDisabledDocuments: true,
  canReactivateDocuments: true, canViewAudit: true, canViewVersions: true,
  canExportPdf: true, canDownloadPdf: true, canAttachSignedPdf: true,
  canFinalizeDocument: true,
  canViewTeam: true, canCreateProfessional: true, canEditProfessional: true,
  canDeactivateProfessional: true, canReactivateProfessional: true,
  canChangePermissions: true, canChangePassword: true, canViewAdminLog: true,
};

export const VIEWER_PERMISSION: Permission = {
  canViewPatients: true, canCreatePatients: false, canEditPatients: false,
  canDeactivatePatients: false, canViewPatientHistory: true,
  canViewDocuments: true, canCreateDocuments: false,
  canDisableDocuments: false, canViewDisabledDocuments: false,
  canReactivateDocuments: false, canViewAudit: false, canViewVersions: true,
  canExportPdf: false, canDownloadPdf: false, canAttachSignedPdf: false,
  canFinalizeDocument: false,
  canViewTeam: false, canCreateProfessional: false, canEditProfessional: false,
  canDeactivateProfessional: false, canReactivateProfessional: false,
  canChangePermissions: false, canChangePassword: false, canViewAdminLog: false,
};

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 's1', name: 'Abel Rodrigues', role: 'Coordenador', birthDate: '12/08', birthYear: 1985 },
  { id: 's2', name: 'Enf. Maria Rodrigues', role: 'Enfermeira', birthDate: '20/08', birthYear: 1992 },
  { id: 's3', name: 'Dr. Roberto Santos', role: 'Psiquiatra', birthDate: '05/09', birthYear: 1978 },
  { id: 's4', name: 'Dra. Ana Paula', role: 'Psicóloga', birthDate: '15/08', birthYear: 1990 },
  { id: 's5', name: 'Carlos Lima', role: 'Monitor', birthDate: '28/09', birthYear: 1990 },
];

export const DEPENDENCY_OPTIONS = [
  'Álcool',
  'Maconha/Haxixe',
  'Cocaína',
  'Crack',
  'Inalantes/Cola/Solventes/Thinner',
  'Diazepam',
  'Afetam/REM/EMA',
  'Ecstasy/MDMA',
  'LSD',
  'Heroína/Morfina/Metanfetamina',
];

export function getStatusLabel(status: DocumentStatus): string {
  const labels: Record<DocumentStatus, string> = {
    'pending-signature': 'Pendente de assinatura',
    'signed': 'Assinado',
    'disabled': 'Documento desativado',
  };
  return labels[status] ?? status;
}

export function getStatusBadgeVariant(status: DocumentStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'signed') return 'success';
  if (status === 'pending-signature') return 'warning';
  if (status === 'disabled') return 'danger';
  return 'default';
}

export function formatTimeSince(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (minutes < 1) return 'agora mesmo';
  if (hours < 1) return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  if (days < 1) return `há ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (months < 1) return `há ${days} dia${days !== 1 ? 's' : ''}`;
  if (years < 1) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  return `há ${years} ano${years !== 1 ? 's' : ''}`;
}

export function formatStayDuration(admissionDate: string): string {
  const [d, m, y] = admissionDate.split('/').map(Number);
  const admission = new Date(y, m - 1, d);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - admission.getTime()) / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  if (diffDays < 30) return `Internado há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
  if (diffMonths < 12) return `Internado há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
  return `Internado há ${diffYears} ano${diffYears !== 1 ? 's' : ''}`;
}

export function calculateAge(birthDate?: string): number | null {
  if (!birthDate) return null;
  const [d, m, y] = birthDate.split('/').map(Number);
  const birth = new Date(y, m - 1, d);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const diff = now.getMonth() - birth.getMonth();
  if (diff < 0 || (diff === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDocId(n: number): string {
  return 'DOC-' + String(n).padStart(6, '0');
}

export function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getDocumentTitle(type: DocumentType): string {
  const titles: Record<DocumentType, string> = {
    'ficha-acolhimento': 'Ficha de Acolhimento',
    'termo-acolhimento': 'Termo de Acolhimento',
    'controle-saida': 'Controle de Saída de Pacientes',
    'evolucao-geral': 'Evolução Geral',
    'evolucao-enfermagem': 'Evolução de Enfermagem',
    'avaliacao-enfermagem': 'Avaliação de Enfermagem',
    'termos': 'Termos',
  };
  return titles[type] || type;
}

export function daysUntilBirthday(birthdayStr: string): number {
  const [d, m] = birthdayStr.split('/').map(Number);
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), m - 1, d);
  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);
  return Math.floor((thisYear.getTime() - now.getTime()) / 86400000);
}
