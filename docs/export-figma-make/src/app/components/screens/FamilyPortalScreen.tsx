import { ArrowLeft, Heart, Calendar, MessageCircle, TrendingUp, Bell } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface FamilyPortalScreenProps {
  onBack: () => void;
}

export function FamilyPortalScreen({ onBack }: FamilyPortalScreenProps) {
  const patient = {
    name: 'João Silva',
    photo: '',
    admissionDate: '10/04/2026',
    days: 121,
    status: 'Evolução positiva',
    nickname: 'Joãozinho',
  };

  const updates = [
    {
      id: '1',
      date: 'Hoje, 14:30',
      title: 'Participou da terapia em grupo',
      description: 'Demonstrou boa interação e compartilhou experiências positivas com os colegas.',
    },
    {
      id: '2',
      date: 'Ontem, 10:00',
      title: 'Consulta com psicólogo',
      description: 'Apresentou progressos significativos. Relatou melhora no sono e na disposição geral.',
    },
    {
      id: '3',
      date: '06/08, 15:00',
      title: 'Visita familiar realizada',
      description: 'A visita transcorreu de forma positiva, com boa interação entre o paciente e os familiares.',
    },
  ];

  const nextVisit = { date: '16/08/2026', time: '14:00', duration: '2 horas' };

  const messages = [
    {
      id: '1',
      from: 'Abel Rodrigues — Coordenador',
      message: 'João está apresentando ótima evolução no tratamento. Continuem o apoio em casa!',
      date: '08/08',
    },
    {
      id: '2',
      from: 'Equipe Administrativa',
      message: 'Lembrete: próxima visita familiar agendada para 16/08 às 14h.',
      date: '07/08',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center flex-1 mx-4">
            <p className="text-white/70 text-xs mb-0.5">Luz do Vale</p>
            <p className="font-semibold">Portal do Familiar</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <div className="flex items-center gap-4 mb-3">
            <Avatar name={patient.name} size="lg" className="border-2 border-white/30" />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{patient.name}</h2>
              <p className="text-white/80 text-sm italic">{patient.nickname}</p>
              <p className="text-white/70 text-xs mt-0.5">Em tratamento desde {patient.admissionDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-white/20">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{patient.status}</span>
          </div>
        </Card>
      </div>

      <div className="px-6 py-6 space-y-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">Próxima Visita Familiar</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {nextVisit.date} às {nextVisit.time}
              </p>
              <Badge variant="info">Duração: {nextVisit.duration}</Badge>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Atualizações Recentes</h3>
          <div className="space-y-2">
            {updates.map(update => (
              <Card key={update.id} className="p-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-foreground text-sm">{update.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{update.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{update.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Mensagens da Equipe</h3>
          <div className="space-y-2">
            {messages.map(msg => (
              <Card key={msg.id} className="border-l-4 border-l-primary p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-foreground text-xs">{msg.from}</p>
                      <span className="text-xs text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card hover className="cursor-pointer text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-1">Evolução do Tratamento</h3>
          <p className="text-sm text-muted-foreground">
            {patient.days} dias em tratamento · Progresso positivo
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 text-center">
          <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-2">O apoio faz a diferença</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Seu suporte e presença são essenciais para a recuperação. Continue acompanhando e incentivando.
          </p>
        </Card>
      </div>
    </div>
  );
}
