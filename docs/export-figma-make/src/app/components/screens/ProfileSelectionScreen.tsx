import { motion } from 'motion/react';
import { Brain, Heart, Stethoscope, Briefcase, Users } from 'lucide-react';
import { Card } from '../ui/Card';

interface ProfileSelectionScreenProps {
  onSelectProfile: (profile: string) => void;
}

export function ProfileSelectionScreen({ onSelectProfile }: ProfileSelectionScreenProps) {
  const profiles = [
    {
      id: 'psychologist',
      label: 'Psicólogo',
      icon: Brain,
      color: 'bg-primary/10 text-primary'
    },
    {
      id: 'nurse',
      label: 'Enfermeiro',
      icon: Heart,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'psychiatrist',
      label: 'Psiquiatra',
      icon: Stethoscope,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'admin',
      label: 'Administração',
      icon: Briefcase,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'family',
      label: 'Familiar',
      icon: Users,
      color: 'bg-pink-50 text-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-8"
      >
        <h1 className="text-3xl font-semibold text-foreground mb-2">Selecione seu perfil</h1>
        <p className="text-muted-foreground">Escolha como você deseja acessar o sistema</p>
      </motion.div>

      <div className="flex-1 space-y-4 max-w-md mx-auto w-full">
        {profiles.map((profile, index) => {
          const Icon = profile.icon;

          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => onSelectProfile(profile.id)}
                hover
                className="flex items-center gap-4 cursor-pointer transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${profile.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{profile.label}</h3>
                  <p className="text-sm text-muted-foreground">Acessar como {profile.label.toLowerCase()}</p>
                </div>
                <div className="text-muted-foreground">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
