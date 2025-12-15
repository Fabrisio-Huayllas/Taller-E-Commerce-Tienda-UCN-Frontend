"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de NextAuth para manejo de sesión en cliente
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
