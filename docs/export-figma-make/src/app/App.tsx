import { useState } from 'react';
import {
  Patient, PatientDocument, Notice, DocumentType, TeamMember,
  FULL_PERMISSION, VIEWER_PERMISSION,
  formatDocId, formatDate, formatTime, getDocumentTitle,
  STAFF_MEMBERS,
} from './types';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { PatientsListScreen } from './components/screens/PatientsListScreen';
import { PatientDetailScreen } from './components/screens/PatientDetailScreen';
import { PatientFormScreen } from './components/screens/PatientFormScreen';
import { NewDocumentScreen } from './components/screens/NewDocumentScreen';
import { DocumentFormScreen } from './components/screens/DocumentFormScreen';
import { DocumentViewScreen } from './components/screens/DocumentViewScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TeamScreen } from './components/screens/TeamScreen';
import { BottomNav } from './components/ui/BottomNav';

type AppScreen =
  | 'splash' | 'login' | 'home' | 'patients' | 'settings' | 'documents'
  | 'patient-detail' | 'patient-form'
  | 'new-document' | 'document-form' | 'document-view'
  | 'team';

const _now = Date.now();
const ago = (ms: number) => _now - ms;
const H = (h: number) => h * 3_600_000;
const D = (d: number) => d * 86_400_000;

function mkDoc(
  id: string, docId: string, patientId: string, type: DocumentType,
  ts: number, author: string, content: Record<string, any>,
  status: PatientDocument['status'] = 'signed',
  extraVersions: PatientDocument['versions'] = [],
): PatientDocument {
  const d = new Date(ts);
  const dateStr = formatDate(d);
  const timeStr = formatTime(d);
  const baseVersions: PatientDocument['versions'] = [
    { version: 1, action: 'created', timestamp: ts, date: dateStr, time: timeStr, author },
    ...extraVersions,
  ];
  return {
    id, docId, patientId, type,
    title: getDocumentTitle(type),
    status, currentVersion: baseVersions.length,
    timestamp: ts,
    createdAt: dateStr, createdTime: timeStr,
    updatedAt: dateStr, updatedTime: timeStr,
    createdBy: author, content,
    versions: baseVersions,
  };
}

