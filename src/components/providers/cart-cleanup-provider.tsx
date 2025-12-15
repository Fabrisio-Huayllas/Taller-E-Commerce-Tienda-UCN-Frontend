"use client";

import { useCartCleanup } from "@/hooks/useCartCleanup";

export function CartCleanupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useCartCleanup();
  return <>{children}</>;
}
