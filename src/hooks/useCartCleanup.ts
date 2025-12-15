"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";

/**
 * Hook para limpiar items del carrito que no tengan el campo stock
 * Esto es útil cuando se actualiza la estructura del CartItem
 */
export function useCartCleanup() {
  const [cleaned, setCleaned] = useState(false);

  useEffect(() => {
    if (cleaned) return;

    // Esperar un tick para asegurar que el store se haya hidratado
    const timeoutId = setTimeout(() => {
      const items = useCartStore.getState().items;
      const invalidItems = items.filter(
        (item) => typeof item.stock !== "number" || isNaN(item.stock),
      );

      if (invalidItems.length > 0) {
        console.log(
          "🧹 Limpiando items inválidos del carrito...",
          invalidItems,
        );
        // Limpiar el carrito si hay items sin stock
        useCartStore.getState().clearCart();
        alert(
          "Se ha actualizado el sistema del carrito. Por favor, vuelve a agregar tus productos.",
        );
      }
      setCleaned(true);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [cleaned]);
}
