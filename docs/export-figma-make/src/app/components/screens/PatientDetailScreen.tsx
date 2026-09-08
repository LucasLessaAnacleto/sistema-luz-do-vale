import { useState } from 'react';
import { ArrowLeft, Edit3, Plus, FileText, User, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  Patient, PatientDocument, calculateAge, formatStayDuration, formatTimeSince,
} from '../../types';

interface PatientDetailScreenProps {
  patient: Patient;
  patients: Patient[];
  documents: PatientDocument[];
  defaultTab: 'prontuario' | 'historico';
  onBack: () => void;
  onNavigate: (page: string, id?: string) => void;
  onEditPatient: (id: string) => void;
  onNewDocument: (id: string) => void;
  onViewDocument: (docId: string) => void;
}

function InfoRow({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
  return (
    <div className="flex gap-2 py-1.5 border-b border-border/50 last:border-b-0">
      <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{display}</span>
    </div>
  );
}

function DocStatusBadge({ status }: { status: PatientDocument['status'] }) {
  if (status === 'disabled') return <Badge variant="danger">Desativado</Badge>;
  if (status === 'pending-signature') return <Badge variant="warning">Pendente</Badge>;
  if (status === 'signed') return <Badge variant="success">Assinado</Badge>;
  return null;
}

export function PatientDetailScreen({
  patient, documents, defaultTab,
  onBack, onEditPatient, onNewDocument, onViewDocument,
}: PatientDetailScreenProps) {
  const [tab, setTab] = useState<'prontuario' | 'historico'>(defaultTab);

  const age = calculateAge(patient.birthDate);
  const stayText = formatStayDuration(patient.admissionDate);

  const sortedDocs = [...documents].sort((a, b) => b.timestamp - a.timestamp);

  const tabs = [
    { key: 'prontuario', label: 'Prontuário' },
    { key: 'historico', label: 'Histórico' },
  ] as const;

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => onEditPatient(patient.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 text-sm font-medium">
              <Edit3 className="w-4 h-4" /> Editar
            </button>
            <button onClick={() => onNewDocument(patient.id)} className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar name={patient.name} src={patient.photoUrl} size="xl" className="border-4 border-white/30 shadow-lg" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold leading-tight">{patient.name}</h1>
            {patient.nickname && <p className="text-white/80 text-sm italic mb-1">{patient.nickname}</p>}
            {age !== null && <p className="text-white/90 font-medium">{age} anos</p>}
            <p className="text-white/70 text-sm">{stayText}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="flex">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${tab === t.key ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Prontuário tab */}
      {tab === 'prontuario' && (
        <div className="px-6 py-6 space-y-5">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Dados do Acolhido</h3>
            </div>
            <InfoRow label="Nome completo" value={patient.name} />
            <InfoRow label="Apelido" value={patient.nickname} />
            <InfoRow label="CPF" value={patient.cpf} />
            <InfoRow label="RG" value={patient.rg} />
            <InfoRow label="Data de nascimento" value={patient.birthDate} />
            <InfoRow label="Idade" value={age !== null ? `${age} anos` : undefined} />
            <InfoRow label="Nacionalidade" value={patient.nationality} />
            <InfoRow label="Naturalidade" value={patient.naturalidade} />
            <InfoRow label="Município (origem)" value={patient.municipio} />
            <InfoRow label="Nome do pai" value={patient.fatherName} />
            <InfoRow label="Nome da mãe" value={patient.motherName} />
            <InfoRow label="Escolaridade" value={patient.education} />
            <InfoRow label="Profissão" value={patient.profession} />
            <InfoRow label="Cor/Raça" value={patient.color} />
            <InfoRow label="Estado civil" value={patient.maritalStatus} />
            <InfoRow label="Filhos" value={patient.hasChildren} />
            <InfoRow label="Endereço" value={patient.address} />
            <InfoRow label="Bairro" value={patient.bairro} />
            <InfoRow label="Município (residência)" value={patient.municipioEndereco} />
            <InfoRow label="Estado" value={patient.estado} />
            <InfoRow label="Data de acolhimento" value={patient.admissionDate} />
            <InfoRow label="Convênio" value={patient.convenio} />
            <InfoRow label="Data de desligamento" value={patient.dischargeDate} />
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="font-semibold text-foreground">Tipos de Dependência</h3>
            </div>
            {patient.dependencies && patient.dependencies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {patient.dependencies.map(dep => (
                  <span key={dep} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                    {dep}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">Nenhuma dependência registrada</p>
            )}
            <div className="border-t border-border pt-3 space-y-1.5">
              <InfoRow label="Primeira droga lícita" value={patient.firstLicitDrug ? `${patient.firstLicitDrug} (${patient.firstLicitDrugAge} anos)` : undefined} />
              <InfoRow label="Primeira droga ilícita" value={patient.firstIllicitDrug ? `${patient.firstIllicitDrug} (${patient.firstIllicitDrugAge} anos)` : undefined} />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Dados dos Responsáveis</h3>
            </div>
            {patient.responsibles && patient.responsibles.length > 0 ? (
              <div className="space-y-4">
                {patient.responsibles.map((r, i) => (
                  <div key={r.id} className={`${i > 0 ? 'border-t border-border pt-4' : ''}`}>
                    <p className="text-xs text-muted-foreground uppercase font-medium mb-2">Responsável {i + 1}</p>
                    <InfoRow label="Nome" value={r.name} />
                    <InfoRow label="Parentesco" value={r.relationship} />
                    <InfoRow label="CPF" value={r.cpf} />
                    <InfoRow label="RG" value={r.rg} />
                    <InfoRow label="Contato" value={r.contact} />
                    <InfoRow label="Endereço" value={r.address} />
                    <InfoRow label="Data" value={r.date} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum responsável cadastrado</p>
            )}
          </Card>
        </div>
      )}

      {/* Histórico tab */}
      {tab === 'historico' && (
        <div className="px-6 py-6">
          {sortedDocs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">Nenhum documento ainda</p>
              <p className="text-sm text-muted-foreground mt-1">Toque em "+" para criar o primeiro documento</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-4">
                {sortedDocs.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="relative pl-14"
                  >
                    <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center shadow ${
                      doc.status === 'disabled' ? 'bg-destructive' :
                      doc.status === 'pending-signature' ? 'bg-warning' : 'bg-primary'
                    }`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <Card hover onClick={() => onViewDocument(doc.id)} className="cursor-pointer p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.docId}</p>
                        </div>
                        <DocStatusBadge status={doc.status} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{doc.createdAt} · {doc.createdTime}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Por {doc.createdBy}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{formatTimeSince(doc.timestamp)}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
