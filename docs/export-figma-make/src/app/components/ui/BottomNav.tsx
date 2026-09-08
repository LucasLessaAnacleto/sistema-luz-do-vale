import { Home, Users, Settings, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  active: string;
  pendingCount?: number;
  onNavigate: (page: string) => void;
}

export function BottomNav({ active, pendingCount = 0, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'patients', icon: Users, label: 'Pacientes' },
    { id: 'documents', icon: FileText, label: 'Documentos', badge: pendingCount },
    { id: 'settings', icon: Settings, label: 'Config.' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-20">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 relative flex-1 py-2"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-warning text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
