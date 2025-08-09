import React from "react";

/**
 * SettingsPage
 * Página de configurações do sistema financeiro.
 * Permite ajuste de preferências e integrações.
 */
const SettingsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary px-4">
            <h2 className="text-2xl font-bold text-cyber-primary mb-4">Configurações</h2>
            <p className="text-muted-foreground mb-6">
                Ajuste preferências e integrações
            </p>
            <section className="w-full max-w-md bg-white rounded shadow p-6">
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="language">
                            Idioma
                        </label>
                        <select id="language" className="w-full border rounded p-2">
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="theme">
                            Tema
                        </label>
                        <select id="theme" className="w-full border rounded p-2">
                            <option value="light">Claro</option>
                            <option value="dark">Escuro</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1" htmlFor="integration">
                            Integração Bancária
                        </label>
                        <input
                            id="integration"
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Token de integração"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cyber-primary text-white py-2 rounded hover:bg-cyber-secondary transition"
                    >
                        Salvar Configurações
                    </button>
                </form>
            </section>
        </div>
    );
};

export default SettingsPage;
