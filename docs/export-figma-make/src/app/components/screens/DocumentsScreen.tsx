import { useState, useMemo } from 'react';
import { Search, Filter, X, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import {
  Patient, PatientDocument, DocumentType,
  getStatusLabel, getStatusBadgeVariant, getDocumentTitle, formatTimeSince,
} from '../../types';

interface DocumentsScreenProps {
  patients: Patient[];
  documents: PatientDocument[];
  signatures?: unknown[];
  onViewDocument: (docId: string) => void;
  onBack: () => void;
}

const DOC_TYPE_OPTIONS: { value: DocumentType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'ficha-acolhimento', label: 'Ficha de Acolhimento' },
  { value: 'termo-acolhimento', label: 'Termo de Acolhimento' },
  { value: 'controle-saida', label: 'Controle de Saída' },
  { value: 'evolucao-geral', label: 'Evolução Geral' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'pending-signature', label: 'Pendente de assinatura' },
  { value: 'signed', label: 'Assinado' },
  { value: 'disabled', label: 'Desativado' },
];

const RESPONSIBLE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'Abel Rodrigues', label: 'Abel Rodrigues' },
  { value: 'Dra. Ana Paula', label: 'Dra. Ana Paula' },
  { value: 'Enf. Maria Rodrigues', label: 'Enf. Maria Rodrigues' },
  { value: 'Dr. Roberto Santos', label: 'Dr. Roberto Santos' },
];

export function DocumentsScreen({ patients, documents, onViewDocument }: DocumentsScreenProps) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [filterPatient, setFilterPatient] = useState<string>('all');

  const patientMap = useMemo(() => {
    const m = new Map<string, Patient>();
    patients.forEach(p => m.set(p.id, p));
    return m;
  }, [patients]);

  const pendingCount = documents.filter(d => d.status === 'pending-signature').length;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return documents
      .filter(doc => {
        if (filterType !== 'all' && doc.type !== filterType) return false;
        if (filterStatus !== 'all' && doc.status !== filterStatus) return false;
        if (filterResponsible !== 'all' && doc.createdBy !== filterResponsible) return false;
        if (filterPatient !== 'all' && doc.patientId !== filterPatient) return false;
        if (q) {
          const patient = patientMap.get(doc.patientId);
          const patientName = patient?.name.toLowerCase() ?? '';
          const patientNick = patient?.nickname?.toLowerCase() ?? '';
          const title = doc.title.toLowerCase();
          const docId = doc.docId.toLowerCase();
          const notes = (doc.content?.notes ?? '').toLowerCase();
          const motivo = (doc.content?.motivo ?? '').toLowerCase();
          return (
            patientName.includes(q) ||
            patientNick.includes(q) ||
            title.includes(q) ||
            docId.includes(q) ||
            notes.includes(q) ||
            motivo.includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [documents, search, filterType, filterStatus, filterResponsible, filterPatient, patientMap]);

  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || filterResponsible !== 'all' || filterPatient !== 'all';
  const activeFilterCount = [filterType, filterStatus, filterResponsible, filterPatient].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setFilterResponsible('all');
    setFilterPatient('all');
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Documentos</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {documents.length} documento{documents.length !== 1 ? 's' : ''} no total
              {pendingCount > 0 && (
                <span className="ml-2 text-warning font-medium">
                  · {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-white border-primary'
                : 'bg-card text-foreground border-border'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] px-1 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por paciente, título, ID, conteúdo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border-b border-border px-6 py-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Filtrar por</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary font-medium flex items-center gap-1">
                <X className="w-3 h-3" /> Limpar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Paciente</label>
              <select
                value={filterPatient}
                onChange={e => setFilterPatient(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">Todos</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Tipo</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {DOC_TYPE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Responsável</label>
              <select
                value={filterResponsible}
                onChange={e => setFilterResponsible(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {RESPONSIBLE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Document list */}
      <div className="px-4 py-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search || hasActiveFilters ? 'Nenhum documento encontrado' : 'Nenhum documento cadastrado'}
            </p>
            {(search || hasActiveFilters) && (
              <button
                onClick={() => { setSearch(''); clearFilters(); }}
                className="mt-2 text-sm text-primary font-medium"
              >
                Limpar busca e filtros
              </button>
            )}
          </div>
        ) : (
          filtered.map((doc, i) => {
            const patient = patientMap.get(doc.patientId);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => onViewDocument(doc.id)}
                  className="w-full text-left"
                >
                  <Card className="p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.docId}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(doc.status)} className="shrink-0 text-[10px] px-1.5 py-0.5">
                            {getStatusLabel(doc.status)}
                          </Badge>
                        </div>

                        {patient && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Avatar name={patient.name} src={patient.photoUrl} size="sm" />
                            <span className="text-xs text-foreground font-medium">{patient.name}</span>
                            {patient.nickname && (
                              <span className="text-xs text-muted-foreground italic">({patient.nickname})</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{doc.createdBy}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeSince(doc.timestamp)}</p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </Card>
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
