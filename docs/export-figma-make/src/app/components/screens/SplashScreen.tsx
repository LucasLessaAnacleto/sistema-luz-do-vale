import { motion } from 'motion/react';
import { useEffect } from 'react';
import logoImg from '../../../imports/Logo-1.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        <motion.img
          src={logoImg}
          alt="ReIntegra"
          className="w-32 h-32 object-contain"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1 className="text-4xl font-semibold text-primary">ReIntegra</h1>
          <p className="text-center text-muted-foreground mt-2">Cuidado humanizado</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
