// authStore.ts - Store de autenticação (mínimo para build)

import { useState } from "react";

export function useAuthStore() {
  const [user, setUser] = useState(null);
  // Adicione um retorno para o hook
  return { user, setUser };
}
