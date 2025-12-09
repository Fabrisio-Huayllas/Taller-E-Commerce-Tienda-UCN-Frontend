import NextAuth, { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { authService } from "@/services/authService";

/**
 * Decodifica el payload de un JWT sin verificarlo
 */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Configuración de NextAuth con estrategia JWT
 * Maneja autenticación, callbacks y redirecciones
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos");
          }

          const response = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response.success && response.token) {
            // Decodificar el JWT para obtener los claims
            const payload = decodeJWT(response.token);

            if (!payload) {
              throw new Error("Token inválido");
            }

            // Retornar el usuario con los datos del JWT
            return {
              id:
                payload[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ] || response.userId.toString(),
              email:
                payload[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ] || (credentials.email as string),
              name:
                payload[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                ] || (credentials.email as string),
              role:
                payload[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] || "Customer",
              accessToken: response.token,
            } as User;
          }

          return null;
        } catch (error) {
          // NextAuth capturará este error
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Error de autenticación");
        }
      },
    }),
  ],
  callbacks: {
    /**
     * Callback JWT: Propaga el token de acceso y datos del usuario
     */
    async jwt({ token, user }): Promise<JWT> {
      // En el primer login, user está disponible
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }

      // Verificar expiración del token
      if (token.accessToken && typeof token.accessToken === "string") {
        const isValid = authService.isTokenValid(token.accessToken);
        if (!isValid) {
          // Token expirado, limpiar sesión
          return {} as JWT;
        }
      }

      return token;
    },

    /**
     * Callback Session: Hace disponible el token y rol en la sesión del cliente
     */
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },

    /**
     * Callback de redirección autorizada
     */
    async redirect({ url, baseUrl }) {
      // Permite redirecciones relativas
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permite redirecciones a la misma base URL
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
