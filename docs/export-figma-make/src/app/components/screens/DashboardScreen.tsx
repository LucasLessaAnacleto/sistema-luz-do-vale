import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Clock, FileText, TrendingUp, ChevronDown, Plus, X, Cake, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Patient, PatientDocument, Notice, StaffMember,
  calculateAge, daysUntilBirthday,
} from '../../types';

interface DashboardScreenProps {
  userName: string;
  patients: Patient[];
  documents: PatientDocument[];
  notices: Notice[];
  staff: StaffMember[];
  onNavigate: (page: string, id?: string) => void;
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
}

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export function DashboardScreen({
  userName, patients, documents, notices, staff, onNavigate, onAddNotice,
}: DashboardScreenProps) {
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showNewNotice, setShowNewNotice] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState('');
  const [noticeDays, setNoticeDays] = useState('7');

  // Indicators
  const activeCount = patients.length;
  const avgDays = patients.reduce((sum, p) => {
    const [d, m, y] = p.admissionDate.split('/').map(Number);
    const admission = new Date(y, m - 1, d);
    return sum + Math.floor((now.getTime() - admission.getTime()) / 86400000);
  }, 0) / (patients.length || 1);

  const allDocCount = documents.length;
  const pendingCount = documents.filter(d => d.status === 'pending-signature').length;

  const monthDocs = documents.filter(doc => {
    const [, m, y] = doc.createdAt.split('/').map(Number);
    return m - 1 === selMonth && y === selYear;
  }).length;

  // Active notices
  const activeNotices = notices.filter(n => n.startDate <= Date.now() && n.endDate >= Date.now());

  // Last 3 docs
  const lastDocs = [...documents]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  // Upcoming birthdays (next 30 days)
  type BdayEntry = { name: string; birthDate: string; type: 'patient' | 'staff'; age?: number; daysUntil: number; id?: string };
  const bdayList: BdayEntry[] = [];

  patients.forEach(p => {
    if (!p.birthDate) return;
    const dayMMDD = p.birthDate.slice(0, 5);
    const days = daysUntilBirthday(dayMMDD);
    if (days <= 30) {
      const age = calculateAge(p.birthDate);
      bdayList.push({ name: p.name, birthDate: p.birthDate, type: 'patient', age: (age ?? 0) + 1, daysUntil: days, id: p.id });
    }
  });

  staff.forEach(s => {
    const days = daysUntilBirthday(s.birthDate);
    if (days <= 30) {
      const age = now.getFullYear() - s.birthYear + (days === 0 ? 0 : 1);
      bdayList.push({ name: s.name, birthDate: s.birthDate, type: 'staff', age, daysUntil: days });
    }
  });

  bdayList.sort((a, b) => a.daysUntil - b.daysUntil);

  const handleAddNotice = () => {
    if (!noticeMsg.trim()) return;
    onAddNotice({
      message: noticeMsg,
      author: 'Abel Rodrigues',
      startDate: Date.now(),
      endDate: Date.now() + parseInt(noticeDays || '7') * 86400000,
    });
    setNoticeMsg('');
    setNoticeDays('7');
    setShowNewNotice(false);
  };

  const getStatusForDoc = (doc: PatientDocument) => {
    if (doc.status === 'disabled') return <Badge variant="danger">Desativado</Badge>;
    if (doc.status === 'pending-signature') return <Badge variant="warning">Pendente</Badge>;
    if (doc.status === 'signed') return <Badge variant="success">Assinado</Badge>;
    return null;
  };

  const prevMonth = () => {
    if (selMonth === 0) { setSelMonth(11); setSelYear(y => y - 1); }
    else setSelMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (selMonth === 11) { setSelMonth(0); setSelYear(y => y + 1); }
    else setSelMonth(m => m + 1);
  };

  const indicators = [
    { label: 'Pacientes Ativos', value: activeCount, icon: Users, highlight: false },
    { label: 'Média Internação (dias)', value: Math.round(avgDays), icon: Clock, highlight: false },
    { label: 'Documentos', value: allDocCount, icon: FileText, highlight: false },
    { label: 'Pendentes de Assinatura', value: pendingCount, icon: TrendingUp, highlight: pendingCount > 0 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-6">
        <div className="mb-5">
          <p className="text-white/70 text-sm mb-0.5">Olá,</p>
          <h1 className="text-2xl font-semibold">{userName}</h1>
        </div>

        {/* Compact 2×2 indicators grid */}
        <div className="grid grid-cols-2 gap-2">
          {indicators.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className={`rounded-xl p-3 ${s.highlight ? 'bg-warning/20 border border-warning/40' : 'bg-white/10 border border-white/5'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4 text-white/60" />
                    {s.highlight && s.value > 0 && (
                      <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                    )}
                  </div>
                  <p className="text-xl font-bold leading-none mb-1">{s.value}</p>
                  <p className="text-[11px] text-white/60 leading-tight">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Monthly docs inline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="mt-2 bg-white/10 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/60" />
            <p className="text-[11px] text-white/60">Documentos no mês</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">‹</button>
            <button
              onClick={() => setShowMonthPicker(v => !v)}
              className="flex items-center gap-0.5 text-xs font-medium bg-white/10 rounded-lg px-2 py-0.5"
            >
              {MONTH_NAMES[selMonth].slice(0, 3)} {selYear} <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
            <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">›</button>
            <span className="ml-2 text-xl font-bold">{monthDocs}</span>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 1. Quadro de Avisos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Quadro de Avisos
            </h2>
            <button
              onClick={() => setShowNewNotice(true)}
              className="flex items-center gap-1 text-sm text-primary font-medium"
            >
              <Plus className="w-4 h-4" /> Novo aviso
            </button>
          </div>

          {activeNotices.length === 0 ? (
            <Card className="text-center py-4">
              <p className="text-sm text-muted-foreground">Nenhum aviso ativo no momento</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {activeNotices.map(n => (
                <Card key={n.id} className="border-l-4 border-l-warning bg-warning/5 p-4">
                  <p className="text-sm text-foreground mb-1">{n.message}</p>
                  <p className="text-xs text-muted-foreground">Por {n.author}</p>
                </Card>
              ))}
            </div>
          )}

          {showNewNotice && (
            <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-card w-full max-w-lg rounded-t-3xl p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-lg text-foreground">Novo Aviso</h3>
                  <button onClick={() => setShowNewNotice(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Mensagem</label>
                    <textarea
                      value={noticeMsg}
                      onChange={e => setNoticeMsg(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Digite o aviso..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Duração (dias)</label>
                    <input
                      type="number"
                      value={noticeDays}
                      onChange={e => setNoticeDays(e.target.value)}
                      min="1"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    onClick={handleAddNotice}
                    className="w-full bg-primary text-white rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors"
                  >
                    Publicar Aviso
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* 2. Últimos Documentos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Últimos documentos criados</h2>
            <button onClick={() => onNavigate('documents')} className="text-sm text-primary font-medium">
              Ver todos
            </button>
          </div>
          {lastDocs.length === 0 ? (
            <Card className="text-center py-4">
              <p className="text-sm text-muted-foreground">Nenhum documento criado ainda</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {lastDocs.map(doc => {
                const patient = patients.find(p => p.id === doc.patientId);
                return (
                  <Card
                    key={doc.id}
                    hover
                    onClick={() => onNavigate('patient-detail', doc.patientId)}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{patient?.name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{doc.createdAt} · {doc.createdBy}</p>
                      </div>
                      {getStatusForDoc(doc)}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Próximos Aniversariantes */}
        {bdayList.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
              <Cake className="w-5 h-5 text-primary" />
              Próximos Aniversariantes
            </h2>
            <div className="space-y-2">
              {bdayList.map((b, i) => (
                <Card
                  key={i}
                  className={`flex items-center gap-4 p-4 cursor-pointer ${b.type === 'patient' ? 'border-secondary bg-secondary/10' : 'border-primary/30 bg-primary/5'}`}
                  onClick={b.id ? () => onNavigate('patient-detail', b.id) : undefined}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${b.type === 'patient' ? 'bg-secondary' : 'bg-primary'}`}>
                    <Cake className={`w-4 h-4 ${b.type === 'patient' ? 'text-secondary-foreground' : 'text-white'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.birthDate.slice(0, 5)} · {b.age} anos ·{' '}
                      {b.daysUntil === 0 ? 'Hoje!' : `em ${b.daysUntil} dia${b.daysUntil !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <Badge variant={b.type === 'patient' ? 'default' : 'success'}>
                    {b.type === 'patient' ? 'Paciente' : 'Equipe'}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
