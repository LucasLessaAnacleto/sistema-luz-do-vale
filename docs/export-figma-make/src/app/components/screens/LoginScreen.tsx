import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import logoImg from '../../../imports/Logo-1.png';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <img src={logoImg} alt="ReIntegra" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-foreground mb-1">Bem-vindo</h1>
          <p className="text-muted-foreground text-sm">Luz do Vale · Sistema de Reabilitação</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            required
          />

          <Input
            type="password"
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            required
          />

          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Esqueceu sua senha?
          </button>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Precisa de ajuda? Entre em contato com o suporte</p>
        </div>
      </motion.div>
    </div>
  );
}
