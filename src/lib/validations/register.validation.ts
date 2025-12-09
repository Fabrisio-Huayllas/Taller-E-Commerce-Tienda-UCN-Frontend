import { z } from "zod";

// Validación de RUT chileno
function validateRut(rut: string): boolean {
  const cleanRut = rut.replace(/\./g, "").trim();

  if (!/^\d{7,8}-[\dkK]$/.test(cleanRut)) {
    return false;
  }

  const parts = cleanRut.split("-");
  const number = parts[0];
  const dv = parts[1].toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const expectedDv =
    remainder === 0 ? "0" : remainder === 1 ? "K" : String(11 - remainder);

  return dv === expectedDv;
}

// Validación de mayoría de edad
function isAdult(birthDate: string): boolean {
  const [day, month, year] = birthDate.split("-").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 18;
}

// Validación de fecha de nacimiento en formato DD-MM-YYYY
function isValidBirthDate(birthDate: string): boolean {
  if (!birthDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
    return false;
  }

  const [day, month, year] = birthDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  if (isNaN(date.getTime())) {
    return false;
  }

  if (date > today) {
    return false;
  }

  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 120);

  if (date < maxAge) {
    return false;
  }

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return false;
  }

  return true;
}

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "El nombre debe tener mínimo 2 letras")
      .max(20, "El nombre debe tener máximo 20 letras")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-]+$/,
        "El nombre solo puede contener caracteres del abecedario español",
      ),

    lastName: z
      .string()
      .min(2, "El apellido debe tener mínimo 2 letras")
      .max(20, "El apellido debe tener máximo 20 letras")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-]+$/,
        "El apellido solo puede contener caracteres del abecedario español",
      ),

    rut: z
      .string()
      .min(1, "El RUT es obligatorio")
      .regex(/^\d{7,8}-[\dkK]$/, "El RUT debe tener formato XXXXXXXX-X")
      .refine(validateRut, "El RUT no es válido"),

    gender: z.enum(["Masculino", "Femenino", "Otro"], {
      message: "El género debe ser Masculino, Femenino u Otro",
    }),

    birthDate: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine(
        isValidBirthDate,
        "La fecha debe tener formato DD-MM-AAAA y ser válida",
      )
      .refine(isAdult, "Debe ser mayor de 18 años"),

    phoneNumber: z
      .string()
      .regex(/^\d{9}$/, "El número de teléfono debe tener 9 dígitos"),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("El email no tiene un formato válido"),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(20, "La contraseña debe tener como máximo 20 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(
        /[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]/,
        "Debe contener al menos un carácter especial",
      ),

    confirmPassword: z
      .string()
      .min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d{6}$/, "El código de verificación debe tener 6 dígitos"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
