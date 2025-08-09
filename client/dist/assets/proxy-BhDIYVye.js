import React, { createContext, useContext, useRef, useEffect } from "react";
import { z } from "zod";

/**
 * Schema de configuração do proxy
 */
const proxyConfigSchema = z.object({
    transformPagePoint: z.function().args(z.any()).returns(z.any()),
    isStatic: z.boolean(),
    reducedMotion: z.enum(["never", "always", "auto"]),
});


const defaultConfig = {
    transformPagePoint: (t) => t,
    isStatic: false,
    reducedMotion: "never",
};

const ProxyContext = createContext(defaultConfig);

/**
 * Hook para acessar a configuração do Proxy
 */
export const useProxyConfig = () => useContext(ProxyContext);

/**
 * Contexto para configurações de animação e motion.
 * Valida entradas com Zod e garante consistência.
 */
export const ProxyProvider = ({ config = {}, children }) => {
    const mergedConfig = { ...defaultConfig, ...config };
    const validatedConfig = proxyConfigSchema.safeParse(mergedConfig);

    if (!validatedConfig.success) {
        // Centralized error handling
        throw new Error("Configuração inválida do ProxyProvider");
    }

    return (
        <ProxyContext.Provider value={validatedConfig.data}>
            {children}
        </ProxyContext.Provider>
    );
};

/**
 * Hook para controle manual de timing de animações.
 */
export function useManualTiming(enabled = false) {
    const ref = useRef(enabled);
    useEffect(() => {
        ref.current = enabled;
    }, [enabled]);
    return ref.current;
}
