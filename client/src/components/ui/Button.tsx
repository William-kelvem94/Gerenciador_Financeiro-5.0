import { motion, TargetAndTransition } from 'framer-motion';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

/**
 * Props do botão enterprise cyberpunk.
 * @see https://github.com/willi/Gerenciador_Financeiro-5.0
 */

/**
 * Props base do botão, sem eventos de drag/animation para evitar conflito com MotionProps.
 */
type ButtonBaseProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | 'style'
>;


/**
 * Props completas do botão enterprise cyberpunk.
 * Inclui variantes, tamanhos, ícones, loading, tooltip e props do Framer Motion.
 */
export interface ButtonProps extends Omit<ButtonBaseProps, 'style'> {
    /** Visual variant do botão */
    variant?: 'primary' | 'success' | 'danger' | 'neon' | 'ghost';
    /** Tamanho do botão */
    size?: 'sm' | 'md' | 'lg';
    /** Ícone à esquerda */
    iconLeft?: ReactNode;
    /** Ícone à direita */
    iconRight?: ReactNode;
    /** Estado de carregamento */
    loading?: boolean;
    /** Tooltip */
    tooltip?: string;
    /** Conteúdo do botão */
    children: ReactNode;
    /** Estilo customizado */
    style?: React.CSSProperties;
    /** Props do Framer Motion suportadas */
    whileHover?: TargetAndTransition;
    whileTap?: TargetAndTransition;
    transition?: object;
}


const VARIANT_CLASSES = {
    primary: 'bg-cyber-primary text-white border-cyber-primary',
    success: 'bg-cyber-success text-white border-cyber-success',
    danger: 'bg-cyber-danger text-white border-cyber-danger',
    neon: 'bg-cyber-neon text-black border-cyber-neon',
    ghost: 'bg-transparent text-cyber-primary border-cyber-primary',
} as const;

const SIZE_CLASSES = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
} as const;


/**
 * Botão enterprise cyberpunk, acessível, animado, com variantes, loading, ícone, tooltip, drag & animation events.
 * @component
 * @param props ButtonProps
 */
export const Button: FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    loading = false,
    disabled,
    tooltip,
    children,
    style,
    whileHover,
    whileTap,
    transition,
    ...restProps
}) => {
    // Remove props nativas de drag/animation para evitar conflito com motion.button
    const {
        onDrag,
        onDragStart,
        onDragEnd,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        onAnimationStart,
        onAnimationEnd,
        onAnimationIteration,
        ...filteredProps
    } = restProps;

    return (
        <motion.button
            whileHover={whileHover ?? { scale: disabled || loading ? 1 : 1.05 } as TargetAndTransition}
            whileTap={whileTap ?? { scale: disabled || loading ? 1 : 0.98 } as TargetAndTransition}
            transition={transition}
            className={`inline-flex items-center gap-2 rounded-xl font-bold border-2 neon-glow shadow-lg transition-all duration-200
                ${VARIANT_CLASSES[variant]}
                ${SIZE_CLASSES[size]}
                ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            style={style}
            disabled={disabled || loading}
            aria-busy={loading}
            aria-label={typeof children === 'string' ? children : undefined}
            title={tooltip}
            {...filteredProps}
        >
            {iconLeft && <span className="mr-1 flex items-center">{iconLeft}</span>}
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-5 w-5 text-cyber-primary"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                        />
                    </svg>
                    <span className="sr-only">Carregando...</span>
                    Carregando...
                </span>
            ) : (
                children
            )}
            {iconRight && <span className="ml-1 flex items-center">{iconRight}</span>}
        </motion.button>
    );
};

export default Button;
