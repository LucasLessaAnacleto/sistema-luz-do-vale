import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();

  const getWeekDates = (date: Date) => {
    const week = [];
    const current = new Date(date);
    current.setDate(current.getDate() - current.getDay());

    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const appointments = [
    {
      id: '1',
      time: '09:00',
      duration: '60 min',
      title: 'Avaliação Psicológica',
      patient: 'João Silva',
      type: 'evaluation',
      status: 'confirmed'
    },
    {
      id: '2',
      time: '11:00',
      duration: '45 min',
      title: 'Consulta Médica',
      patient: 'Marcos Santos',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: '3',
      time: '14:00',
      duration: '30 min',
      title: 'Reunião de Equipe',
      patient: null,
      type: 'meeting',
      status: 'pending'
    },
    {
      id: '4',
      time: '15:30',
      duration: '60 min',
      title: 'Terapia em Grupo',
      patient: 'Múltiplos pacientes',
      type: 'group',
      status: 'confirmed'
    }
  ];

  const nextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev);
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      evaluation: 'bg-blue-500',
      consultation: 'bg-green-500',
      meeting: 'bg-orange-500',
      group: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-6 pt-12 pb-6 sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Agenda</h1>

        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <button onClick={nextWeek} className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center py-3 rounded-xl transition-all ${
                isSelected(date)
                  ? 'bg-primary text-white'
                  : isToday(date)
                  ? 'bg-accent text-foreground'
                  : 'bg-transparent text-muted-foreground'
              }`}
            >
              <span className="text-xs mb-1">{weekDays[date.getDay()]}</span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {isToday(selectedDate) ? 'Hoje' : selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </h2>
          <Badge variant="default">{appointments.length} agendamentos</Badge>
        </div>

        <div className="space-y-3">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(appointment.type)}`} />
              <div className="pl-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold text-primary">{appointment.time}</span>
                      <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{appointment.title}</h3>
                      {appointment.patient && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{appointment.patient}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={appointment.status === 'confirmed' ? 'success' : 'warning'}>
                    {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Reagendar
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Iniciar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Nenhum agendamento</p>
            <p className="text-sm text-muted-foreground">Não há atividades para este dia</p>
          </div>
        )}
      </div>
    </div>
  );
}
