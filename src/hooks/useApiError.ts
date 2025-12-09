import { useState } from "react";
import { ApiError } from "@/services/authService";
import { toast } from "sonner";

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown): string => {
    if (err instanceof ApiError) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error("Error", {
        description: message,
        duration: 5000,
      });
      return message;
    }

    const genericMessage =
      "Ha ocurrido un error inesperado. Por favor, intente nuevamente.";
    setError(genericMessage);
    toast.error("Error", {
      description: genericMessage,
      duration: 5000,
    });
    return genericMessage;
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}

function getErrorMessage(error: ApiError): string {
  const message = error.message.toLowerCase();

  // Errores de registro
  if (
    message.includes("usuario ya está registrado") ||
    message.includes("correo")
  ) {
    return "El correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.";
  }

  if (message.includes("rut ya está registrado")) {
    return "El RUT ya está registrado en el sistema.";
  }

  // Errores de verificación
  if (message.includes("código de verificación es incorrecto")) {
    const match = message.match(/quedan (\d+) intentos/);
    const attempts = match ? match[1] : "pocos";
    return `Código de verificación incorrecto. Quedan ${attempts} intentos.`;
  }

  if (message.includes("código de verificación ha expirado")) {
    return "El código de verificación ha expirado. Solicita un nuevo código.";
  }

  if (message.includes("límite de intentos")) {
    return "Has alcanzado el límite de intentos. Tu cuenta ha sido eliminada por seguridad. Regístrate nuevamente.";
  }

  if (message.includes("correo electrónico ya ha sido verificado")) {
    return "Tu correo electrónico ya ha sido verificado. Puedes iniciar sesión.";
  }

  // Errores de reenvío de código
  if (message.includes("debe esperar")) {
    const match = message.match(/(\d+) segundos/);
    const seconds = match ? match[1] : "unos";
    return `Debes esperar ${seconds} segundos para solicitar un nuevo código.`;
  }

  // Errores genéricos por código de estado
  switch (error.statusCode) {
    case 400:
      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        return firstError?.[0] || error.message;
      }
      return (
        error.message || "Datos inválidos. Verifica la información ingresada."
      );

    case 401:
      return "No autorizado. Verifica tus credenciales.";

    case 403:
      return "Cuenta deshabilitada. Contacta al administrador.";

    case 404:
      return "Usuario no encontrado.";

    case 429:
      return "Has excedido el límite de intentos. Intenta más tarde.";

    case 500:
      return "Error del servidor. Por favor, intenta nuevamente más tarde.";

    default:
      return (
        error.message || "Ha ocurrido un error. Por favor, intenta nuevamente."
      );
  }
}
