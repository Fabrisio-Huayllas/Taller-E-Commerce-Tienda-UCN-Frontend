"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/register.validation";
import { authService } from "@/services/authService";
import { useApiError } from "@/hooks/useApiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const { handleError } = useApiError();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  // Función para formatear la fecha mientras el usuario escribe
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Solo números

    if (value.length >= 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "-" + value.slice(5, 9);
    }

    e.target.value = value.slice(0, 10); // Máximo DD-MM-YYYY
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    console.log("📋 Datos del formulario:", data);
    console.log("📅 Fecha original:", data.birthDate);
    console.log("👤 Género:", data.gender);

    try {
      // Convertir fecha de DD-MM-YYYY a YYYY-MM-DD
      let birthDate = data.birthDate;

      if (birthDate.includes("-") && birthDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = birthDate.split("-");
        birthDate = `${year}-${month}-${day}`;
      }

      console.log("📅 Fecha convertida:", birthDate);

      const payload = {
        ...data,
        birthDate: birthDate,
      };

      console.log("🚀 Payload final enviado:", payload);

      const response = await authService.register(payload);

      toast.success("Registro exitoso", {
        description: response.data,
        duration: 4000,
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("❌ Error en registro:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Crear Cuenta
          </h1>
          <p className="mt-2 text-sm text-gray-600">Regístrate en Tienda UCN</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg bg-white p-8 shadow-md"
          noValidate
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre *
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                disabled={isFormDisabled}
                placeholder="Rodrigo"
                aria-invalid={!!errors.firstName}
                className="mt-1 dark:bg-black dark:text-white"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Apellido *
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                disabled={isFormDisabled}
                placeholder="Tapia"
                aria-invalid={!!errors.lastName}
                className="mt-1 dark:bg-black dark:text-white"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="rut"
                className="block text-sm font-medium text-gray-700"
              >
                RUT *
              </Label>
              <Input
                id="rut"
                {...register("rut")}
                disabled={isFormDisabled}
                placeholder="21382034-6"
                aria-invalid={!!errors.rut}
                className="mt-1 dark:bg-black dark:text-white"
              />
              {errors.rut && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.rut.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Género *
              </Label>
              <Select
                value={selectedGender}
                onValueChange={(value) => {
                  setSelectedGender(value);
                  setValue(
                    "gender",
                    value as "Masculino" | "Femenino" | "Otro",
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                disabled={isFormDisabled}
              >
                <SelectTrigger
                  id="gender"
                  className="mt-1 bg-gray-100 text-black"
                  aria-invalid={!!errors.gender}
                >
                  <SelectValue placeholder="Seleccione género" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    value="Masculino"
                    className="text-black hover:bg-gray-100"
                  >
                    Masculino
                  </SelectItem>
                  <SelectItem
                    value="Femenino"
                    className="text-black hover:bg-gray-100"
                  >
                    Femenino
                  </SelectItem>
                  <SelectItem
                    value="Otro"
                    className="text-black hover:bg-gray-100"
                  >
                    Otro
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de Nacimiento *
              </Label>
              <Input
                id="birthDate"
                type="text"
                {...register("birthDate")}
                onInput={handleDateInput}
                disabled={isFormDisabled}
                aria-invalid={!!errors.birthDate}
                className="mt-1 dark:bg-black dark:text-white"
                placeholder="06-09-2003"
                maxLength={10}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.birthDate.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">Formato: DD-MM-AAAA</p>
            </div>

            <div>
              <Label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Teléfono *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                disabled={isFormDisabled}
                placeholder="996920954"
                aria-invalid={!!errors.phoneNumber}
                className="mt-1 dark:bg-black dark:text-white"
                maxLength={9}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isFormDisabled}
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
              className="mt-1 dark:bg-black dark:text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isFormDisabled}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className="pr-10 dark:bg-black dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  disabled={isFormDisabled}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  className="pr-10 dark:bg-black dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isFormDisabled}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              Requisitos de la contraseña:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• Mínimo 8 caracteres, máximo 20</li>
              <li>• Al menos una letra mayúscula</li>
              <li>• Al menos una letra minúscula</li>
              <li>• Al menos un número</li>
              <li>• Al menos un carácter especial (!@#$%^&*...)</li>
            </ul>
          </div>

          <Button type="submit" disabled={isFormDisabled} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </Button>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
