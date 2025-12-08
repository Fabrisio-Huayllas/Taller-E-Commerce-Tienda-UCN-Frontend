import { z } from "zod";

/**
 * Esquema de validación para el formulario de login
 * Incluye validaciones exhaustivas para email y password
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido")
    .max(100, "El email no puede exceder 100 caracteres")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
