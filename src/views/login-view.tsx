"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

/**
 * Vista de Login con React Hook Form, Zod y NextAuth
 * Cumple con todos los requisitos de autenticación y UX
 */
export default function LoginView() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  // React Hook Form con Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched", // Validación al tocar el campo
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Manejo de montaje del componente para hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirección si ya está autenticado
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const redirectUrl = getRedirectUrlByRole(session.user.role);
      router.replace(redirectUrl);
    }
  }, [status, session, router]);

  /**
   * Determina la URL de redirección según el rol del usuario
   */
  const getRedirectUrlByRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      Admin: "/admin/products",
      Customer: "/products",
    };
    return roleMap[role] || "/products";
  };

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // Llamada a NextAuth signIn
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Manejo específico de errores del backend
        toast.error(result.error, {
          description: "Verifica tus credenciales e intenta nuevamente",
          duration: 5000,
        });

        // Focus en el campo de email para facilitar corrección
        setFocus("email");
        return;
      }

      if (result?.ok) {
        toast.success("Inicio de sesión exitoso", {
          description: "Redirigiendo...",
          duration: 2000,
        });

        // La redirección se maneja en el useEffect de sesión
      }
    } catch (error) {
      // Error inesperado
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor",
        duration: 5000,
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading durante verificación de sesión
  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // No mostrar formulario si ya está autenticado
  if (status === "authenticated") {
    return null;
  }

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa a tu cuenta de Tienda UCN
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-md"
          noValidate
        >
          <div className="space-y-5">
            {/* Campo Email */}
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  disabled={isFormDisabled}
                  error={errors.email?.message}
                  {...register("email")}
                  aria-label="Correo electrónico"
                  className="w-full"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Campo Password */}
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isFormDisabled}
                  error={errors.password?.message}
                  {...register("password")}
                  aria-label="Contraseña"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Botón Submit */}
          <div>
            <Button
              type="submit"
              disabled={isFormDisabled}
              className="w-full"
              aria-label="Iniciar sesión"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </div>

          {/* Links adicionales */}
          <div className="text-center text-sm">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Nota de seguridad */}
        <p className="text-center text-xs text-gray-500">
          Tu información está protegida con HTTPS
        </p>
      </div>
    </div>
  );
}
