"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCartAPI,
  checkoutCart,
  mapCartResponseToItems,
} from "@/services/cartService";

export function useCart() {
  const {
    items,
    isLoading,
    isSyncing,
    lastSyncError,
    setItems,
    setLoading,
    setSyncError,
    getTotalItems,
    getTotalPrice,
    getSubtotalWithoutDiscount,
    getTotalSavings,
  } = useCartStore();

  // NO sincronizar automáticamente al montar para preservar el carrito local
  // Solo sincronizar explícitamente cuando el usuario esté autenticado

  const syncCart = async () => {
    setLoading(true);
    setSyncError(null);

    try {
      const response = await getCart();
      const cartItems = mapCartResponseToItems(response);

      // Solo actualizar si hay items en el backend O si el carrito local está vacío
      if (cartItems.length > 0 || items.length === 0) {
        setItems(cartItems);
      } else {
        // Si el backend está vacío pero hay items locales, mantener locales
        console.log(
          "Backend vacío, manteniendo carrito local con",
          items.length,
          "items",
        );
      }
    } catch (error: unknown) {
      console.error("Error al sincronizar carrito:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al sincronizar carrito";
      setSyncError(errorMessage);

      // No mostramos error si el usuario no está autenticado, mantenemos el carrito local
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("autenticado") ||
        errorMessage.includes("unauthorized")
      ) {
        // Mantener items locales sin mostrar error
        console.log(
          "Usuario no autenticado, manteniendo carrito local con",
          items.length,
          "items",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    isLoading,
    isSyncing,
    lastSyncError,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    subtotalWithoutDiscount: getSubtotalWithoutDiscount(),
    totalSavings: getTotalSavings(),
    syncCart,
  };
}

export function useUpdateCartQuantity() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateQuantity, setItems, setSyncing } = useCartStore();

  const mutate = async (productId: number, quantity: number) => {
    setIsUpdating(true);
    setError(null);

    try {
      // Actualización optimista local
      const result = updateQuantity(productId, quantity);

      if (!result.success) {
        setError(result.message || "Error al actualizar cantidad");
        setIsUpdating(false);
        return { success: false, message: result.message };
      }

      // Intentar sincronizar con backend solo si es posible
      setSyncing(true);
      try {
        const response = await updateCartItemQuantity(productId, quantity);
        const cartItems = mapCartResponseToItems(response);
        setItems(cartItems);
        console.log("✅ Cantidad actualizada y sincronizada con backend");
      } catch (apiError: unknown) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : String(apiError);
        console.log(
          "⚠️ Backend no disponible, manteniendo cambio local:",
          errorMessage,
        );

        // Si es error de autenticación o red, mantener cambio local
        if (
          errorMessage.includes("401") ||
          errorMessage.includes("autenticado") ||
          errorMessage.includes("unauthorized") ||
          errorMessage.includes("conexión")
        ) {
          console.log(
            "📦 Carrito actualizado solo localmente (sin sincronización)",
          );
          // Mantener el cambio local, no es un error real
        } else if (
          errorMessage.includes("stock") ||
          errorMessage.includes("Stock")
        ) {
          // Error de stock, revertir
          setError(errorMessage);
          await syncCartAfterError();
          return { success: false, message: errorMessage };
        } else {
          // Otros errores: mantener cambio local
          console.log(
            "📦 Manteniendo cambio local a pesar del error del backend",
          );
        }
      } finally {
        setSyncing(false);
      }

      return { success: true, message: "Cantidad actualizada" };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("Error al actualizar cantidad:", err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  const syncCartAfterError = async () => {
    try {
      const response = await getCart();
      const cartItems = mapCartResponseToItems(response);
      useCartStore.getState().setItems(cartItems);
    } catch (error: unknown) {
      console.error("Error al sincronizar después de error:", error);
      // No propagar el error, mantener estado local
    }
  };

  return { mutate, isUpdating, error };
}

export function useRemoveCartItem() {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { removeItem, setItems, setSyncing } = useCartStore();

  const mutate = async (productId: number) => {
    setIsRemoving(true);
    setError(null);

    try {
      // Guardar item para posible reversión
      const previousItems = useCartStore.getState().items;

      // Actualización optimista local
      removeItem(productId);

      // Intentar sincronizar con backend
      setSyncing(true);
      try {
        await removeCartItem(productId);
        console.log("✅ Producto eliminado y sincronizado con backend");
      } catch (apiError: unknown) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : String(apiError);
        console.log(
          "⚠️ Backend no disponible, manteniendo cambio local:",
          errorMessage,
        );

        // Mantener cambio local para la mayoría de errores
        // Solo revertir en casos específicos de validación
        const shouldRevert =
          errorMessage.toLowerCase().includes("no existe") ||
          errorMessage.toLowerCase().includes("not found") ||
          errorMessage.toLowerCase().includes("inválido");

        if (shouldRevert) {
          console.error(
            "❌ Error de validación, revirtiendo cambio:",
            errorMessage,
          );
          setItems(previousItems);
          setError(errorMessage);
          return { success: false, message: errorMessage };
        } else {
          // Para todos los demás errores (autenticación, conexión, genéricos), mantener cambio local
          console.log(
            "📦 Producto eliminado solo localmente (backend no sincronizado)",
          );
          // Mantener el cambio local sin mostrar error
        }
      } finally {
        setSyncing(false);
      }

      return { success: true, message: "Producto eliminado del carrito" };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("Error al eliminar producto:", err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsRemoving(false);
    }
  };

  return { mutate, isRemoving, error };
}

export function useClearCart() {
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart, setItems, setSyncing } = useCartStore();

  const mutate = async () => {
    setIsClearing(true);
    setError(null);

    try {
      // Guardar items para posible reversión
      const previousItems = useCartStore.getState().items;

      // Actualización optimista local
      clearCart();

      // Intentar sincronizar con backend
      setSyncing(true);
      try {
        await clearCartAPI();
        console.log("✅ Carrito vaciado y sincronizado con backend");
      } catch (apiError: unknown) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : String(apiError);
        console.log(
          "⚠️ Backend no disponible, manteniendo cambio local:",
          errorMessage,
        );

        // Mantener cambio local para la mayoría de errores
        // Solo revertir en casos específicos de validación
        const shouldRevert =
          errorMessage.toLowerCase().includes("no permitido") ||
          errorMessage.toLowerCase().includes("forbidden") ||
          errorMessage.toLowerCase().includes("inválido");

        if (shouldRevert) {
          console.error(
            "❌ Error de validación, revirtiendo cambio:",
            errorMessage,
          );
          setItems(previousItems);
          setError(errorMessage);
          return { success: false, message: errorMessage };
        } else {
          // Para todos los demás errores (autenticación, conexión, genéricos), mantener cambio local
          console.log(
            "📦 Carrito vaciado solo localmente (backend no sincronizado)",
          );
          // Mantener el cambio local sin mostrar error
        }
      } finally {
        setSyncing(false);
      }

      return { success: true, message: "Carrito vaciado exitosamente" };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("Error al vaciar carrito:", err);
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsClearing(false);
    }
  };

  return { mutate, isClearing, error };
}

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCartStore();

  const mutate = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await checkoutCart();

      // Limpiar carrito local después de checkout exitoso
      clearCart();

      return {
        success: true,
        message: "Compra realizada exitosamente",
        data: response.data,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar compra";
      console.error("Error al procesar compra:", err);
      setError(errorMessage);

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { mutate, isProcessing, error };
}
