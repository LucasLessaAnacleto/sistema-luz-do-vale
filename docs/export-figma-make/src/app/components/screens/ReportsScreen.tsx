import { TrendingUp, Users, Calendar, Activity, Download, Filter } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ReportsScreen() {
  const stats = [
    { label: 'Taxa de Recuperação', value: '85%', change: '+12%', trend: 'up', icon: TrendingUp },
    { label: 'Pacientes Ativos', value: '24', change: '+3', trend: 'up', icon: Users },
    { label: 'Média de Internação', value: '62 dias', change: '-5 dias', trend: 'down', icon: Calendar },
    { label: 'Atividades/Mês', value: '342', change: '+28', trend: 'up', icon: Activity }
  ];

  const monthlyData = [
    { month: 'Jan', admissions: 8, discharges: 6 },
    { month: 'Fev', admissions: 10, discharges: 7 },
    { month: 'Mar', admissions: 12, discharges: 9 },
    { month: 'Abr', admissions: 9, discharges: 11 },
    { month: 'Mai', admissions: 11, discharges: 8 }
  ];

  const reports = [
    {
      id: '1',
      title: 'Relatório Mensal - Maio 2024',
      type: 'monthly',
      date: '19/05/2024',
      status: 'ready'
    },
    {
      id: '2',
      title: 'Auditoria - Q1 2024',
      type: 'audit',
      date: '15/04/2024',
      status: 'ready'
    },
    {
      id: '3',
      title: 'Evolução de Pacientes - Abril',
      type: 'evolution',
      date: '30/04/2024',
      status: 'ready'
    }
  ];

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.admissions, d.discharges]));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card border-b border-border px-6 pt-12 pb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-foreground">Relatórios</h1>
          <button className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <Filter className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Indicadores e estatísticas</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${
                    stat.trend === 'up' ? 'bg-primary/10' : 'bg-orange-50'
                  } flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${
                      stat.trend === 'up' ? 'text-primary' : 'text-orange-600'
                    }`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                <Badge variant={stat.trend === 'up' ? 'success' : 'warning'} className="text-xs">
                  {stat.change}
                </Badge>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-foreground">Admissões vs Altas</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Admissões</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-secondary" />
                <span className="text-muted-foreground">Altas</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">{data.month}</span>
                  <span className="text-foreground">{data.admissions + data.discharges} total</span>
                </div>
                <div className="flex gap-1 h-8">
                  <div
                    className="bg-primary rounded"
                    style={{ width: `${(data.admissions / maxValue) * 100}%` }}
                  />
                  <div
                    className="bg-secondary rounded"
                    style={{ width: `${(data.discharges / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div>
          <h3 className="font-medium text-foreground mb-4">Relatórios Disponíveis</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <Card key={report.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm mb-1">{report.title}</h4>
                  <p className="text-xs text-muted-foreground">Gerado em {report.date}</p>
                </div>
                <button className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <Download className="w-4 h-4 text-foreground" />
                </button>
              </Card>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Ver Todos os Relatórios
        </Button>
      </div>
    </div>
  );
}
