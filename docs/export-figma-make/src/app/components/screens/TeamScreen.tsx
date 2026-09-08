import { useState } from 'react';
import { ArrowLeft, Search, X, Plus, UserCheck, UserX, Shield, ChevronRight, Mail, Calendar, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { TeamMember, Permission, FULL_PERMISSION, VIEWER_PERMISSION } from '../../types';

interface TeamScreenProps {
  team: TeamMember[];
  onBack: () => void;
  onSaveTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateTeamMember: (id: string, data: Partial<TeamMember>) => void;
}

type FilterStatus = 'all' | 'active' | 'inactive';

// ─── Permission categories ────────────────────────────────────────────────────

const PERMISSION_CATEGORIES = [
  {
    label: 'Pacientes',
    fields: [
      { key: 'canViewPatients', label: 'Visualizar pacientes' },
      { key: 'canCreatePatients', label: 'Cadastrar pacientes' },
      { key: 'canEditPatients', label: 'Editar pacientes' },
      { key: 'canDeactivatePatients', label: 'Desativar pacientes' },
      { key: 'canViewPatientHistory', label: 'Ver histórico de pacientes' },
    ],
  },
  {
    label: 'Documentos',
    fields: [
      { key: 'canViewDocuments', label: 'Visualizar documentos' },
      { key: 'canCreateDocuments', label: 'Criar documentos' },
      { key: 'canDisableDocuments', label: 'Desativar documentos' },
      { key: 'canViewDisabledDocuments', label: 'Ver documentos desativados' },
      { key: 'canReactivateDocuments', label: 'Reativar documentos' },
      { key: 'canViewAudit', label: 'Ver auditoria' },
      { key: 'canViewVersions', label: 'Ver versões' },
      { key: 'canExportPdf', label: 'Exportar PDF' },
      { key: 'canDownloadPdf', label: 'Baixar PDF para assinatura' },
      { key: 'canAttachSignedPdf', label: 'Anexar PDF assinado (GOV.BR)' },
      { key: 'canFinalizeDocument', label: 'Finalizar documento' },
    ],
  },
  {
    label: 'Administrativo',
    fields: [
      { key: 'canViewTeam', label: 'Visualizar equipe' },
      { key: 'canCreateProfessional', label: 'Cadastrar profissional' },
      { key: 'canEditProfessional', label: 'Editar profissional' },
      { key: 'canDeactivateProfessional', label: 'Desativar profissional' },
      { key: 'canReactivateProfessional', label: 'Reativar profissional' },
      { key: 'canChangePermissions', label: 'Alterar permissões' },
      { key: 'canChangePassword', label: 'Alterar senha' },
      { key: 'canViewAdminLog', label: 'Ver log administrativo' },
    ],
  },
] as const;

// ─── Permission editor ────────────────────────────────────────────────────────

function PermissionEditor({ permissions, onChange, readOnly }: {
  permissions: Permission;
  onChange?: (p: Permission) => void;
  readOnly?: boolean;
}) {
  const toggle = (key: keyof Permission) => {
    if (readOnly || !onChange) return;
    onChange({ ...permissions, [key]: !permissions[key] });
  };

  return (
    <div className="space-y-5">
      {PERMISSION_CATEGORIES.map(cat => (
        <div key={cat.label}>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{cat.label}</p>
          <div className="border border-border rounded-xl overflow-hidden">
            {cat.fields.map((field, idx) => {
              const value = permissions[field.key as keyof Permission];
              return (
                <div
                  key={field.key}
                  className={`flex items-center justify-between px-3 py-2.5 ${idx < cat.fields.length - 1 ? 'border-b border-border/50' : ''} ${!readOnly ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
                  onClick={() => toggle(field.key as keyof Permission)}
                >
                  <span className={`text-sm ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {field.label}
                  </span>
                  <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-primary' : 'bg-border'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Member form ──────────────────────────────────────────────────────────────

function MemberForm({ onSave, onCancel }: {
  onSave: (member: Omit<TeamMember, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [cpf, setCpf] = useState('');
  const [permissions, setPermissions] = useState<Permission>(VIEWER_PERMISSION);
  const [showPerms, setShowPerms] = useState(false);

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !role.trim()) return;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    onSave({
      name: name.trim(), email: email.trim(), role: role.trim(), cpf: cpf.trim(),
      status: 'active', joinDate: dateStr, isAdmin: false, permissions,
      auditLog: [{ action: 'Conta criada', by: 'Abel Rodrigues', date: dateStr, time: timeStr }],
    });
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card w-full max-w-lg rounded-t-3xl p-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-foreground">Novo Profissional</h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nome completo *</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Nome do profissional" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">E-mail *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="email@reabilitah.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Cargo / Função *</label>
            <input value={role} onChange={e => setRole(e.target.value)} className={inputCls} placeholder="Ex: Psicóloga, Monitor, Enfermeiro..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">CPF</label>
            <input value={cpf} onChange={e => setCpf(e.target.value)} className={inputCls} placeholder="000.000.000-00" />
          </div>

          {/* Quick preset */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Perfil de acesso</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPermissions(VIEWER_PERMISSION)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  JSON.stringify(permissions) === JSON.stringify(VIEWER_PERMISSION)
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-foreground hover:bg-accent'
                }`}
              >
                Visualizador
              </button>
              <button
                onClick={() => setPermissions(FULL_PERMISSION)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  JSON.stringify(permissions) === JSON.stringify(FULL_PERMISSION)
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-foreground hover:bg-accent'
                }`}
              >
                Acesso completo
              </button>
              <button
                onClick={() => setPermissions({ ...permissions })}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-accent transition-colors"
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Toggle full permissions */}
          <button
            onClick={() => setShowPerms(v => !v)}
            className="w-full py-2.5 text-sm font-medium text-primary flex items-center justify-center gap-1"
          >
            {showPerms ? 'Ocultar permissões' : 'Personalizar permissões'}
            <ChevronRight className={`w-4 h-4 transition-transform ${showPerms ? 'rotate-90' : ''}`} />
          </button>

          {showPerms && (
            <PermissionEditor permissions={permissions} onChange={setPermissions} />
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">Cancelar</button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.trim() || !role.trim()}
              className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Member detail modal ──────────────────────────────────────────────────────

function MemberDetail({ member, onClose, onDisable, onEnable, onUpdatePermissions }: {
  member: TeamMember;
  onClose: () => void;
  onDisable: () => void;
  onEnable: () => void;
  onUpdatePermissions: (p: Permission) => void;
}) {
  const [tab, setTab] = useState<'info' | 'permissions' | 'log'>('info');
  const [editPerms, setEditPerms] = useState<Permission>(member.permissions);
  const [permsSaved, setPermsSaved] = useState(false);

  const handleSavePerms = () => {
    onUpdatePermissions(editPerms);
    setPermsSaved(true);
    setTimeout(() => setPermsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card w-full max-w-lg rounded-t-3xl max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-foreground">Profissional</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Avatar name={member.name} size="lg" />
            <div>
              <p className="font-semibold text-foreground">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={member.status === 'active' ? 'success' : 'danger'}>
                  {member.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
                {member.isAdmin && <Badge variant="info">Administrador</Badge>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-accent rounded-xl p-1">
            {[
              { key: 'info', label: 'Dados' },
              { key: 'permissions', label: 'Permissões' },
              { key: 'log', label: 'Histórico' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {tab === 'info' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm py-2 border-b border-border/40">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{member.email}</span>
              </div>
              {member.cpf && (
                <div className="flex items-center gap-3 text-sm py-2 border-b border-border/40">
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">CPF: {member.cpf}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm py-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Membro desde {member.joinDate}</span>
              </div>

              {!member.isAdmin && (
                <div className="flex gap-3 pt-4">
                  <button onClick={onClose} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">Fechar</button>
                  {member.status === 'active' ? (
                    <button onClick={onDisable} className="flex-1 rounded-xl bg-destructive/10 text-destructive py-3 font-medium text-sm flex items-center justify-center gap-2">
                      <UserX className="w-4 h-4" /> Desativar
                    </button>
                  ) : (
                    <button onClick={onEnable} className="flex-1 rounded-xl bg-success/10 text-success py-3 font-medium text-sm flex items-center justify-center gap-2">
                      <UserCheck className="w-4 h-4" /> Reativar
                    </button>
                  )}
                </div>
              )}
              {member.isAdmin && (
                <button onClick={onClose} className="w-full rounded-xl border border-border py-3 font-medium text-sm text-foreground mt-4">Fechar</button>
              )}
            </div>
          )}

          {tab === 'permissions' && (
            <div>
              {member.isAdmin ? (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-primary">Administrador — acesso total ao sistema</p>
                  </div>
                </div>
              ) : (
                <>
                  <PermissionEditor permissions={editPerms} onChange={setEditPerms} />
                  <div className="pt-4 flex gap-2">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-border py-3 font-medium text-sm text-foreground">
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePerms}
                      className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm flex items-center justify-center gap-2"
                    >
                      {permsSaved ? <><Check className="w-4 h-4" /> Salvo</> : 'Salvar permissões'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'log' && (
            <div className="space-y-0">
              {member.auditLog && member.auditLog.length > 0 ? (
                [...member.auditLog].reverse().map((log, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{log.action}</span>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{log.date}</p>
                      <p className="text-xs text-muted-foreground">{log.by}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">Nenhum registro de ação.</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TeamScreen({ team, onBack, onSaveTeamMember, onUpdateTeamMember }: TeamScreenProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filtered = team.filter(m => {
    if (filterStatus === 'active' && m.status !== 'active') return false;
    if (filterStatus === 'inactive' && m.status !== 'inactive') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCount = team.filter(m => m.status === 'active').length;
  const inactiveCount = team.filter(m => m.status === 'inactive').length;

  const nowStr = () => {
    const now = new Date();
    return {
      date: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
      time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    };
  };

  const handleDisable = (id: string) => {
    const { date, time } = nowStr();
    onUpdateTeamMember(id, {
      status: 'inactive',
      auditLog: [
        ...(team.find(m => m.id === id)?.auditLog ?? []),
        { action: 'Conta desativada', by: 'Abel Rodrigues', date, time },
      ],
    });
    setSelectedMember(null);
  };

  const handleEnable = (id: string) => {
    const { date, time } = nowStr();
    onUpdateTeamMember(id, {
      status: 'active',
      auditLog: [
        ...(team.find(m => m.id === id)?.auditLog ?? []),
        { action: 'Conta reativada', by: 'Abel Rodrigues', date, time },
      ],
    });
    setSelectedMember(null);
  };

  const handleUpdatePermissions = (id: string, permissions: Permission) => {
    const { date, time } = nowStr();
    onUpdateTeamMember(id, {
      permissions,
      auditLog: [
        ...(team.find(m => m.id === id)?.auditLog ?? []),
        { action: 'Permissões alteradas', by: 'Abel Rodrigues', date, time },
      ],
    });
    setSelectedMember(prev => prev ? { ...prev, permissions } : null);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Equipe</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeCount} ativo{activeCount !== 1 ? 's' : ''}
                {inactiveCount > 0 ? ` · ${inactiveCount} inativo${inactiveCount !== 1 ? 's' : ''}` : ''}
              </p>
            </div>
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium">
            <Plus className="w-4 h-4" /> Novo
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, cargo, e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-accent border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as FilterStatus[]).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === f ? 'bg-primary text-white' : 'bg-accent text-muted-foreground'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>
      </div>

      {/* Team list */}
      <div className="px-4 py-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">Nenhum profissional encontrado</p>
          </div>
        ) : (
          filtered.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button onClick={() => setSelectedMember(member)} className="w-full text-left">
                <Card className={`p-4 hover:border-primary/30 transition-colors ${member.status === 'inactive' ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-foreground text-sm truncate">{member.name}</p>
                        {member.isAdmin && <Shield className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <p className="text-xs text-muted-foreground/70 truncate">{member.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant={member.status === 'active' ? 'success' : 'danger'}>
                        {member.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              </button>
            </motion.div>
          ))
        )}
      </div>

      {showAddForm && (
        <MemberForm
          onSave={onSaveTeamMember}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onDisable={() => handleDisable(selectedMember.id)}
          onEnable={() => handleEnable(selectedMember.id)}
          onUpdatePermissions={(p) => handleUpdatePermissions(selectedMember.id, p)}
        />
      )}
    </div>
  );
}
