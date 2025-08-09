import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface CardProps {
  title: string;
  value?: string | ReactNode;
  color?: string;
  children?: ReactNode;
}

export const Card: FC<CardProps> = ({ title, value, color = 'border-cyber-primary text-cyber-primary', children }) => (
  <motion.div
    className={`bg-background-secondary rounded-xl p-6 shadow-lg flex flex-col items-center border-2 neon-glow ${color}`}
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <span className="text-sm font-medium text-muted-foreground mb-2">{title}</span>
    {value && <span className="text-2xl font-bold drop-shadow-neon">{value}</span>}
    {children}
  </motion.div>
);

export default Card;
