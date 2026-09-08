import { ArrowLeft, FileText, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Patient, DocumentType } from '../../types';
import { Avatar } from '../ui/Avatar';

interface NewDocumentScreenProps {
  patient: Patient;
  onSelectType: (type: DocumentType) => void;
  onBack: () => void;
}

const DOCUMENT_OPTIONS: { type: DocumentType; label: string; description: string; functional: boolean }[] = [
  {
    type: 'evolucao-enfermagem',
    label: 'Evolução de Enfermagem',
    description: 'Registro de evolução pela equipe de enfermagem',
    functional: false,
  },
  {
    type: 'ficha-acolhimento',
    label: 'Ficha de Acolhimento',
    description: 'Ficha completa de acolhimento do paciente',
    functional: false,
  },
  {
    type: 'avaliacao-enfermagem',
    label: 'Avaliação de Enfermagem',
    description: 'Avaliação inicial e periódica de enfermagem',
    functional: false,
  },
  {
    type: 'termo-acolhimento',
    label: 'Termo de Acolhimento',
    description: 'Declaração de aceite das normas da instituição',
    functional: true,
  },
  {
    type: 'controle-saida',
    label: 'Controle de Saída de Pacientes',
    description: 'Registro de saída temporária do paciente',
    functional: true,
  },
  {
    type: 'evolucao-geral',
    label: 'Evolução Geral',
    description: 'Registro de evolução geral da equipe técnica',
    functional: true,
  },
];

export function NewDocumentScreen({ patient, onSelectType, onBack }: NewDocumentScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Novo Documento</h1>
        </div>

        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-3">
          <Avatar name={patient.name} src={patient.photoUrl} size="sm" />
          <div>
            <p className="font-medium text-foreground text-sm">{patient.name}</p>
            {patient.nickname && <p className="text-xs text-muted-foreground italic">{patient.nickname}</p>}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-3">
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide mb-2">
          Selecione o tipo de documento
        </p>

        {DOCUMENT_OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => opt.functional && onSelectType(opt.type)}
            disabled={!opt.functional}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-colors ${
              opt.functional
                ? 'bg-card border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                : 'bg-muted/30 border-border/50 cursor-default opacity-70'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              opt.functional ? 'bg-primary/10' : 'bg-muted'
            }`}>
              {opt.functional ? (
                <FileText className="w-6 h-6 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${opt.functional ? 'text-foreground' : 'text-muted-foreground'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
              {!opt.functional && (
                <span className="inline-block mt-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Em desenvolvimento
                </span>
              )}
            </div>

            {opt.functional && <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
