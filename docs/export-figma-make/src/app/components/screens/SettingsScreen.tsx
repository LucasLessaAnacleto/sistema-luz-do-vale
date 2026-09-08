import { useState, useRef } from 'react';
import {
  User, Bell, Layout, HelpCircle, LogOut, ChevronRight, X, Eye, EyeOff,
  Users, Shield, Upload, ImageIcon,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { motion } from 'motion/react';
import { TeamMember } from '../../types';

interface SettingsScreenProps {
  team: TeamMember[];
  onLogout: () => void;
  onSaveTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateTeamMember: (id: string, data: Partial<TeamMember>) => void;
  onNavigateToTeam: () => void;
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";

function PersonalInfoPanel({ onClose }: { onClose: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: 'Abel Rodrigues',
    email: 'abel@reabilitah.com',
    phone: '(47) 99999-9999',
    role: 'Coordenador',
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-card w-full rounded-t-3xl px-6 pt-6 pb-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Informações Pessoais</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Nome completo', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Telefone', key: 'phone', type: 'tel' },
            { label: 'Cargo / Função', key: 'role', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
              <input type={f.type} className={inputCls} value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Segurança e Senha</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Senha atual</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className={inputCls + ' pr-10'}
                    value={form.currentPass} onChange={e => setForm(prev => ({ ...prev, currentPass: e.target.value }))} placeholder="Senha atual" />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nova senha</label>
                <input type="password" className={inputCls} value={form.newPass}
                  onChange={e => setForm(prev => ({ ...prev, newPass: e.target.value }))} placeholder="Nova senha" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar nova senha</label>
                <input type="password" className={inputCls} value={form.confirmPass}
                  onChange={e => setForm(prev => ({ ...prev, confirmPass: e.target.value }))} placeholder="Confirmar nova senha" />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-primary text-white rounded-xl py-3 font-medium text-sm mt-2">
            Salvar alterações
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ImageUploadField({ label, hint, value, onChange }: {
  label: string; hint: string; value: string; onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <p className="text-xs text-muted-foreground mb-2">{hint}</p>
      {value ? (
        <div className="relative">
          <img src={value} alt={label} className="w-full max-h-20 object-contain bg-gray-50 rounded-xl border border-border" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-primary/30 rounded-xl py-6 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Clique para carregar imagem</span>
          <span className="text-xs text-muted-foreground/70">PNG, JPG, SVG — máx. 2MB</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function A4Preview({ orgName, orgLocation, headerImageUrl, footerImageUrl, footerText }: {
  orgName: string; orgLocation: string;
  headerImageUrl: string; footerImageUrl: string; footerText: string;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-gray-100 p-3">
      <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-wide font-medium">Pré-visualização A4</p>
      {/* Simulated A4 document */}
      <div className="bg-white rounded border border-gray-200 mx-auto" style={{ width: '100%', aspectRatio: '0.707' /* A4 ratio */ }}>
        {/* Header */}
        <div className="border-b-2 border-primary p-3">
          {headerImageUrl ? (
            <img src={headerImageUrl} alt="header" className="h-8 object-contain mx-auto" />
          ) : (
            <div className="text-center">
              <p className="text-[9px] font-bold text-primary leading-tight">{orgName || 'NOME DA INSTITUIÇÃO'}</p>
              <p className="text-[7px] text-gray-500">{orgLocation || 'Endereço da instituição'}</p>
            </div>
          )}
        </div>

        {/* Document body mockup */}
        <div className="p-3 flex-1">
          <div className="text-center mb-3">
            <p className="text-[9px] font-bold text-gray-700">TÍTULO DO DOCUMENTO</p>
            <p className="text-[7px] text-gray-400">DOC-000001</p>
          </div>

          {/* Content lines */}
          <div className="space-y-1.5">
            {[40, 100, 80, 60, 90, 50, 75].map((w, i) => (
              <div key={i} className="h-1 bg-gray-100 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>

          {/* Signature area mock */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Acolhido', 'Responsável'].map(label => (
              <div key={label} className="text-center">
                <div className="h-4 border-t border-gray-300" />
                <p className="text-[6px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-2">
          {footerImageUrl ? (
            <img src={footerImageUrl} alt="footer" className="h-5 object-contain mx-auto" />
          ) : (
            <p className="text-[6px] text-gray-400 text-center">{footerText || 'Texto do rodapé do documento'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LayoutPanel({ onClose }: { onClose: () => void }) {
  const [orgName, setOrgName] = useState('Centro de Recuperação Luz do Vale');
  const [orgLocation, setOrgLocation] = useState('Av. Principal, 100 · Itajaí - SC');
  const [footerText, setFooterText] = useState('Documento gerado pelo sistema Reabilitah');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [footerImageUrl, setFooterImageUrl] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-card w-full rounded-t-3xl px-6 pt-6 pb-10 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Layout Institucional</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Padrão visual dos documentos emitidos</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <div className="space-y-5">
          {/* A4 Preview */}
          <A4Preview
            orgName={orgName}
            orgLocation={orgLocation}
            headerImageUrl={headerImageUrl}
            footerImageUrl={footerImageUrl}
            footerText={footerText}
          />

          {/* Header image */}
          <ImageUploadField
            label="Imagem do cabeçalho"
            hint="Aparecerá no topo de todos os documentos. Recomendado: 800×150px."
            value={headerImageUrl}
            onChange={setHeaderImageUrl}
          />

          {/* Footer image */}
          <ImageUploadField
            label="Imagem do rodapé"
            hint="Aparecerá na base de todos os documentos. Recomendado: 800×80px."
            value={footerImageUrl}
            onChange={setFooterImageUrl}
          />

          {/* Text fallbacks (shown when no image) */}
          <div className="border border-dashed border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Texto alternativo (quando sem imagem)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome da instituição</label>
              <input className={inputCls} value={orgName} onChange={e => setOrgName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Localização / Endereço</label>
              <input className={inputCls} value={orgLocation} onChange={e => setOrgLocation(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Texto do rodapé</label>
              <input className={inputCls} value={footerText} onChange={e => setFooterText(e.target.value)} />
            </div>
          </div>

          <button onClick={onClose} className="w-full bg-primary text-white rounded-xl py-3 font-medium text-sm">
            Salvar configurações
          </button>
        </div>
      </motion.div>
    </div>
  );
}


export function SettingsScreen({ team, onLogout, onNavigateToTeam }: SettingsScreenProps) {
  const [activePanel, setActivePanel] = useState<'profile' | 'layout' | null>(null);

  const user = {
    name: 'Abel Rodrigues',
    email: 'abel@reabilitah.com',
    role: 'Coordenador · Administrador',
  };

  const sections = [
    {
      title: 'Conta',
      items: [
        { icon: User, label: 'Informações Pessoais', desc: 'Perfil, dados de acesso e senha', action: () => setActivePanel('profile') },
      ],
    },
    {
      title: 'Gestão',
      items: [
        { icon: Users, label: 'Equipe', desc: `${team.filter(m => m.status === 'active').length} profissionais ativos`, action: onNavigateToTeam },
      ],
    },
    {
      title: 'Preferências',
      items: [
        { icon: Bell, label: 'Notificações', desc: 'Alertas e lembretes', action: () => {} },
        { icon: Layout, label: 'Layout', desc: 'Modelo visual dos documentos institucionais', action: () => setActivePanel('layout') },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: HelpCircle, label: 'Ajuda e Suporte', desc: 'Central de ajuda', action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-5">Configurações</h1>
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
            </div>
            <Badge variant="success" className="text-xs shrink-0">
              <Shield className="w-3 h-3 mr-1 inline" />Super Admin
            </Badge>
          </div>
        </Card>
      </div>

      <div className="px-6 py-6 space-y-6">
        {sections.map(sec => (
          <div key={sec.title}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{sec.title}</p>
            <Card className="divide-y divide-border p-0">
              {sec.items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        <Card className="p-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="flex-1 text-left font-medium text-red-600">Sair da Conta</span>
          </button>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Reabilitah v2.1 · © 2026 Luz do Vale</p>
      </div>

      {activePanel === 'profile' && <PersonalInfoPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'layout' && <LayoutPanel onClose={() => setActivePanel(null)} />}
    </div>
  );
}
