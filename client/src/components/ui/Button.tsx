import { motion } from 'framer-motion';
import { z } from 'zod';

const ButtonPropsSchema = z.object({
  children: z.union([z.string(), z.number(), z.array(z.unknown()), z.unknown()]),
  onClick: z.function().optional(),
  variant: z.enum(['primary', 'secondary', 'danger']).default('primary'),
  disabled: z.boolean().optional(),
  type: z.enum(['button', 'submit', 'reset']).default('button'),
  className: z.string().optional(),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

const variants = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const validated = ButtonPropsSchema.parse({ children, onClick, variant, disabled, type, className });
  return (
    <motion.button
      type={validated.type}
      onClick={validated.onClick}
      disabled={validated.disabled}
      className={`${variants[validated.variant]} ${validated.className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      data-testid="cyberpunk-button"
    >
      {validated.children}
    </motion.button>
  );
}
