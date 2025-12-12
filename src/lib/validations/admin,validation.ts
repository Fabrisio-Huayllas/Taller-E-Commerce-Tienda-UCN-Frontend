import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),

  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),

  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(1000000, "El precio no puede exceder $1,000,000"),

  discount: z
    .number()
    .min(0, "El descuento no puede ser negativo")
    .max(100, "El descuento no puede exceder 100%"),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  status: z.enum(["New", "Used"], {
    message: "Selecciona un estado válido",
  }),

  categoryId: z.number().positive("Selecciona una categoría válida"),

  brandId: z.number().positive("Selecciona una marca válida"),

  images: z
    .custom<FileList>()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.length <= 5;
    }, "Máximo 5 imágenes permitidas")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
    }, "Cada imagen debe pesar menos de 5MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return Array.from(files).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      );
    }, "Solo se permiten imágenes JPG, PNG o WEBP"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
