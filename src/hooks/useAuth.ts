"use client";

import { useSession } from "next-auth/react";

/**
 * Hook personalizado para acceso a datos de autenticación
 * Proporciona información de sesión, rol y helpers
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "Admin",
    isCustomer: session?.user?.role === "Customer",
  };
}