const INITIAL_PATIENTS: Patient[] = [
  {
    id: '1', name: 'João Silva', nickname: 'Joãozinho',
    birthDate: '15/06/1993', cpf: '123.456.789-00', rg: '12.345.678-9',
    nationality: 'Brasileira', naturalidade: 'São Paulo', municipio: 'São Paulo - SP',
    fatherName: 'José da Silva', motherName: 'Maria da Silva',
    education: 'Ensino Médio Completo', profession: 'Auxiliar de Serviços Gerais',
    color: 'Parda', maritalStatus: 'Casado', hasChildren: true,
    address: 'Rua das Flores, 123', bairro: 'Jardim América',
    municipioEndereco: 'São Paulo', estado: 'SP',
    admissionDate: '10/04/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Crack'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '15',
    firstIllicitDrug: 'Maconha/Haxixe', firstIllicitDrugAge: '17',
    responsibles: [{
      id: 'r1-1', name: 'Maria Oliveira Silva', relationship: 'Esposa',
      cpf: '987.654.321-00', rg: '98.765.432-1',
      address: 'Rua das Flores, 123 - Jardim América, São Paulo - SP',
      contact: '(11) 98888-8888', date: '10/04/2026',
    }],
  },
  {
    id: '2', name: 'Marcos Santos', nickname: 'Marquinho',
    birthDate: '22/08/1998', cpf: '234.567.890-11', rg: '23.456.789-0',
    nationality: 'Brasileira', naturalidade: 'Rio de Janeiro', municipio: 'Rio de Janeiro - RJ',
    fatherName: 'Carlos Santos', motherName: 'Ana Lucia Santos',
    education: 'Ensino Superior Incompleto', profession: 'Estudante',
    color: 'Branca', maritalStatus: 'Solteiro', hasChildren: false,
    address: 'Av. Brasil, 456', bairro: 'Centro',
    municipioEndereco: 'Rio de Janeiro', estado: 'RJ',
    admissionDate: '09/07/2026', convenio: 'Particular',
    dependencies: ['Álcool', 'Cocaína', 'Ecstasy/MDMA'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '16',
    firstIllicitDrug: 'Cocaína', firstIllicitDrugAge: '19',
    responsibles: [{
      id: 'r2-1', name: 'Carlos Santos', relationship: 'Pai',
      cpf: '345.678.901-22', contact: '(21) 97777-7777', date: '09/07/2026',
    }],
  },
  {
    id: '3', name: 'Pedro Oliveira', nickname: 'Pedrinho',
    birthDate: '03/03/1981', cpf: '345.678.901-22',
    nationality: 'Brasileira', naturalidade: 'Belo Horizonte', municipio: 'Belo Horizonte - MG',
    motherName: 'Conceição Oliveira',
    education: 'Ensino Fundamental Completo', profession: 'Autônomo',
    color: 'Parda', maritalStatus: 'Divorciado', hasChildren: true,
    address: 'Rua Minas Gerais, 789', bairro: 'Santa Efigênia',
    municipioEndereco: 'Belo Horizonte', estado: 'MG',
    admissionDate: '09/06/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Crack', 'Inalantes/Cola/Solventes/Thinner'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '13',
    firstIllicitDrug: 'Crack', firstIllicitDrugAge: '22',
    responsibles: [{
      id: 'r3-1', name: 'Conceição Oliveira', relationship: 'Mãe',
      contact: '(31) 96666-6666', date: '09/06/2026',
    }],
  },
  {
    id: '4', name: 'André Costa', nickname: 'Andrezinho',
    birthDate: '07/12/2003', cpf: '456.789.012-33',
    nationality: 'Brasileira', naturalidade: 'Salvador', municipio: 'Salvador - BA',
    motherName: 'Joana Costa',
    education: 'Ensino Médio Completo', profession: 'Desempregado',
    color: 'Preta', maritalStatus: 'Solteiro', hasChildren: false,
    address: 'Rua da Bahia, 321', bairro: 'Pelourinho',
    municipioEndereco: 'Salvador', estado: 'BA',
    admissionDate: '06/08/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Maconha/Haxixe'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '17',
    firstIllicitDrug: 'Maconha/Haxixe', firstIllicitDrugAge: '18',
    responsibles: [{
      id: 'r4-1', name: 'Joana Costa', relationship: 'Mãe',
      contact: '(71) 95555-5555', date: '06/08/2026',
    }],
  },
  {
    id: '5', name: 'Carlos Ferreira', nickname: 'Carlão',
    birthDate: '14/10/1988', cpf: '567.890.123-44',
    nationality: 'Brasileira', naturalidade: 'Curitiba', municipio: 'Curitiba - PR',
    fatherName: 'Paulo Ferreira', motherName: 'Silvia Ferreira',
    education: 'Ensino Superior Completo', profession: 'Engenheiro',
    color: 'Branca', maritalStatus: 'Casado', hasChildren: true,
    address: 'Rua das Araucárias, 654', bairro: 'Batel',
    municipioEndereco: 'Curitiba', estado: 'PR',
    admissionDate: '10/05/2026', convenio: 'Unimed',
    dependencies: ['Álcool', 'Diazepam'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '18',
    firstIllicitDrug: 'Maconha/Haxixe', firstIllicitDrugAge: '20',
    responsibles: [{
      id: 'r5-1', name: 'Patricia Ferreira', relationship: 'Esposa',
      contact: '(41) 94444-4444', date: '10/05/2026',
    }],
  },
  {
    id: '6', name: 'Júlio Alves', nickname: 'Júlio',
    birthDate: '30/08/1995', cpf: '678.901.234-55',
    nationality: 'Brasileira', naturalidade: 'Porto Alegre', municipio: 'Porto Alegre - RS',
    motherName: 'Rosa Alves',
    education: 'Ensino Superior Incompleto', profession: 'Balconista',
    color: 'Branca', maritalStatus: 'Solteiro', hasChildren: false,
    address: 'Av. Ipiranga, 987', bairro: 'Floresta',
    municipioEndereco: 'Porto Alegre', estado: 'RS',
    admissionDate: '09/07/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Maconha/Haxixe', 'Cocaína'],
    responsibles: [{
      id: 'r6-1', name: 'Rosa Alves', relationship: 'Mãe',
      contact: '(51) 93333-3333', date: '09/07/2026',
    }],
  },
  {
    id: '7', name: 'Roberto Lima', nickname: 'Beto',
    birthDate: '18/11/1983', cpf: '789.012.345-66',
    nationality: 'Brasileira', naturalidade: 'Manaus', municipio: 'Manaus - AM',
    fatherName: 'Fernando Lima', motherName: 'Lucia Lima',
    education: 'Ensino Fundamental Incompleto', profession: 'Pescador',
    color: 'Parda', maritalStatus: 'Separado', hasChildren: true,
    address: 'Rua do Comércio, 147', bairro: 'São Jorge',
    municipioEndereco: 'Manaus', estado: 'AM',
    admissionDate: '17/07/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Crack', 'Maconha/Haxixe'],
    firstLicitDrug: 'Álcool', firstLicitDrugAge: '12',
    firstIllicitDrug: 'Maconha/Haxixe', firstIllicitDrugAge: '14',
    responsibles: [{
      id: 'r7-1', name: 'Lucia Lima', relationship: 'Mãe',
      contact: '(92) 92222-2222', date: '17/07/2026',
    }],
  },
  {
    id: '8', name: 'Fernando Souza', nickname: 'Fernandinho',
    birthDate: '25/02/1991', cpf: '890.123.456-77',
    nationality: 'Brasileira', naturalidade: 'Fortaleza', municipio: 'Fortaleza - CE',
    motherName: 'Terezinha Souza',
    education: 'Ensino Médio Completo', profession: 'Vendedor',
    color: 'Parda', maritalStatus: 'Viúvo', hasChildren: true,
    address: 'Rua do Sol, 258', bairro: 'Meireles',
    municipioEndereco: 'Fortaleza', estado: 'CE',
    admissionDate: '09/06/2026', convenio: 'SUS',
    dependencies: ['Álcool', 'Cocaína'],
    responsibles: [{
      id: 'r8-1', name: 'Terezinha Souza', relationship: 'Mãe',
      contact: '(85) 91111-1111', date: '09/06/2026',
    }],
  },
];

