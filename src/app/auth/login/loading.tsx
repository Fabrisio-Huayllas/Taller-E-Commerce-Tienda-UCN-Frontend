import { Loader2 } from "lucide-react";

/**
 * Loading state para la página de login
 */
export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}
