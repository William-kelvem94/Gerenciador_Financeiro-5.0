import React from 'react';

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  return <>{children}</>;
}