import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Patient, DocumentType, getDocumentTitle } from '../../types';
import { Avatar } from '../ui/Avatar';

interface DocumentFormScreenProps {
  documentType: DocumentType;
  patient: Patient;
  onSave: (content: Record<string, any>) => void;
  onCancel: () => void;
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";
const textareaCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none";

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SaveConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 28 }}
        className="bg-card w-full max-w-lg rounded-t-3xl px-6 pt-6 pb-10"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground">Confirmar criação</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          O documento será salvo com status <strong>Pendente de assinatura</strong>.
          Após salvar, você poderá baixar o PDF e enviá-lo para assinatura via GOV.BR.
          Documentos criados não podem ser editados.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm">
            Salvar documento
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TermoAcolhimentoForm({ onSave, onCancel, patient }: {
  onSave: (c: Record<string, any>) => void;
  onCancel: () => void;
  patient: Patient;
}) {
  const [pertences, setPertences] = useState('');
  return (
    <div className="space-y-5">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground leading-relaxed">
          Estou ciente de que o tratamento é de caráter gratuito, sendo que fico isento de pagar qualquer valor
          referente à mensalidade para a instituição. Declaro ainda que fui esclarecido sobre as normas para
          inclusão no tratamento, com as quais concordo, e estou ciente dos meus direitos e deveres junto a
          esta instituição.
        </p>
      </div>

      <div className="bg-muted/30 rounded-xl p-3">
        <p className="text-sm font-medium text-foreground">
          Acolhido: <span className="text-primary">{patient.name}</span>
        </p>
        {patient.nickname && (
          <p className="text-xs text-muted-foreground italic mt-0.5">"{patient.nickname}"</p>
        )}
      </div>

      <FieldGroup label="Lista de Pertences">
        <textarea
          rows={5}
          className={textareaCls}
          value={pertences}
          onChange={e => setPertences(e.target.value)}
          placeholder="Liste os pertences do paciente que estão sob guarda da instituição..."
        />
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
          Cancelar
        </button>
        <button
          onClick={() => onSave({ listaPertencos: pertences })}
          className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm"
        >
          Revisar e salvar
        </button>
      </div>
    </div>
  );
}

function ControleSaidaForm({ onSave, onCancel }: {
  onSave: (c: Record<string, any>) => void;
  onCancel: () => void;
}) {
  const [dataSaida, setDataSaida] = useState('');
  const [horaSaida, setHoraSaida] = useState('');
  const [dataRetorno, setDataRetorno] = useState('');
  const [horaRetorno, setHoraRetorno] = useState('');
  const [motivo, setMotivo] = useState('');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Data de saída">
          <input className={inputCls} value={dataSaida} onChange={e => setDataSaida(e.target.value)} placeholder="DD/MM/AAAA" />
        </FieldGroup>
        <FieldGroup label="Horário de saída">
          <input className={inputCls} value={horaSaida} onChange={e => setHoraSaida(e.target.value)} placeholder="HH:MM" />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FieldGroup label="Data de retorno">
          <input className={inputCls} value={dataRetorno} onChange={e => setDataRetorno(e.target.value)} placeholder="DD/MM/AAAA" />
        </FieldGroup>
        <FieldGroup label="Horário de retorno">
          <input className={inputCls} value={horaRetorno} onChange={e => setHoraRetorno(e.target.value)} placeholder="HH:MM" />
        </FieldGroup>
      </div>

      <FieldGroup label="Motivo da saída">
        <textarea
          rows={3}
          className={textareaCls}
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          placeholder="Descreva o motivo da saída do paciente..."
        />
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
          Cancelar
        </button>
        <button
          onClick={() => onSave({ dataSaida, horaSaida, dataRetorno, horaRetorno, motivo })}
          className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm"
        >
          Revisar e salvar
        </button>
      </div>
    </div>
  );
}

function EvolucaoGeralForm({ onSave, onCancel, patient }: {
  onSave: (c: Record<string, any>) => void;
  onCancel: () => void;
  patient: Patient;
}) {
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-5">
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-foreground leading-relaxed">
          Nesta evolução consta o registro de forma geral da equipe técnica: coordenador, psicóloga e monitores,
          concernente à evolução do acolhido na instituição.
        </p>
      </div>

      <div className="bg-muted/30 rounded-xl p-3">
        <p className="text-sm font-medium text-foreground">
          Acolhido: <span className="text-primary">{patient.name}</span>
        </p>
        {patient.nickname && (
          <p className="text-xs text-muted-foreground italic mt-0.5">"{patient.nickname}"</p>
        )}
      </div>

      <FieldGroup label="Registro de evolução">
        <textarea
          rows={8}
          className={textareaCls}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Registre a evolução do paciente neste período..."
          autoFocus
        />
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
          Cancelar
        </button>
        <button
          onClick={() => onSave({ notes, patientName: patient.name })}
          className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm"
        >
          Revisar e salvar
        </button>
      </div>
    </div>
  );
}

export function DocumentFormScreen({
  documentType, patient, onSave, onCancel,
}: DocumentFormScreenProps) {
  const [pendingContent, setPendingContent] = useState<Record<string, any> | null>(null);
  const title = getDocumentTitle(documentType);

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Novo documento</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-3">
          <Avatar name={patient.name} src={patient.photoUrl} size="sm" />
          <p className="font-medium text-foreground text-sm">{patient.name}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        {documentType === 'termo-acolhimento' && (
          <TermoAcolhimentoForm onSave={setPendingContent} onCancel={onCancel} patient={patient} />
        )}
        {documentType === 'controle-saida' && (
          <ControleSaidaForm onSave={setPendingContent} onCancel={onCancel} />
        )}
        {documentType === 'evolucao-geral' && (
          <EvolucaoGeralForm onSave={setPendingContent} onCancel={onCancel} patient={patient} />
        )}
      </div>

      {pendingContent !== null && (
        <SaveConfirmModal
          onConfirm={() => {
            const c = pendingContent;
            setPendingContent(null);
            onSave(c);
          }}
          onCancel={() => setPendingContent(null)}
        />
      )}
    </div>
  );
}
