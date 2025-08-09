import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background-secondary rounded-2xl p-8 shadow-2xl border-2 border-cyber-primary neon-glow max-w-lg w-full"
      >
        {title && <h2 className="text-xl font-bold text-cyber-primary mb-4">{title}</h2>}
        {children}
        <button className="mt-6 px-4 py-2 rounded-lg bg-cyber-danger text-white font-bold" onClick={onClose}>Fechar</button>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
