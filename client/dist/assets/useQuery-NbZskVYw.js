// src/hooks/useQuery.ts
import { useEffect, useState, useSyncExternalStore, useContext, useCallback, createContext } from "react";
import { z } from "zod";
import { QueryClient, QueryObserver, ResponseHelper } from "../services/queryService";

// Zod schema para validação das opções
export const queryOptionsSchema = z.object({
    queryKey: z.array(z.string()).min(1),
    queryFn: z.function().args(z.any()).returns(z.promise(z.any())),
    enabled: z.boolean().optional(),
    staleTime: z.number().optional(),
    refetchOnWindowFocus: z.boolean().optional(),
    refetchInterval: z.number().optional(),
    suspense: z.boolean().optional(),
    throwOnError: z.boolean().optional(),
    placeholderData: z.any().optional(),
    select: z.function().args(z.any()).returns(z.any()).optional(),
    experimental_prefetchInRender: z.boolean().optional(),
});

// Removido: aliases de tipo TypeScript não são permitidos em arquivos JS
// Contextos para suspense/reset
const SuspenseContext = createContext(false);
const ErrorResetBoundaryContext = createContext({
    clearReset: () => {},
    reset: () => {},
    isReset: () => false,
});

// Hook principal
/**
 * Hook para consultas assíncronas com cache, validação e suspense.
 * @param options Opções validadas via Zod
 * @returns Resultado da consulta
 */
export function useQuery(options) {

    const queryClient = QueryClient.getInstance();
    const errorResetBoundary = useContext(ErrorResetBoundaryContext);
    const isRestoring = useContext(SuspenseContext);

    // Otimização para suspense
    validatedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";

    // Instancia o observer
    const [observer] = useState(() => new QueryObserver<TData, TError>(queryClient, validatedOptions));
    const result = observer.getOptimisticResult(validatedOptions);

    // Assinatura para atualização
    useSyncExternalStore(
        useCallback((onStoreChange) => observer.subscribe(onStoreChange), [observer]),
        () => observer.getCurrentResult(),
        () => observer.getCurrentResult()
    );

    // Atualiza opções quando mudam
    useEffect(() => {
        observer.setOptions(validatedOptions);
    }, [validatedOptions, observer]);

    // Suspense: lança promessa se necessário
    if (validatedOptions.suspense && result.isPending) {
        throw observer.fetchOptimistic(validatedOptions);
    }

    // Erro: lança erro se necessário
    if (result.isError && !errorResetBoundary.isReset() && validatedOptions.throwOnError) {
        throw result.error;
    }

    // Padroniza resposta
    return ResponseHelper.success(result);
}
