import { motion } from 'framer-motion';

const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="page-title text-center">
            Configurações
          </motion.h1>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="card glass form-card">
            <p className="card-description text-center">Configurações do sistema aparecerão aqui.</p>
          </motion.div>
    </div>
  );
};
export default SettingsPage;
