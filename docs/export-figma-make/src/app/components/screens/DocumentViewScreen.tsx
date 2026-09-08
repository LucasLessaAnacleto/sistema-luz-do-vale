import { useState, useRef } from 'react';
import { ArrowLeft, Download, X, FileText, Clock, PowerOff, Power, Eye, Search,
  ChevronLeft, ChevronRight, Upload, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PatientDocument, Patient, DocumentVersion, getStatusLabel, getStatusBadgeVariant } from '../../types';

interface DocumentViewScreenProps {
  document: PatientDocument;
  patient: Patient;
  onBack: () => void;
  onDisable: (docId: string, reason: string) => void;
  onReactivate: (docId: string, reason: string) => void;
  onAttachSignedPdf: (docId: string, fileName: string) => void;
  onDownloadPdf: (docId: string) => void;
}

// ─── Document content renderers ──────────────────────────────────────────────

function DocField({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="border-b border-gray-100 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 leading-snug">{value}</p>
    </div>
  );
}

function DocumentContent({ doc, patient, snapshot }: {
  doc: PatientDocument;
  patient: Patient;
  snapshot?: Record<string, any>;
}) {
  const content = snapshot ?? doc.content;

  if (doc.type === 'ficha-acolhimento') {
    return (
      <div className="space-y-5">
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-1">Identificação</p>
          <div className="grid grid-cols-2 gap-x-8">
            <DocField label="Nome" value={patient.name} />
            <DocField label="Apelido" value={patient.nickname} />
            <DocField label="CPF" value={patient.cpf} />
            <DocField label="RG" value={patient.rg} />
            <DocField label="Data de Nascimento" value={patient.birthDate} />
            <DocField label="Naturalidade" value={patient.naturalidade} />
            <DocField label="Município" value={patient.municipio} />
            <DocField label="Nacionalidade" value={patient.nationality} />
            <DocField label="Cor/Raça" value={patient.color} />
            <DocField label="Estado Civil" value={patient.maritalStatus} />
            <DocField label="Escolaridade" value={patient.education} />
            <DocField label="Profissão" value={patient.profession} />
            <DocField label="Convênio" value={patient.convenio ?? 'SUS'} />
            <DocField label="Data de Admissão" value={patient.admissionDate} />
          </div>
          {patient.address && (
            <DocField label="Endereço" value={[patient.address, patient.bairro, patient.municipioEndereco && `${patient.municipioEndereco}/${patient.estado}`].filter(Boolean).join(', ')} />
          )}
        </section>
        {patient.fatherName && <DocField label="Nome do Pai" value={patient.fatherName} />}
        {patient.motherName && <DocField label="Nome da Mãe" value={patient.motherName} />}
        {patient.dependencies && patient.dependencies.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 pb-1">Dependências</p>
            <p className="text-sm text-gray-800">{patient.dependencies.join(', ')}</p>
            <div className="grid grid-cols-2 gap-x-8 mt-2">
              <DocField label="Primeira droga lícita" value={patient.firstLicitDrug} />
              <DocField label="Idade no 1º uso" value={patient.firstLicitDrugAge} />
              <DocField label="Primeira droga ilícita" value={patient.firstIllicitDrug} />
              <DocField label="Idade no 1º uso" value={patient.firstIllicitDrugAge} />
            </div>
          </section>
        )}
        {patient.responsibles && patient.responsibles.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 border-b border-gray-100 pb-1">Responsável Legal</p>
            {patient.responsibles.map(r => (
              <div key={r.id} className="grid grid-cols-2 gap-x-8">
                <DocField label="Nome" value={r.name} />
                <DocField label="Parentesco" value={r.relationship} />
                <DocField label="CPF" value={r.cpf} />
                <DocField label="Contato" value={r.contact} />
                {r.address && <div className="col-span-2"><DocField label="Endereço" value={r.address} /></div>}
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }

  if (doc.type === 'termo-acolhimento') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-800 leading-relaxed">
          Estou ciente de que o tratamento é de caráter gratuito, sendo que fico isento de pagar qualquer valor
          referente à mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para
          inclusão no tratamento, com as quais concordo, e estou ciente dos meus direitos e deveres junto a
          esta instituição.
        </p>
        {content.listaPertencos && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Lista de Pertences</p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-3">
              {content.listaPertencos}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (doc.type === 'controle-saida') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-8">
          <DocField label="Data de saída" value={content.dataSaida} />
          <DocField label="Horário de saída" value={content.horaSaida} />
          <DocField label="Data de retorno" value={content.dataRetorno} />
          <DocField label="Horário de retorno" value={content.horaRetorno} />
        </div>
        {content.motivo && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1.5">Motivo da saída</p>
            <p className="text-sm text-gray-800 leading-relaxed">{content.motivo}</p>
          </div>
        )}
      </div>
    );
  }

  if (doc.type === 'evolucao-geral') {
    return (
      <div className="space-y-4">
        <div className="border-b border-gray-100 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Acolhido</p>
          <p className="text-sm text-gray-900 font-medium mt-0.5">{content.patientName || patient.name}</p>
        </div>
        {content.notes && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Registro de Evolução</p>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{content.notes}</p>
          </div>
        )}
      </div>
    );
  }

  return <p className="text-sm text-gray-500 italic">Conteúdo não disponível para visualização.</p>;
}

// ─── A4 Document view ─────────────────────────────────────────────────────────

function A4Document({ doc, patient, snapshot, versionLabel }: {
  doc: PatientDocument;
  patient: Patient;
  snapshot?: Record<string, any>;
  versionLabel?: string;
}) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      {/* Institutional header */}
      <div className="border-b-2 border-gray-800 px-8 py-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-700">Centro de Recuperação Luz do Vale</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Sistema Reabilitah · Prontuário Eletrônico</p>
            <p className="text-[10px] text-gray-400">Av. Principal, 100 · Itajaí - SC</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">{doc.docId}</p>
            <Badge variant={getStatusBadgeVariant(doc.status)} className="mt-1 text-[10px]">
              {getStatusLabel(doc.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Document title */}
      <div className="px-8 py-5 border-b border-gray-100 text-center">
        <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{doc.title}</h1>
        {versionLabel && (
          <p className="text-xs text-gray-400 mt-1">{versionLabel}</p>
        )}
      </div>

      {/* Patient identification */}
      <div className="px-8 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Paciente / Acolhido</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">
          {patient.name}{patient.nickname ? ` — "${patient.nickname}"` : ''}
        </p>
        <p className="text-xs text-gray-500">Admissão: {patient.admissionDate} · Convênio: {patient.convenio || 'SUS'}</p>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        <DocumentContent doc={doc} patient={patient} snapshot={snapshot} />
      </div>

      {/* Signatures area */}
      {doc.signedPdfName && (
        <div className="px-8 py-4 border-t border-gray-200 bg-green-50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-green-700">Documento assinado via GOV.BR</p>
              <p className="text-[10px] text-green-600">{doc.signedPdfName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical footer */}
      <div className="px-8 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          {doc.docId} · v{doc.currentVersion} · Criado por: {doc.createdBy} · {doc.createdAt} {doc.createdTime} · {getStatusLabel(doc.status)}
        </p>
        <p className="text-[10px] text-gray-400">
          Paciente: {patient.name} · Documento gerado pelo sistema Reabilitah
        </p>
      </div>
    </div>
  );
}

// ─── Action modals ────────────────────────────────────────────────────────────

function DisableModal({ onConfirm, onCancel }: { onConfirm: (reason: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28 }}
        className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground">Desativar documento</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          O documento será desativado mas permanecerá armazenado e disponível na auditoria.
          Informe o motivo obrigatoriamente.
        </p>
        <label className="block text-sm font-medium text-foreground mb-1.5">Motivo da desativação *</label>
        <textarea
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder='Ex.: "Documento criado incorretamente."'
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
            Cancelar
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 rounded-xl bg-destructive text-white py-3 font-medium text-sm disabled:opacity-40"
          >
            Confirmar desativação
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReactivateModal({ onConfirm, onCancel }: { onConfirm: (reason: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28 }}
        className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground">Reativar documento</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          O documento voltará ao status <strong>Pendente de assinatura</strong>.
          Informe o motivo da reativação obrigatoriamente.
        </p>
        <label className="block text-sm font-medium text-foreground mb-1.5">Motivo da reativação *</label>
        <textarea
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder='Ex.: "Documento desativado indevidamente."'
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
            Cancelar
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm disabled:opacity-40"
          >
            Confirmar reativação
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AttachPdfModal({ onConfirm, onCancel }: {
  onConfirm: (fileName: string) => void;
  onCancel: () => void;
}) {
  const [fileName, setFileName] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 28 }}
          className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
        >
          <h3 className="font-semibold text-lg text-foreground mb-2">Confirmar envio</h3>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">{fileName}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Você está enviando o PDF assinado deste documento. Após a confirmação,
            o arquivo será registrado no histórico como nova versão e ficará disponível na auditoria.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowConfirm(false)} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
              Cancelar
            </button>
            <button onClick={() => onConfirm(fileName)} className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm">
              Confirmar envio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28 }}
        className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground">Anexar PDF assinado</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione o PDF assinado via GOV.BR para enviar ao sistema.
          Somente arquivos PDF são aceitos.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {fileName ? (
          <div className="border border-border rounded-xl p-4 mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">PDF selecionado</p>
            </div>
            <button onClick={() => { setFileName(''); if (fileRef.current) fileRef.current.value = ''; }}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 mb-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Selecionar arquivo PDF</p>
            <p className="text-xs text-muted-foreground">Clique para escolher o arquivo</p>
          </button>
        )}

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
            Cancelar
          </button>
          <button
            onClick={() => fileName && setShowConfirm(true)}
            disabled={!fileName}
            className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm disabled:opacity-40"
          >
            Visualizar e confirmar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DownloadModal({ docId, docTitle, onConfirm, onCancel }: {
  docId: string; docTitle: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28 }}
        className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-foreground">Baixar PDF para assinatura</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Assinatura via GOV.BR</p>
              <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                Baixe este documento, realize a assinatura através do{' '}
                <strong>GOV.BR</strong> e depois envie o PDF assinado novamente para o Reabilitah.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl p-4 mb-5 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{docTitle}</p>
            <p className="text-xs text-muted-foreground">{docId} — versão original</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Version navigation panel ─────────────────────────────────────────────────

