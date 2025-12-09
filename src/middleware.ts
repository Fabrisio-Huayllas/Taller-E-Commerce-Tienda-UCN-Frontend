import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Middleware para protección de rutas y redirecciones basadas en autenticación
 * Maneja:
 * - Bloqueo de /auth/login si ya está autenticado
 * - Protección de rutas admin y customer
 * - Redirecciones por rol
 */
export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Si está en /auth/login y ya está autenticado, redirigir según rol
  if (pathname === "/auth/login" && session?.user) {
    const redirectUrl = getRedirectUrlByRole(session.user.role);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Protección de rutas admin
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (session.user.role !== "Admin") {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  // Protección de rutas que requieren autenticación (checkout, orders, etc)
  const protectedRoutes = ["/checkout", "/orders", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !session?.user) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  return NextResponse.next();
}

/**
 * Determina la URL de redirección según el rol del usuario
 */
function getRedirectUrlByRole(role: string): string {
  const roleMap: Record<string, string> = {
    Admin: "/admin/products",
    Customer: "/products",
  };
  return roleMap[role] || "/products";
}

// Configuración de matcher para optimizar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};
