// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "../../src/App";
import "../../src/index.css";

// Instância única do QueryClient
const queryClient = new QueryClient();

// Renderização da aplicação
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Elemento root não encontrado.");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>
);