const versionActionLabel: Record<string, string> = {
  created: 'Documento criado',
  'pdf-downloaded': 'PDF baixado para assinatura',
  'pdf-attached': 'PDF assinado anexado',
  disabled: 'Documento desativado',
  reactivated: 'Documento reativado',
  signed: 'Assinado',
};

const versionActionIcon = (action: string) => {
  if (action === 'created') return '📄';
  if (action === 'pdf-downloaded') return '⬇️';
  if (action === 'pdf-attached' || action === 'signed') return '✅';
  if (action === 'disabled') return '🚫';
  if (action === 'reactivated') return '♻️';
  return '📋';
};

const versionBadgeVariant = (action: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
  if (action === 'created') return 'info';
  if (action === 'pdf-attached' || action === 'signed') return 'success';
  if (action === 'disabled') return 'danger';
  if (action === 'reactivated') return 'warning';
  if (action === 'pdf-downloaded') return 'default';
  return 'default';
};

// ─── PDF preview ──────────────────────────────────────────────────────────────

function PdfPreviewModal({ doc, patient, onClose }: {
  doc: PatientDocument; patient: Patient; onClose: () => void;
}) {
  const handlePrint = () => {
    const content = `
<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8">
<title>${doc.docId} - ${doc.title}</title>
<style>
  body { font-family: Arial, sans-serif; color: #222; margin: 0; }
  .page { max-width: 794px; margin: 0 auto; padding: 40px; }
  .header { border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
  .header h1 { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px; }
  .header p { font-size: 11px; color: #666; margin: 1px 0; }
  .doc-title { font-size: 18px; font-weight: bold; text-align: center; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 4px; }
  .doc-id { text-align: center; font-size: 11px; color: #999; margin-bottom: 24px; }
  .patient-box { background: #f5f5f5; border: 1px solid #ddd; padding: 12px 16px; margin-bottom: 24px; }
  .label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
  .value { font-size: 13px; color: #222; margin-bottom: 12px; line-height: 1.4; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .footer { border-top: 1px solid #ccc; margin-top: 40px; padding-top: 10px; font-size: 10px; color: #aaa; }
  .signed-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; margin-top: 24px; border-radius: 4px; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style></head><body><div class="page">
  <div class="header">
    <div>
      <h1>Centro de Recuperação Luz do Vale</h1>
      <p>Sistema Reabilitah · Prontuário Eletrônico · Av. Principal, 100 · Itajaí - SC</p>
    </div>
    <div style="text-align:right;font-size:11px;color:#666">
      <p>Gerado: ${new Date().toLocaleString('pt-BR')}</p>
      <p>${doc.docId} · v${doc.currentVersion}</p>
      <p>${getStatusLabel(doc.status)}</p>
    </div>
  </div>
  <div class="doc-title">${doc.title}</div>
  <div class="doc-id">${doc.docId}</div>
  <div class="patient-box">
    <div class="label">Paciente / Acolhido</div>
    <div class="value" style="font-weight:bold">${patient.name}${patient.nickname ? ` — "${patient.nickname}"` : ''}</div>
    <div style="font-size:12px;color:#555">Admissão: ${patient.admissionDate} · Convênio: ${patient.convenio || 'SUS'}</div>
  </div>
  ${doc.type === 'termo-acolhimento' ? `<div class="value" style="line-height:1.7">Estou ciente de que o tratamento é de caráter gratuito...</div>${doc.content.listaPertencos ? `<div class="label">Lista de Pertences</div><div class="value">${doc.content.listaPertencos}</div>` : ''}` : ''}
  ${doc.type === 'controle-saida' ? `<div class="grid2"><div><div class="label">Saída</div><div class="value">${doc.content.dataSaida || '—'} ${doc.content.horaSaida || ''}</div></div><div><div class="label">Retorno</div><div class="value">${doc.content.dataRetorno || '—'} ${doc.content.horaRetorno || ''}</div></div></div>${doc.content.motivo ? `<div class="label">Motivo</div><div class="value">${doc.content.motivo}</div>` : ''}` : ''}
  ${doc.type === 'evolucao-geral' ? `<div class="label">Registro</div><div class="value" style="white-space:pre-wrap;line-height:1.7">${doc.content.notes || '—'}</div>` : ''}
  ${doc.type === 'ficha-acolhimento' ? `<div class="grid2"><div><div class="label">Nome</div><div class="value">${patient.name}</div></div><div><div class="label">Data de Admissão</div><div class="value">${patient.admissionDate}</div></div><div><div class="label">CPF</div><div class="value">${patient.cpf || '—'}</div></div><div><div class="label">Convênio</div><div class="value">${patient.convenio || 'SUS'}</div></div></div>` : ''}
  ${doc.signedPdfName ? `<div class="signed-box"><strong style="color:#166534">✓ Documento assinado via GOV.BR</strong><br><span style="font-size:12px;color:#15803d">${doc.signedPdfName}</span></div>` : `<div style="margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:48px"><div style="border-top:1px solid #333;padding-top:8px;text-align:center;font-size:12px;color:#666"><div style="height:48px"></div><p>Acolhido / Paciente</p></div><div style="border-top:1px solid #333;padding-top:8px;text-align:center;font-size:12px;color:#666"><div style="height:48px"></div><p>Responsável</p></div></div>`}
  <div class="footer">
    <p>${doc.docId} · v${doc.currentVersion} · ${doc.createdBy} · ${doc.createdAt} · ${getStatusLabel(doc.status)}</p>
    <p>Paciente: ${patient.name} · Documento gerado pelo sistema Reabilitah · Centro de Recuperação Luz do Vale</p>
  </div>
</div><script>window.onload=()=>window.print()</script></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(content); w.document.close(); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col z-50">
      <div className="bg-card flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h3 className="font-semibold text-foreground">Visualizar PDF</h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-medium">
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <A4Document doc={doc} patient={patient} />
        </div>
      </div>
    </div>
  );
}

// ─── Version viewer modal ─────────────────────────────────────────────────────

function VersionViewer({ doc, patient, versions, initialIndex, onClose }: {
  doc: PatientDocument;
  patient: Patient;
  versions: DocumentVersion[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const ver = versions[idx];

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col z-50">
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              Versão {ver.version} de {versions.length}
            </h3>
            <p className="text-xs text-muted-foreground">{versionActionLabel[ver.action]} · {ver.date} {ver.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setIdx(i => Math.min(versions.length - 1, i + 1))}
            disabled={idx === versions.length - 1}
            className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <A4Document
            doc={doc}
            patient={patient}
            snapshot={ver.contentSnapshot}
            versionLabel={`Versão ${ver.version} — ${versionActionLabel[ver.action]} · ${ver.date} ${ver.time} · Por: ${ver.author}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DocumentViewScreen({
  document: doc, patient, onBack, onDisable, onReactivate, onAttachSignedPdf, onDownloadPdf,
}: DocumentViewScreenProps) {
  const [tab, setTab] = useState<'documento' | 'auditoria'>('documento');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [versionViewer, setVersionViewer] = useState<{ index: number } | null>(null);

  const isPending = doc.status === 'pending-signature';
  const isSigned = doc.status === 'signed';
  const isDisabled = doc.status === 'disabled';

  const filteredVersions = [...doc.versions]
    .filter(v => {
      if (!auditSearch.trim()) return true;
      const q = auditSearch.toLowerCase();
      return (
        v.author.toLowerCase().includes(q) ||
        (v.justification ?? '').toLowerCase().includes(q) ||
        (v.fileName ?? '').toLowerCase().includes(q) ||
        (versionActionLabel[v.action] ?? '').toLowerCase().includes(q) ||
        v.date.includes(q) ||
        String(v.version).includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{doc.title}</h1>
            <p className="text-xs text-muted-foreground">{doc.docId} · v{doc.currentVersion}</p>
          </div>
          <Badge variant={getStatusBadgeVariant(doc.status)}>
            {getStatusLabel(doc.status)}
          </Badge>
        </div>

        {/* Patient chip */}
        <div className="flex items-center gap-2 bg-accent rounded-xl px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {patient.name.charAt(0)}
          </div>
          <p className="text-sm font-medium text-foreground">{patient.name}</p>
          {patient.nickname && <p className="text-xs text-muted-foreground italic">"{patient.nickname}"</p>}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6">
        <div className="flex gap-1">
          {[
            { key: 'documento', label: 'Documento', icon: FileText },
            { key: 'auditoria', label: 'Auditoria', icon: Clock },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">

        {/* ── Documento tab ── */}
        {tab === 'documento' && (
          <div className="space-y-4">
            {/* Status banner */}
            {isDisabled && (
              <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Documento desativado</p>
                  <p className="text-xs text-destructive/80">
                    {doc.versions.findLast(v => v.action === 'disabled')?.justification ?? 'Sem justificativa registrada'}
                  </p>
                </div>
              </div>
            )}

            {/* GOV.BR signing flow for pending documents */}
            {isPending && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-800">Aguardando assinatura via GOV.BR</p>
                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                      Baixe o PDF, realize a assinatura no portal GOV.BR e depois anexe o arquivo assinado aqui.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium"
                  >
                    <Download className="w-4 h-4" /> Baixar PDF para assinatura
                  </button>
                  <button
                    onClick={() => setShowAttachModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-blue-300 text-blue-700 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" /> Anexar PDF assinado
                  </button>
                </div>
              </div>
            )}

            {/* Signed — quick actions */}
            {isSigned && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPdfPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-foreground text-sm font-medium"
                >
                  <Eye className="w-4 h-4" /> Visualizar PDF
                </button>
                <button
                  onClick={() => { onDownloadPdf(doc.id); setShowPdfPreview(true); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-foreground text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Baixar PDF
                </button>
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium"
                >
                  <PowerOff className="w-4 h-4" /> Desativar
                </button>
              </div>
            )}

            {/* Disabled — actions */}
            {isDisabled && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPdfPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-foreground text-sm font-medium"
                >
                  <Eye className="w-4 h-4" /> Visualizar
                </button>
                <button
                  onClick={() => setShowReactivateModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-success/10 text-success text-sm font-medium"
                >
                  <Power className="w-4 h-4" /> Reativar
                </button>
              </div>
            )}

            {/* A4 document view */}
            <A4Document doc={doc} patient={patient} />
          </div>
        )}

        {/* ── Auditoria tab ── */}
        {tab === 'auditoria' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar no histórico..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {auditSearch && (
                <button onClick={() => setAuditSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="space-y-0">
              {filteredVersions.map((ver, i) => {
                const realIndex = doc.versions.indexOf(ver);
                return (
                  <div key={ver.version} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-sm shrink-0 mt-3">
                        <span>{versionActionIcon(ver.action)}</span>
                      </div>
                      {i < filteredVersions.length - 1 && (
                        <div className="w-0.5 bg-border flex-1 min-h-4 mt-1" />
                      )}
                    </div>

                    {/* Version card */}
                    <div className="flex-1 pb-4">
                      <Card className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Versão {String(ver.version).padStart(2, '0')}
                              </span>
                              <Badge variant={versionBadgeVariant(ver.action)} className="text-[10px] px-1.5 py-0.5">
                                {versionActionLabel[ver.action] || ver.action}
                              </Badge>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              Por: {ver.author}
                            </p>
                          </div>
                          <button
                            onClick={() => setVersionViewer({ index: realIndex })}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-accent text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver
                          </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {ver.date} às {ver.time}
                        </p>

                        {ver.justification && (
                          <div className="mt-2 bg-muted/40 rounded-lg px-3 py-2">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              <span className="font-semibold">Justificativa:</span> {ver.justification}
                            </p>
                          </div>
                        )}
                        {ver.fileName && (
                          <div className="mt-2 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                            <FileText className="w-3.5 h-3.5 text-green-600" />
                            <p className="text-xs text-green-700 font-medium">{ver.fileName}</p>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDisableModal && (
        <DisableModal
          onConfirm={reason => { onDisable(doc.id, reason); setShowDisableModal(false); }}
          onCancel={() => setShowDisableModal(false)}
        />
      )}
      {showReactivateModal && (
        <ReactivateModal
          onConfirm={reason => { onReactivate(doc.id, reason); setShowReactivateModal(false); }}
          onCancel={() => setShowReactivateModal(false)}
        />
      )}
      {showPdfPreview && (
        <PdfPreviewModal doc={doc} patient={patient} onClose={() => setShowPdfPreview(false)} />
      )}
      {showDownloadModal && (
        <DownloadModal
          docId={doc.docId}
          docTitle={doc.title}
          onConfirm={() => { onDownloadPdf(doc.id); setShowDownloadModal(false); setShowPdfPreview(true); }}
          onCancel={() => setShowDownloadModal(false)}
        />
      )}
      {showAttachModal && (
        <AttachPdfModal
          onConfirm={fileName => { onAttachSignedPdf(doc.id, fileName); setShowAttachModal(false); }}
          onCancel={() => setShowAttachModal(false)}
        />
      )}
      {versionViewer !== null && (
        <VersionViewer
          doc={doc}
          patient={patient}
          versions={doc.versions}
          initialIndex={versionViewer.index}
          onClose={() => setVersionViewer(null)}
        />
      )}
    </div>
  );
}
