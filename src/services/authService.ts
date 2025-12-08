import { LoginRequest, LoginResponse } from "@/models/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043";

/**
 * Servicio de autenticación que maneja las llamadas al backend
 */
export const authService = {
  /**
   * Autentica un usuario con email y password
   * @param credentials - Email y password del usuario
   * @returns Promise con los datos de autenticación
   * @throws Error con mensaje específico del backend
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe || false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejo específico de errores del backend
        if (response.status === 401) {
          throw new Error(data.message || "Credenciales inválidas");
        }

        if (response.status === 403) {
          throw new Error(data.message || "Usuario inactivo o bloqueado");
        }

        if (response.status === 400 && data.errors) {
          // Errores de validación
          const errorMessages = Object.values(data.errors).flat().join(", ");
          throw new Error(errorMessages);
        }

        throw new Error(data.message || "Error al iniciar sesión");
      }

      return data as LoginResponse;
    } catch (error) {
      // Re-lanzar el error para que NextAuth lo maneje
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  /**
   * Verifica si el token JWT es válido
   * @param token - Token JWT
   * @returns true si el token es válido
   */
  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < exp;
    } catch {
      return false;
    }
  },

  /**
   * Extrae el payload del token JWT
   * @param token - Token JWT
   * @returns Payload decodificado
   */
  decodeToken(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  },
};
