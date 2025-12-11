"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: FileList;
  onChange: (files: FileList | undefined) => void;
  existingImages?: Array<{
    id: number;
    imageUrl: string;
    publicId: string;
  }>;
  onDeleteExisting?: (imageId: number) => void;
  error?: string;
}

export function ImageUpload({
  value,
  onChange,
  existingImages = [],
  onDeleteExisting,
  error,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onChange(undefined);
      setPreviews([]);
      return;
    }

    // Validar cantidad total (existentes + nuevas)
    const totalImages = existingImages.length + files.length;
    if (totalImages > 5) {
      alert(
        `Solo puedes tener máximo 5 imágenes. Actualmente tienes ${existingImages.length} imágenes.`,
      );
      return;
    }

    // Crear previews
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });

    onChange(files);
  };

  const handleRemoveNew = (index: number) => {
    if (!value) return;

    const dt = new DataTransfer();
    const files = Array.from(value);
    files.splice(index, 1);

    files.forEach((file) => dt.items.add(file));

    onChange(files.length > 0 ? dt.files : undefined);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            <span>Seleccionar imágenes</span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-500">
          Máximo 5 imágenes (JPG, PNG, WEBP - 5MB cada una)
        </span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Imágenes existentes */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Imágenes actuales:</h4>
          <div className="grid grid-cols-5 gap-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.imageUrl}
                  alt="Producto"
                  width={120}
                  height={120}
                  className="rounded object-cover w-full h-24"
                />
                {onDeleteExisting && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => onDeleteExisting(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nuevas imágenes (preview) */}
      {previews.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Nuevas imágenes:</h4>
          <div className="grid grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={120}
                  height={120}
                  className="rounded object-cover w-full h-24"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveNew(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
