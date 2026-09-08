import { useState, useRef } from 'react';
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Patient, Responsible, DEPENDENCY_OPTIONS } from '../../types';

interface PatientFormScreenProps {
  patient?: Patient;
  onSave: (data: Omit<Patient, 'id'>) => void;
  onCancel: () => void;
}

type FormData = Omit<Patient, 'id' | 'responsibles' | 'dependencies'>;

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-primary/10 border-l-4 border-primary px-4 py-3 rounded-r-xl mb-4">
      <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground";

export function PatientFormScreen({ patient, onSave, onCancel }: PatientFormScreenProps) {
  const isEdit = !!patient;
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    name: patient?.name ?? '',
    nickname: patient?.nickname ?? '',
    cpf: patient?.cpf ?? '',
    rg: patient?.rg ?? '',
    birthDate: patient?.birthDate ?? '',
    nationality: patient?.nationality ?? 'Brasileira',
    naturalidade: patient?.naturalidade ?? '',
    municipio: patient?.municipio ?? '',
    fatherName: patient?.fatherName ?? '',
    motherName: patient?.motherName ?? '',
    education: patient?.education ?? '',
    profession: patient?.profession ?? '',
    color: patient?.color ?? '',
    maritalStatus: patient?.maritalStatus ?? '',
    hasChildren: patient?.hasChildren ?? false,
    address: patient?.address ?? '',
    bairro: patient?.bairro ?? '',
    municipioEndereco: patient?.municipioEndereco ?? '',
    estado: patient?.estado ?? '',
    admissionDate: patient?.admissionDate ?? '',
    dischargeDate: patient?.dischargeDate ?? '',
    convenio: patient?.convenio ?? '',
    photoUrl: patient?.photoUrl ?? '',
    firstLicitDrug: patient?.firstLicitDrug ?? '',
    firstLicitDrugAge: patient?.firstLicitDrugAge ?? '',
    firstIllicitDrug: patient?.firstIllicitDrug ?? '',
    firstIllicitDrugAge: patient?.firstIllicitDrugAge ?? '',
  });

  const [dependencies, setDependencies] = useState<string[]>(patient?.dependencies ?? []);
  const [responsibles, setResponsibles] = useState<Responsible[]>(
    patient?.responsibles ?? [{ id: 'r-new-1', name: '' }]
  );

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const setCheck = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.checked }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(prev => ({ ...prev, photoUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const toggleDep = (dep: string, checked: boolean) => {
    setDependencies(prev => checked ? [...prev, dep] : prev.filter(d => d !== dep));
  };

  const updateResponsible = (id: string, field: keyof Responsible, value: string) => {
    setResponsibles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addResponsible = () => {
    setResponsibles(prev => [...prev, { id: 'r-' + Date.now(), name: '' }]);
  };

  const removeResponsible = (id: string) => {
    setResponsibles(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({
      ...form,
      admissionDate: form.admissionDate || new Date().toLocaleDateString('pt-BR'),
      dependencies,
      responsibles: responsibles.filter(r => r.name.trim()),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-card border-b border-border px-6 pt-12 pb-5 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Ficha de Acolhimento</h1>
            <p className="text-xs text-muted-foreground">{isEdit ? 'Editar dados do paciente' : 'Novo cadastro de paciente'}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Photo */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => photoRef.current?.click()}
            className="w-24 h-24 rounded-full bg-secondary overflow-hidden relative group border-4 border-white shadow-md"
          >
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-secondary-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <p className="text-xs text-muted-foreground mt-2">Toque para selecionar foto</p>
        </div>

        {/* DADOS DO ACOLHIDO */}
        <section className="space-y-4">
          <SectionHeader title="Dados do Acolhido" />

          <FieldGroup label="Nome completo *">
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Nome completo" required />
          </FieldGroup>

          <FieldGroup label="Apelido">
            <input className={inputCls} value={form.nickname} onChange={set('nickname')} placeholder="Apelido ou nome social" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="CPF">
              <input className={inputCls} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" />
            </FieldGroup>
            <FieldGroup label="RG">
              <input className={inputCls} value={form.rg} onChange={set('rg')} placeholder="00.000.000-0" />
            </FieldGroup>
          </div>

          <FieldGroup label="Data de nascimento">
            <input className={inputCls} value={form.birthDate} onChange={set('birthDate')} placeholder="DD/MM/AAAA" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Nacionalidade">
              <input className={inputCls} value={form.nationality} onChange={set('nationality')} placeholder="Brasileira" />
            </FieldGroup>
            <FieldGroup label="Naturalidade">
              <input className={inputCls} value={form.naturalidade} onChange={set('naturalidade')} placeholder="Cidade natal" />
            </FieldGroup>
          </div>

          <FieldGroup label="Município (origem)">
            <input className={inputCls} value={form.municipio} onChange={set('municipio')} placeholder="Cidade - UF" />
          </FieldGroup>

          <FieldGroup label="Nome do pai">
            <input className={inputCls} value={form.fatherName} onChange={set('fatherName')} placeholder="Nome do pai" />
          </FieldGroup>

          <FieldGroup label="Nome da mãe">
            <input className={inputCls} value={form.motherName} onChange={set('motherName')} placeholder="Nome da mãe" />
          </FieldGroup>

          <FieldGroup label="Escolaridade">
            <select className={inputCls} value={form.education} onChange={set('education')}>
              <option value="">Selecione</option>
              <option>Não alfabetizado</option>
              <option>Ensino Fundamental Incompleto</option>
              <option>Ensino Fundamental Completo</option>
              <option>Ensino Médio Incompleto</option>
              <option>Ensino Médio Completo</option>
              <option>Ensino Superior Incompleto</option>
              <option>Ensino Superior Completo</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Profissão">
            <input className={inputCls} value={form.profession} onChange={set('profession')} placeholder="Profissão ou ocupação" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Cor/Raça">
              <select className={inputCls} value={form.color} onChange={set('color')}>
                <option value="">Selecione</option>
                <option>Branca</option>
                <option>Preta</option>
                <option>Parda</option>
                <option>Amarela</option>
                <option>Indígena</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Estado civil">
              <select className={inputCls} value={form.maritalStatus} onChange={set('maritalStatus')}>
                <option value="">Selecione</option>
                <option>Solteiro(a)</option>
                <option>Casado(a)</option>
                <option>Divorciado(a)</option>
                <option>Separado(a)</option>
                <option>Viúvo(a)</option>
                <option>União estável</option>
              </select>
            </FieldGroup>
          </div>

          <FieldGroup label="Filhos?">
            <div className="flex gap-4 pt-1">
              {['Sim', 'Não'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasChildren"
                    checked={form.hasChildren === (opt === 'Sim')}
                    onChange={() => setForm(prev => ({ ...prev, hasChildren: opt === 'Sim' }))}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{opt}</span>
                </label>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Endereço">
            <input className={inputCls} value={form.address} onChange={set('address')} placeholder="Rua, número, complemento" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Bairro">
              <input className={inputCls} value={form.bairro} onChange={set('bairro')} placeholder="Bairro" />
            </FieldGroup>
            <FieldGroup label="Estado">
              <input className={inputCls} value={form.estado} onChange={set('estado')} placeholder="UF" maxLength={2} />
            </FieldGroup>
          </div>

          <FieldGroup label="Município (residência)">
            <input className={inputCls} value={form.municipioEndereco} onChange={set('municipioEndereco')} placeholder="Cidade" />
          </FieldGroup>

          <FieldGroup label="Data de acolhimento">
            <input className={inputCls} value={form.admissionDate} onChange={set('admissionDate')} placeholder="DD/MM/AAAA" />
          </FieldGroup>

          <FieldGroup label="Convênio / Forma de custeio">
            <input className={inputCls} value={form.convenio} onChange={set('convenio')} placeholder="Ex: SUS, Particular, Unimed..." />
          </FieldGroup>

          <FieldGroup label="Data de desligamento">
            <input className={inputCls} value={form.dischargeDate} onChange={set('dischargeDate')} placeholder="DD/MM/AAAA" />
          </FieldGroup>
        </section>

        {/* TIPOS DE DEPENDÊNCIA */}
        <section className="space-y-4">
          <SectionHeader title="Tipos de Dependência" />

          <div className="space-y-3">
            {DEPENDENCY_OPTIONS.map(dep => (
              <label key={dep} className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={dependencies.includes(dep)}
                  onChange={e => toggleDep(dep, e.target.checked)}
                  className="w-5 h-5 rounded accent-primary shrink-0"
                />
                <span className="text-sm text-foreground">{dep}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <FieldGroup label="Primeira droga lícita">
              <input className={inputCls} value={form.firstLicitDrug} onChange={set('firstLicitDrug')} placeholder="Ex: Álcool" />
            </FieldGroup>
            <FieldGroup label="Idade">
              <input className={inputCls} type="number" value={form.firstLicitDrugAge} onChange={set('firstLicitDrugAge')} placeholder="Anos" />
            </FieldGroup>
            <FieldGroup label="Primeira droga ilícita">
              <input className={inputCls} value={form.firstIllicitDrug} onChange={set('firstIllicitDrug')} placeholder="Ex: Maconha" />
            </FieldGroup>
            <FieldGroup label="Idade">
              <input className={inputCls} type="number" value={form.firstIllicitDrugAge} onChange={set('firstIllicitDrugAge')} placeholder="Anos" />
            </FieldGroup>
          </div>
        </section>

        {/* DADOS DO RESPONSÁVEL */}
        <section className="space-y-4">
          <SectionHeader title="Dados do Responsável" />

          {responsibles.map((resp, index) => (
            <motion.div
              key={resp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-2xl p-4 space-y-3 bg-card"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground text-sm">Responsável {index + 1}</h4>
                {responsibles.length > 1 && (
                  <button
                    onClick={() => removeResponsible(resp.id)}
                    className="text-destructive flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>
                )}
              </div>

              <FieldGroup label="Nome *">
                <input
                  className={inputCls}
                  value={resp.name}
                  onChange={e => updateResponsible(resp.id, 'name', e.target.value)}
                  placeholder="Nome completo"
                />
              </FieldGroup>

              <FieldGroup label="Grau de parentesco">
                <input
                  className={inputCls}
                  value={resp.relationship ?? ''}
                  onChange={e => updateResponsible(resp.id, 'relationship', e.target.value)}
                  placeholder="Ex: Pai, Mãe, Irmão..."
                />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="CPF">
                  <input
                    className={inputCls}
                    value={resp.cpf ?? ''}
                    onChange={e => updateResponsible(resp.id, 'cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </FieldGroup>
                <FieldGroup label="RG">
                  <input
                    className={inputCls}
                    value={resp.rg ?? ''}
                    onChange={e => updateResponsible(resp.id, 'rg', e.target.value)}
                    placeholder="00.000.000-0"
                  />
                </FieldGroup>
              </div>

              <FieldGroup label="Contato">
                <input
                  className={inputCls}
                  value={resp.contact ?? ''}
                  onChange={e => updateResponsible(resp.id, 'contact', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </FieldGroup>

              <FieldGroup label="Endereço">
                <input
                  className={inputCls}
                  value={resp.address ?? ''}
                  onChange={e => updateResponsible(resp.id, 'address', e.target.value)}
                  placeholder="Endereço completo"
                />
              </FieldGroup>

              <FieldGroup label="Data">
                <input
                  className={inputCls}
                  value={resp.date ?? ''}
                  onChange={e => updateResponsible(resp.id, 'date', e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </FieldGroup>
            </motion.div>
          ))}

          <button
            onClick={addResponsible}
            className="flex items-center gap-2 text-primary font-medium text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar responsável
          </button>
        </section>
      </div>

      {/* Footer buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border py-3 font-medium text-foreground text-sm hover:bg-accent transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!form.name.trim()}
          className="flex-1 rounded-xl bg-primary text-white py-3 font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isEdit ? 'Salvar alterações' : 'Cadastrar paciente'}
        </button>
      </div>
    </div>
  );
}
