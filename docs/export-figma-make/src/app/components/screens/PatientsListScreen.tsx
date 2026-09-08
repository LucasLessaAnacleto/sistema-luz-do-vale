import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { Patient, PatientDocument, formatTimeSince } from '../../types';

interface PatientsListScreenProps {
  patients: Patient[];
  documents: PatientDocument[];
  onNavigate: (page: string, id?: string) => void;
  onNewPatient: () => void;
}

export function PatientsListScreen({ patients, documents, onNavigate, onNewPatient }: PatientsListScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getLastDocTime = (patientId: string): string => {
    const patientDocs = documents.filter(d => d.patientId === patientId);
    if (patientDocs.length === 0) return 'Sem documentos';
    const latest = Math.max(...patientDocs.map(d => d.timestamp));
    return formatTimeSince(latest);
  };

  const filtered = patients.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nickname?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-6 pt-12 pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-foreground">Pacientes</h1>
          <button
            onClick={onNewPatient}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <Input
          type="text"
          placeholder="Buscar por nome ou apelido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-5 h-5" />}
        />
      </div>

      <div className="px-6 py-4 space-y-3">
        {filtered.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card
              onClick={() => onNavigate('patient-detail', patient.id)}
              hover
              className="cursor-pointer p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar name={patient.name} src={patient.photoUrl} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{patient.name}</h3>
                  {patient.nickname && (
                    <p className="text-sm text-muted-foreground italic">{patient.nickname}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Último documento atualizado {getLastDocTime(patient.id)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">Nenhum paciente encontrado</p>
          <p className="text-sm text-muted-foreground">Tente buscar com outros termos</p>
        </div>
      )}
    </div>
  );
}
