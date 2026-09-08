import { ArrowLeft, Activity, FileText, Calendar, Pill, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TimelineScreenProps {
  patientId: string;
  onBack: () => void;
}

export function TimelineScreen({ patientId, onBack }: TimelineScreenProps) {
  const timelineEvents = [
    {
      id: '1',
      date: '19/05/2024',
      time: '09:30',
      type: 'consultation',
      title: 'Consulta Psicológica',
      description: 'Sessão de terapia individual. Paciente demonstrou progresso significativo na verbalização de sentimentos.',
      author: 'Dra. Ana Paula (Psicóloga)'
    },
    {
      id: '2',
      date: '18/05/2024',
      time: '14:00',
      type: 'medication',
      title: 'Administração de Medicamento',
      description: 'Medicação prescrita administrada conforme orientação médica.',
      author: 'Enf. Carlos Santos'
    },
    {
      id: '3',
      date: '18/05/2024',
      time: '10:00',
      type: 'evaluation',
      title: 'Avaliação Médica',
      description: 'Avaliação geral do estado de saúde. Sinais vitais normais. Paciente relatou melhora no sono.',
      author: 'Dr. Roberto Lima (Psiquiatra)'
    },
    {
      id: '4',
      date: '17/05/2024',
      time: '15:30',
      type: 'activity',
      title: 'Atividade em Grupo',
      description: 'Participação ativa na terapia em grupo. Compartilhou experiências e demonstrou empatia.',
      author: 'Dra. Ana Paula (Psicóloga)'
    },
    {
      id: '5',
      date: '16/05/2024',
      time: '11:00',
      type: 'visit',
      title: 'Visita Familiar',
      description: 'Recebeu visita da esposa. Interação positiva observada pela equipe.',
      author: 'Sistema'
    },
    {
      id: '6',
      date: '15/05/2024',
      time: '09:00',
      type: 'admission',
      title: 'Admissão',
      description: 'Paciente admitido na instituição. Processo de acolhimento realizado com sucesso.',
      author: 'Equipe Administrativa'
    }
  ];

  const getEventIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      consultation: FileText,
      medication: Pill,
      evaluation: Activity,
      activity: User,
      visit: Calendar,
      admission: Calendar
    };
    return iconMap[type] || Activity;
  };

  const getEventColor = (type: string) => {
    const colorMap: Record<string, string> = {
      consultation: 'bg-blue-500',
      medication: 'bg-green-500',
      evaluation: 'bg-purple-500',
      activity: 'bg-orange-500',
      visit: 'bg-pink-500',
      admission: 'bg-primary'
    };
    return colorMap[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-6 pt-12 pb-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Linha do Tempo</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-14">Histórico completo de eventos</p>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-6">
            {timelineEvents.map((event, index) => {
              const Icon = getEventIcon(event.type);
              const colorClass = getEventColor(event.type);

              return (
                <div key={event.id} className="relative pl-14">
                  <div className={`absolute left-0 w-12 h-12 rounded-full ${colorClass} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <Card className={index === 0 ? 'border-primary/30 bg-primary/5' : ''}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date} às {event.time}</p>
                      </div>
                      {index === 0 && <Badge variant="info">Recente</Badge>}
                    </div>
                    <p className="text-sm text-foreground mb-3 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{event.author}</span>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
