import { useRef, useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Check, RotateCcw, PenLine, User, Briefcase, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { PatientDocument, Patient } from '../../types';
import { Avatar } from '../ui/Avatar';

interface SignatureScreenProps {
  document: PatientDocument;
  patient: Patient;
  step: 'responsible' | 'patient';
  onStepChange: (step: 'responsible' | 'patient') => void;
  onComplete: (responsibleSig: string, patientSig: string) => void;
  onCancel: () => void;
}

function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  if ('touches' in e) {
    const t = e.touches[0];
    return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
  }
  return {
    x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
    y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
  };
}

function SignatureCanvas({ onSigned, signerName }: {
  onSigned: (data: string) => void;
  signerName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    return { canvas, ctx };
  }, []);

  useEffect(() => {
    const refs = getCtx();
    if (!refs) return;
    const { canvas, ctx } = refs;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [getCtx, isExpanded]);

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const refs = getCtx();
    if (!refs) return;
    const { canvas, ctx } = refs;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
    setHasStrokes(true);
  }, [getCtx]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const refs = getCtx();
    if (!refs) return;
    const { canvas, ctx } = refs;
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getCtx]);

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleClear = () => {
    const refs = getCtx();
    if (!refs) return;
    const { canvas, ctx } = refs;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;
    onSigned(canvas.toDataURL('image/png'));
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full border-2 border-dashed border-primary/40 rounded-2xl py-8 flex flex-col items-center gap-3 bg-white hover:bg-primary/5 transition-colors"
      >
        <PenLine className="w-8 h-8 text-primary/50" />
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{signerName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Clique para assinar</p>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Assinatura de</p>
        <p className="text-base font-semibold text-foreground">{signerName}</p>
      </div>

      {/* Landscape hint for mobile */}
      <div className="flex items-center gap-2 bg-info/10 rounded-xl px-3 py-2">
        <Smartphone className="w-4 h-4 text-info shrink-0" />
        <p className="text-xs text-info">Para melhor experiência, vire o celular na horizontal ao assinar.</p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={240}
          className="w-full h-44 border-2 border-dashed border-primary/40 rounded-2xl bg-white touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasStrokes && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <PenLine className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground/50">Assine aqui com o dedo ou stylus</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground"
        >
          <RotateCcw className="w-4 h-4" /> Limpar
        </button>
        <button
          onClick={handleConfirm}
          disabled={!hasStrokes}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" /> Confirmar assinatura
        </button>
      </div>
    </div>
  );
}

export function SignatureScreen({
  document: doc, patient, step, onStepChange, onComplete, onCancel,
}: SignatureScreenProps) {
  const [responsibleSig, setResponsibleSig] = useState('');

  // Step order: responsible (step 0) → patient (step 1)
  const stepIndex = step === 'responsible' ? 0 : 1;

  const handleResponsibleSigned = (data: string) => {
    setResponsibleSig(data);
    onStepChange('patient');
  };

  const handlePatientSigned = (data: string) => {
    onComplete(responsibleSig, data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Coleta de Assinaturas</h1>
            <p className="text-xs text-muted-foreground">Assinatura presencial</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-3">
          <Avatar name={patient.name} src={patient.photoUrl} size="sm" />
          <div>
            <p className="font-medium text-foreground text-sm">{patient.name}</p>
            <p className="text-xs text-muted-foreground">{doc.docId} · {doc.title}</p>
          </div>
        </div>
      </div>

      {/* Progress steps: Responsável → Paciente/Acolhido */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          {[
            { icon: Briefcase, label: 'Responsável', key: 'responsible' },
            { icon: User, label: 'Acolhido', key: 'patient' },
          ].map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    done ? 'bg-primary text-white' :
                    active ? 'bg-primary/20 text-primary ring-2 ring-primary' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium ${active ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {done ? 'Assinado' : active ? 'Aguardando assinatura' : 'Próximo'}
                  </p>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-0.5 rounded mx-1 ${done ? 'bg-primary' : active ? 'bg-primary/40' : 'bg-border'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature area */}
      <div className="px-6 py-6">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            {step === 'responsible' ? (
              <Briefcase className="w-5 h-5 text-primary" />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {step === 'responsible' ? 'Assinatura do profissional responsável' : 'Assinatura do acolhido'}
              </p>
              <p className="text-xs text-muted-foreground">
                {step === 'responsible'
                  ? 'O profissional responsável assina confirmando o documento'
                  : 'O paciente deve assinar no campo abaixo com o dedo ou stylus'}
              </p>
            </div>
          </div>

          {step === 'responsible' ? (
            <SignatureCanvas
              key="responsible-canvas"
              signerName="Abel Rodrigues"
              onSigned={handleResponsibleSigned}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SignatureCanvas
                key="patient-canvas"
                signerName={patient.name}
                onSigned={handlePatientSigned}
              />
            </motion.div>
          )}
        </div>

        <div className="bg-muted/30 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Método:</strong> Assinatura presencial (toque/stylus) · {new Date().toLocaleString('pt-BR')}
            <br />
            <strong>Documento:</strong> {doc.docId} v{doc.currentVersion} · {doc.title}
          </p>
        </div>
      </div>
    </div>
  );
}
