"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { RemoveItemDialog } from "@/components/cart/remove-item-dialog";
import { ClearCartDialog } from "@/components/cart/clear-cart-dialog";
import { DebugPanel } from "@/components/common/debug-panel";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveCartItem,
  useClearCart,
} from "@/hooks/useCart";

export default function CartView() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, isLoading, totalItems, totalPrice, totalSavings, syncCart } =
    useCart();

  const { mutate: updateQuantity, isUpdating } = useUpdateCartQuantity();
  const { mutate: removeItem, isRemoving } = useRemoveCartItem();
  const { mutate: clearCart, isClearing } = useClearCart();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [removeDialog, setRemoveDialog] = useState<{
    isOpen: boolean;
    productId: number | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: "",
  });

  const [clearDialog, setClearDialog] = useState(false);
  const hasSyncedRef = useRef(false);

  // Solo sincronizar una vez cuando el usuario está autenticado
  useEffect(() => {
    if (status === "authenticated" && !hasSyncedRef.current) {
      console.log("🔄 Usuario autenticado, sincronizando con backend...");
      hasSyncedRef.current = true;
      syncCart();
    } else if (status === "unauthenticated") {
      console.log("📜 Usando carrito local (sin autenticación)");
      hasSyncedRef.current = false; // Reset para permitir sync en próximo login
    }
  }, [status, syncCart]);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number,
  ) => {
    const result = await updateQuantity(productId, newQuantity);

    if (!result.success) {
      // Solo mostrar toast si es un error real (no de sincronización)
      console.error("Error al actualizar cantidad:", result.message);
      if (
        result.message &&
        !result.message.includes("conexión") &&
        !result.message.includes("autenticado")
      ) {
        setToast({
          message: result.message || "Error al actualizar cantidad",
          type: "error",
        });
      }
    }
    // La cantidad ya se actualizó localmente, no necesitamos feedback visual adicional
  };

  const handleRemoveItem = (productId: number, productName: string) => {
    setRemoveDialog({
      isOpen: true,
      productId,
      productName,
    });
  };

  const confirmRemoveItem = async () => {
    if (!removeDialog.productId) return;

    const result = await removeItem(removeDialog.productId);

    setRemoveDialog({ isOpen: false, productId: null, productName: "" });

    if (result.success) {
      setToast({
        message: "Producto eliminado del carrito",
        type: "success",
      });
    } else {
      setToast({
        message: result.message || "Error al eliminar producto",
        type: "error",
      });
    }
  };

  const handleClearCart = () => {
    setClearDialog(true);
  };

  const confirmClearCart = async () => {
    const result = await clearCart();

    setClearDialog(false);

    if (result.success) {
      setToast({
        message: "Carrito vaciado exitosamente",
        type: "success",
      });
    } else {
      setToast({
        message: result.message || "Error al vaciar carrito",
        type: "error",
      });
    }
  };

  const handleCheckout = () => {
    // Validar sesión
    if (status === "unauthenticated") {
      setToast({
        message: "Debes iniciar sesión para realizar una compra",
        type: "warning",
      });
      setTimeout(() => {
        router.push("/auth/login?redirect=/cart");
      }, 1500);
      return;
    }

    // Validar rol de administrador
    if (session?.user?.role === "Admin") {
      setToast({
        message: "Los administradores no pueden realizar compras",
        type: "warning",
      });
      return;
    }

    // Validar carrito no vacío
    if (items.length === 0) {
      setToast({
        message: "El carrito está vacío",
        type: "warning",
      });
      return;
    }

    // Redirigir a checkout
    router.push("/checkout");
  };

  const calculateItemTotal = (
    price: number,
    quantity: number,
    discount?: number,
  ) => {
    const finalPrice = discount ? price * (1 - discount / 100) : price;
    return finalPrice * quantity;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 flex gap-4"
                >
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="cursor-pointer"
            >
              Ver productos
            </Button>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4 sm:mb-0">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            Carrito de Compras
          </h1>
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isClearing || isLoading}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vaciar carrito
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const finalPrice = item.discount
                ? item.price * (1 - item.discount / 100)
                : item.price;
              const itemTotal = calculateItemTotal(
                item.price,
                item.quantity,
                item.discount,
              );

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagen */}
                    <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl || "/placeholder-product.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Detalles */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          disabled={isRemoving}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer transition-colors flex-shrink-0"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Precio y controles */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                        {/* Precio */}
                        <div className="flex items-baseline gap-2">
                          {item.discount ? (
                            <>
                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                ${finalPrice.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.price.toLocaleString()}
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                                -{item.discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                              ${item.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                isUpdating || item.quantity >= item.stock
                              }
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-[100px]">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Subtotal
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${itemTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stock disponible */}
                      {item.stock <= 5 && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-600 dark:text-orange-400">
                            Solo quedan {item.stock} unidades disponibles
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6">
                {/* Desglose por producto */}
                <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                  {items.map((item) => {
                    const itemSubtotal = item.price * item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span className="truncate pr-2">
                          {item.name}{" "}
                          {item.quantity > 1 && `(${item.quantity} unidades)`}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          ${itemSubtotal.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Descuentos aplicados
                    </span>
                    <span className="font-medium">
                      -${totalSavings.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Gratis
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={items.length === 0 || isLoading}
                className="w-full cursor-pointer mb-3"
                size="lg"
              >
                Confirmar productos
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/products")}
                className="w-full cursor-pointer"
              >
                Continuar comprando
              </Button>

              {/* Información adicional */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Envío gratis en todos los pedidos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Devoluciones fáciles en 30 días
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Compra 100% segura
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogos */}
      <RemoveItemDialog
        isOpen={removeDialog.isOpen}
        onClose={() =>
          setRemoveDialog({ isOpen: false, productId: null, productName: "" })
        }
        onConfirm={confirmRemoveItem}
        isLoading={isRemoving}
        productName={removeDialog.productName}
      />

      <ClearCartDialog
        isOpen={clearDialog}
        onClose={() => setClearDialog(false)}
        onConfirm={confirmClearCart}
        isLoading={isClearing}
        itemCount={totalItems}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Debug Panel (Ctrl+Shift+D) */}
      <DebugPanel
        title="Cart Debug"
        data={{
          items,
          totalItems,
          totalPrice,
          isLoading,
          isUpdating,
          isRemoving,
          isClearing,
          session: session?.user,
        }}
      />
    </div>
  );
}
