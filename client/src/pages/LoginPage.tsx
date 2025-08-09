import { memo, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 1. Props Schema (extensível para social login, etc)
const LoginPagePropsSchema = z.object({
    onSuccess: z.function().optional(),
});
type LoginPageProps = z.infer<typeof LoginPagePropsSchema>;

// 2. Form Schema
const LoginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Senha mínima de 6 caracteres'),
});
type LoginFormData = z.infer<typeof LoginFormSchema>;

// 3. Main Component
export const LoginPage = memo((props: LoginPageProps) => {
    const validatedProps = useMemo(() => LoginPagePropsSchema.parse(props), [props]);
    const [form, setForm] = useState<LoginFormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);

    // 4. Mutation (login)
    const { mutate: login, isPending } = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Credenciais inválidas');
            return res.json();
        },
        onSuccess: (data) => {
            toast.success('Login realizado!');
            validatedProps.onSuccess?.(data.token);
            // Redirecionar ou atualizar estado global de auth
        },
        onError: (err: any) => {
            toast.error(err.message || 'Erro ao logar');
        },
    });

    // 5. Handlers
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
        },
        []
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            setErrors({});
            const result = LoginFormSchema.safeParse(form);
            if (!result.success) {
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((err) => {
                    if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
                });
                setErrors(fieldErrors);
                return;
            }
            login(result.data);
        },
        [form, login]
    );

    // 6. Render
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-screen bg-background-primary"
            data-testid="login-page"
        >
            <div className="card w-full max-w-md p-8 shadow-lg glass">
                <h2 className="text-2xl font-bold text-cyber-primary mb-4 text-center text-glow">
                    Login
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-cyber-primary mb-1">
                            E-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="input"
                            value={form.email}
                            onChange={handleChange}
                            disabled={isPending}
                            data-testid="email-input"
                        />
                        {errors.email && (
                            <span className="text-xs text-cyber-danger">{errors.email}</span>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-cyber-primary mb-1">
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                className="input pr-10"
                                value={form.password}
                                onChange={handleChange}
                                disabled={isPending}
                                data-testid="password-input"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2 text-cyber-secondary text-xs btn-ghost"
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs text-cyber-danger">{errors.password}</span>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary mt-4"
                        disabled={isPending}
                        data-testid="login-button"
                    >
                        {isPending ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <a
                        href="/register"
                        className="text-cyber-secondary hover:underline text-sm"
                    >
                        Não tem conta? Cadastre-se
                    </a>
                    <br />
                    <a
                        href="/forgot-password"
                        className="text-cyber-accent hover:underline text-xs"
                    >
                        Esqueceu a senha?
                    </a>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <button className="btn btn-secondary w-full" disabled>
                        Entrar com Google (em breve)
                    </button>
                    <button className="btn btn-secondary w-full" disabled>
                        Entrar com Facebook (em breve)
                    </button>
                </div>
                <p className="text-muted-foreground text-xs mt-8 text-center">
                    Tela de login do Will Finance 5.0
                </p>
            </div>
        </motion.div>
    );
});

LoginPage.displayName = 'LoginPage';
export default LoginPage;
