"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "@/lib/validations/register.validation";
import { authService } from "@/services/authService";
import { useApiError } from "@/hooks/useApiError"; // ⭐ CAMBIAR AQUÍ: quitar la "a" extra
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const { handleError } = useApiError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  useEffect(() => {
    if (!email) {
      toast.error("Email no proporcionado");
      router.push("/auth/register");
      return;
    }

    setFocus("code");
  }, [email, router, setFocus]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await authService.verifyEmail({
        email,
        verificationCode: data.code,
      });

      toast.success("Email verificado", {
        description: response.data,
        duration: 4000,
      });

      router.push("/auth/login");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || !canResend) return;

    setIsResending(true);
    setCanResend(false);

    try {
      const response = await authService.resendVerificationCode({ email });

      toast.success("Código reenviado", {
        description: response.data,
        duration: 4000,
      });

      setCountdown(60);
    } catch (error) {
      handleError(error);
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verifica tu Email
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Hemos enviado un código de 6 dígitos a
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">{email}</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg bg-white p-8 shadow-md"
          noValidate
        >
          <div>
            <Label htmlFor="code" className="text-sm font-medium">
              Código de Verificación *
            </Label>
            <Input
              id="code"
              {...register("code")}
              disabled={isLoading}
              placeholder="123456"
              maxLength={6}
              aria-invalid={!!errors.code}
              className="mt-1 text-center text-2xl tracking-widest"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.code.message}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              El código expira en 3 minutos
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Email"
            )}
          </Button>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  ¿No recibiste el código?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant={canResend ? "secondary" : "outline"}
              onClick={handleResendCode}
              disabled={!canResend || isResending}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : canResend ? (
                "Reenviar código"
              ) : (
                `Reenviar en ${countdown}s`
              )}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al registro
            </Link>
          </div>
        </form>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800">Consejos:</p>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>• Revisa tu bandeja de entrada</li>
            <li>• Verifica la carpeta de spam</li>
            <li>• El código es válido por 3 minutos</li>
            <li>• Después de 5 intentos fallidos, tu cuenta será eliminada</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
