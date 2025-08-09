import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual variant of the button.
     * @default 'primary'
     */
    variant?: 'primary' | 'success' | 'danger' | 'neon';
    /**
     * Button content.
     */
    children: ReactNode;
    /**
     * Optional loading state.
     */
    loading?: boolean;
}

/**
 * Button color variants mapped to Tailwind CSS classes.
 */
const VARIANT_CLASSES = {
    primary: 'bg-cyber-primary text-white border-cyber-primary',
    success: 'bg-cyber-success text-white border-cyber-success',
    danger: 'bg-cyber-danger text-white border-cyber-danger',
    neon: 'bg-cyber-neon text-black border-cyber-neon',
} as const;

/**
 * Enterprise UI Button component.
 * @see https://github.com/willi/Gerenciador_Financeiro-5.0
 */
export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    children,
    loading = false,
    disabled,
    ...props
}) => (
    <motion.button
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`px-4 py-2 rounded-xl font-bold border-2 neon-glow shadow-lg transition-all duration-200
            ${VARIANT_CLASSES[variant]}
            ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
    >
        {loading ? (
            <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-cyber-primary" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"/>
                </svg>
                Carregando...
            </span>
        ) : (
            children
        )}
    </motion.button>
);

export default Button;