const INITIAL_DOCUMENTS: PatientDocument[] = [
  // João Silva (id: '1')
  mkDoc('d1', 'DOC-000001', '1', 'ficha-acolhimento', ago(D(121)), 'Abel Rodrigues', {}, 'signed'),
  mkDoc('d2', 'DOC-000002', '1', 'evolucao-geral', ago(D(1)), 'Dra. Ana Paula',
    { notes: 'Paciente demonstra evolução positiva. Participação ativa nas atividades em grupo. Relatou melhora no sono e disposição geral.' }, 'signed'),
  mkDoc('d3', 'DOC-000003', '1', 'termo-acolhimento', ago(H(2)), 'Abel Rodrigues',
    { listaPertencos: 'Documentos pessoais, roupas (3 mudas), artigos de higiene, fotografias da família, livro de orações.' }, 'pending-signature'),

  // Marcos Santos (id: '2')
  mkDoc('d4', 'DOC-000004', '2', 'ficha-acolhimento', ago(D(31)), 'Abel Rodrigues', {}, 'signed'),
  mkDoc('d5', 'DOC-000005', '2', 'controle-saida', ago(15 * 60_000), 'Enf. Maria Rodrigues',
    { dataSaida: '09/08/2026', horaSaida: '11:45', dataRetorno: '09/08/2026', horaRetorno: '17:00', motivo: 'Consulta médica externa na UBS.' }, 'pending-signature'),

  // Pedro Oliveira (id: '3')
  mkDoc('d6', 'DOC-000006', '3', 'ficha-acolhimento', ago(D(61)), 'Abel Rodrigues', {}, 'signed'),
  {
    ...mkDoc('d7', 'DOC-000007', '3', 'evolucao-geral', ago(D(3)), 'Dra. Ana Paula',
      { notes: 'Paciente apresentou comportamento agitado durante a tarde. Conversa com a equipe realizada. Redução da agitação observada após intervenção.' },
      'signed'),
    currentVersion: 2,
    versions: [
      {
        version: 1, action: 'created' as const,
        timestamp: ago(D(3)), date: formatDate(new Date(ago(D(3)))), time: '10:00',
        author: 'Dra. Ana Paula',
        contentSnapshot: { notes: 'Paciente em estado estável. Participando das atividades normalmente.' },
      },
      {
        version: 2, action: 'signed' as const,
        timestamp: ago(D(1)), date: formatDate(new Date(ago(D(1)))), time: '16:30',
        author: 'Dra. Ana Paula',
        fileName: 'DOC-000007_assinado.pdf',
      },
    ],
    signedPdfName: 'DOC-000007_assinado.pdf',
  },

  // André Costa (id: '4')
  mkDoc('d8', 'DOC-000008', '4', 'ficha-acolhimento', ago(D(3)), 'Abel Rodrigues', {}, 'signed'),

  // Carlos Ferreira (id: '5')
  mkDoc('d9', 'DOC-000009', '5', 'ficha-acolhimento', ago(D(91)), 'Abel Rodrigues', {}, 'signed'),
  {
    ...mkDoc('d10', 'DOC-000010', '5', 'evolucao-geral', ago(D(7)), 'Dra. Ana Paula',
      { notes: 'Registro incorreto. Documento criado por engano.' }, 'disabled'),
    currentVersion: 2,
    versions: [
      { version: 1, action: 'created' as const, timestamp: ago(D(10)), date: formatDate(new Date(ago(D(10)))), time: '09:00', author: 'Dra. Ana Paula' },
      { version: 2, action: 'disabled' as const, timestamp: ago(D(7)), date: formatDate(new Date(ago(D(7)))), time: '14:15', author: 'Abel Rodrigues', justification: 'Documento criado incorretamente. Dados não correspondem ao paciente.' },
    ],
  },

  // Júlio Alves (id: '6')
  mkDoc('d11', 'DOC-000011', '6', 'ficha-acolhimento', ago(D(31)), 'Abel Rodrigues', {}, 'signed'),
  mkDoc('d12', 'DOC-000012', '6', 'evolucao-geral', ago(D(2)), 'Abel Rodrigues',
    { notes: 'Paciente em boa evolução. Relatou sentir falta da família, mas demonstrou comprometimento com o tratamento. Participação positiva nas sessões em grupo.' }, 'signed'),

  // Roberto Lima (id: '7')
  mkDoc('d13', 'DOC-000013', '7', 'ficha-acolhimento', ago(D(23)), 'Abel Rodrigues', {}, 'signed'),
  mkDoc('d14', 'DOC-000014', '7', 'evolucao-geral', ago(H(3)), 'Enf. Maria Rodrigues',
    { notes: 'Paciente cooperativo durante o turno. Sinais vitais normais. Participou das atividades matinais com entusiasmo.' }, 'pending-signature'),

  // Fernando Souza (id: '8')
  mkDoc('d15', 'DOC-000015', '8', 'ficha-acolhimento', ago(D(61)), 'Abel Rodrigues', {}, 'signed'),
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    message: 'Reunião de equipe quinta-feira (14/08) às 14:30 no auditório. Presença obrigatória de todos os profissionais.',
    author: 'Abel Rodrigues',
    startDate: ago(D(2)),
    endDate: ago(-D(7)),
  },
  {
    id: 'n2',
    message: 'Visita de familiares programada para sábado (10/08). Familiares podem entrar a partir das 14h até às 17h.',
    author: 'Equipe Administrativa',
    startDate: ago(D(1)),
    endDate: ago(-D(2)),
  },
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't1', name: 'Abel Rodrigues', email: 'abel@reabilitah.com',
    role: 'Coordenador', status: 'active', joinDate: '01/01/2025',
    isAdmin: true, permissions: FULL_PERMISSION,
    auditLog: [{ action: 'Conta criada', by: 'Sistema', date: '01/01/2025', time: '08:00' }],
  },
  {
    id: 't2', name: 'Dra. Ana Paula', email: 'ana.paula@reabilitah.com',
    role: 'Psicóloga', status: 'active', joinDate: '15/03/2025',
    isAdmin: false,
    permissions: {
      ...VIEWER_PERMISSION,
      canCreateDocuments: true,
      canDisableDocuments: true,
      canViewAudit: true,
      canDownloadPdf: true,
      canAttachSignedPdf: true,
    },
    auditLog: [{ action: 'Conta criada', by: 'Abel Rodrigues', date: '15/03/2025', time: '10:00' }],
  },
  {
    id: 't3', name: 'Enf. Maria Rodrigues', email: 'maria.rodrigues@reabilitah.com',
    role: 'Enfermeira', status: 'active', joinDate: '20/04/2025',
    isAdmin: false,
    permissions: {
      ...VIEWER_PERMISSION,
      canCreateDocuments: true,
      canDownloadPdf: true,
      canAttachSignedPdf: true,
    },
    auditLog: [{ action: 'Conta criada', by: 'Abel Rodrigues', date: '20/04/2025', time: '14:00' }],
  },
  {
    id: 't4', name: 'Dr. Roberto Santos', email: 'roberto.santos@reabilitah.com',
    role: 'Psiquiatra', status: 'active', joinDate: '10/02/2025',
    isAdmin: false,
    permissions: VIEWER_PERMISSION,
    auditLog: [{ action: 'Conta criada', by: 'Abel Rodrigues', date: '10/02/2025', time: '09:00' }],
  },
  {
    id: 't5', name: 'Carlos Lima', email: 'carlos.lima@reabilitah.com',
    role: 'Monitor', status: 'active', joinDate: '05/05/2025',
    isAdmin: false,
    permissions: VIEWER_PERMISSION,
    auditLog: [{ action: 'Conta criada', by: 'Abel Rodrigues', date: '05/05/2025', time: '11:00' }],
  },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [documents, setDocuments] = useState<PatientDocument[]>(INITIAL_DOCUMENTS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [docCounter, setDocCounter] = useState(16);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('evolucao-geral');
  const [patientFormMode, setPatientFormMode] = useState<'new' | 'edit'>('new');
  const [patientDetailTab, setPatientDetailTab] = useState<'prontuario' | 'historico'>('prontuario');
  const [docViewFrom, setDocViewFrom] = useState<AppScreen>('patient-detail');

  const currentPatient = patients.find(p => p.id === selectedPatientId);
  const currentDocument = documents.find(d => d.id === selectedDocumentId);

  const pendingDocCount = documents.filter(d => d.status === 'pending-signature').length;

  const handleLogin = () => setScreen('home');
  const handleLogout = () => setScreen('login');

  const navigate = (to: AppScreen, patientId?: string) => {
    if (patientId) setSelectedPatientId(patientId);
    setScreen(to);
  };

  const goBack = () => {
    const backMap: Partial<Record<AppScreen, AppScreen>> = {
      'patient-detail': 'patients',
      'patient-form': patientFormMode === 'edit' ? 'patient-detail' : 'patients',
      'new-document': 'patient-detail',
      'document-form': 'new-document',
      'document-view': docViewFrom,
      'team': 'settings',
    };
    const dest = backMap[screen] || 'home';
    if (dest === 'patient-detail') setPatientDetailTab('historico');
    setScreen(dest);
  };

  const handleNewPatient = () => {
    setPatientFormMode('new');
    setSelectedPatientId('');
    setScreen('patient-form');
  };

  const handleEditPatient = (id: string) => {
    setSelectedPatientId(id);
    setPatientFormMode('edit');
    setScreen('patient-form');
  };

  const handleSavePatient = (data: Omit<Patient, 'id'>) => {
    if (patientFormMode === 'edit' && selectedPatientId) {
      setPatients(prev => prev.map(p =>
        p.id === selectedPatientId ? { ...p, ...data } : p,
      ));
      setPatientDetailTab('prontuario');
      setScreen('patient-detail');
    } else {
      const newId = String(Date.now());
      const newPatient: Patient = { ...data, id: newId };
      const now = new Date();
      const newDoc: PatientDocument = {
        id: 'new-' + newId,
        docId: formatDocId(docCounter),
        patientId: newId,
        type: 'ficha-acolhimento',
        title: getDocumentTitle('ficha-acolhimento'),
        status: 'pending-signature',
        currentVersion: 1,
        timestamp: Date.now(),
        createdAt: formatDate(now),
        createdTime: formatTime(now),
        updatedAt: formatDate(now),
        updatedTime: formatTime(now),
        createdBy: 'Abel Rodrigues',
        content: { ...data },
        versions: [{
          version: 1, action: 'created', timestamp: Date.now(),
          date: formatDate(now), time: formatTime(now), author: 'Abel Rodrigues',
        }],
      };
      setPatients(prev => [...prev, newPatient]);
      setDocuments(prev => [...prev, newDoc]);
      setDocCounter(prev => prev + 1);
      setSelectedPatientId(newId);
      setPatientDetailTab('prontuario');
      setScreen('patient-detail');
    }
  };

  const handleNewDocument = (patientId: string) => {
    setSelectedPatientId(patientId);
    setScreen('new-document');
  };

  const handleSelectDocumentType = (type: DocumentType) => {
    setSelectedDocumentType(type);
    setScreen('document-form');
  };

  const handleViewDocument = (docId: string, fromDocuments?: boolean) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) setSelectedPatientId(doc.patientId);
    setSelectedDocumentId(docId);
    setDocViewFrom(fromDocuments ? 'documents' : 'patient-detail');
    if (!fromDocuments) setPatientDetailTab('historico');
    setScreen('document-view');
  };

  const handleSaveDocument = (content: Record<string, any>) => {
    const now = new Date();
    const newId = 'doc-' + Date.now();
    const newDocId = formatDocId(docCounter);
    const newDoc: PatientDocument = {
      id: newId,
      docId: newDocId,
      patientId: selectedPatientId,
      type: selectedDocumentType,
      title: getDocumentTitle(selectedDocumentType),
      status: 'pending-signature',
      currentVersion: 1,
      timestamp: Date.now(),
      createdAt: formatDate(now),
      createdTime: formatTime(now),
      updatedAt: formatDate(now),
      updatedTime: formatTime(now),
      createdBy: 'Abel Rodrigues',
      content,
      versions: [{
        version: 1, action: 'created', timestamp: Date.now(),
        date: formatDate(now), time: formatTime(now), author: 'Abel Rodrigues',
      }],
    };
    setDocuments(prev => [...prev, newDoc]);
    setDocCounter(prev => prev + 1);
    setSelectedDocumentId(newId);
    setPatientDetailTab('historico');
    setScreen('document-view');
  };

  const handleDownloadPdf = (docId: string) => {
    const now = new Date();
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const alreadyDownloaded = d.versions.some(v => v.action === 'pdf-downloaded');
      if (alreadyDownloaded) return d;
      const nextVer = d.currentVersion + 1;
      return {
        ...d,
        currentVersion: nextVer,
        updatedAt: formatDate(now),
        updatedTime: formatTime(now),
        versions: [...d.versions, {
          version: nextVer,
          action: 'pdf-downloaded' as const,
          timestamp: Date.now(),
          date: formatDate(now),
          time: formatTime(now),
          author: 'Abel Rodrigues',
        }],
      };
    }));
  };

  const handleAttachSignedPdf = (docId: string, fileName: string) => {
    const now = new Date();
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const nextVer = d.currentVersion + 1;
      return {
        ...d,
        status: 'signed' as const,
        currentVersion: nextVer,
        signedPdfName: fileName,
        updatedAt: formatDate(now),
        updatedTime: formatTime(now),
        versions: [...d.versions, {
          version: nextVer,
          action: 'pdf-attached' as const,
          timestamp: Date.now(),
          date: formatDate(now),
          time: formatTime(now),
          author: 'Abel Rodrigues',
          fileName,
        }],
      };
    }));
  };

  const handleDisableDocument = (docId: string, reason: string) => {
    const now = new Date();
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const nextVer = d.currentVersion + 1;
      return {
        ...d,
        status: 'disabled' as const,
        currentVersion: nextVer,
        updatedAt: formatDate(now),
        updatedTime: formatTime(now),
        versions: [...d.versions, {
          version: nextVer,
          action: 'disabled' as const,
          timestamp: Date.now(),
          date: formatDate(now),
          time: formatTime(now),
          author: 'Abel Rodrigues',
          justification: reason,
        }],
      };
    }));
  };

  const handleReactivateDocument = (docId: string, reason: string) => {
    const now = new Date();
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const nextVer = d.currentVersion + 1;
      return {
        ...d,
        status: 'pending-signature' as const,
        currentVersion: nextVer,
        updatedAt: formatDate(now),
        updatedTime: formatTime(now),
        versions: [...d.versions, {
          version: nextVer,
          action: 'reactivated' as const,
          timestamp: Date.now(),
          date: formatDate(now),
          time: formatTime(now),
          author: 'Abel Rodrigues',
          justification: reason,
        }],
      };
    }));
  };

  const handleAddNotice = (notice: Omit<Notice, 'id'>) => {
    setNotices(prev => [...prev, { ...notice, id: 'n-' + Date.now() }]);
  };

  const handleSaveTeamMember = (member: Omit<TeamMember, 'id'>) => {
    setTeam(prev => [...prev, { ...member, id: 't-' + Date.now() }]);
  };

  const handleUpdateTeamMember = (id: string, data: Partial<TeamMember>) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const showBottomNav = ['home', 'patients', 'documents', 'settings'].includes(screen);

  return (
    <div className="size-full bg-background">
      {screen === 'splash' && (
        <SplashScreen onComplete={() => setScreen('login')} />
      )}

      {screen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {screen === 'home' && (
        <DashboardScreen
          userName="Abel Rodrigues"
          patients={patients}
          documents={documents}
          notices={notices}
          staff={STAFF_MEMBERS}
          onNavigate={(page, id) => navigate(page as AppScreen, id)}
          onAddNotice={handleAddNotice}
        />
      )}

      {screen === 'patients' && (
        <PatientsListScreen
          patients={patients}
          documents={documents}
          onNavigate={(page, id) => navigate(page as AppScreen, id)}
          onNewPatient={handleNewPatient}
        />
      )}

      {screen === 'documents' && (
        <DocumentsScreen
          patients={patients}
          documents={documents}
          signatures={[]}
          onViewDocument={(docId) => handleViewDocument(docId, true)}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'patient-detail' && currentPatient && (
        <PatientDetailScreen
          patient={currentPatient}
          patients={patients}
          documents={documents.filter(d => d.patientId === selectedPatientId)}
          defaultTab={patientDetailTab}
          onBack={goBack}
          onNavigate={(page, id) => navigate(page as AppScreen, id)}
          onEditPatient={handleEditPatient}
          onNewDocument={handleNewDocument}
          onViewDocument={handleViewDocument}
        />
      )}

      {screen === 'patient-form' && (
        <PatientFormScreen
          patient={patientFormMode === 'edit' ? currentPatient : undefined}
          onSave={handleSavePatient}
          onCancel={goBack}
        />
      )}

      {screen === 'new-document' && currentPatient && (
        <NewDocumentScreen
          patient={currentPatient}
          onSelectType={handleSelectDocumentType}
          onBack={goBack}
        />
      )}

      {screen === 'document-form' && currentPatient && (
        <DocumentFormScreen
          documentType={selectedDocumentType}
          patient={currentPatient}
          onSave={handleSaveDocument}
          onCancel={goBack}
        />
      )}

      {screen === 'document-view' && currentDocument && currentPatient && (
        <DocumentViewScreen
          document={currentDocument}
          patient={currentPatient}
          onBack={goBack}
          onDisable={handleDisableDocument}
          onReactivate={handleReactivateDocument}
          onAttachSignedPdf={handleAttachSignedPdf}
          onDownloadPdf={handleDownloadPdf}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          team={team}
          onLogout={handleLogout}
          onSaveTeamMember={handleSaveTeamMember}
          onUpdateTeamMember={handleUpdateTeamMember}
          onNavigateToTeam={() => setScreen('team')}
        />
      )}

      {screen === 'team' && (
        <TeamScreen
          team={team}
          onBack={goBack}
          onSaveTeamMember={handleSaveTeamMember}
          onUpdateTeamMember={handleUpdateTeamMember}
        />
      )}

      {showBottomNav && (
        <BottomNav
          active={screen}
          pendingCount={pendingDocCount}
          onNavigate={(page) => setScreen(page as AppScreen)}
        />
      )}
    </div>
  );
}
