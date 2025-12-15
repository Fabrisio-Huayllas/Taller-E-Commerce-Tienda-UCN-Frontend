import { Suspense } from "react";
import VerifyEmailView from "@/views/verify-email-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificar Email | Tienda UCN",
  description: "Verifica tu correo electrónico",
};

function VerifyEmailContent() {
  return <VerifyEmailView />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
