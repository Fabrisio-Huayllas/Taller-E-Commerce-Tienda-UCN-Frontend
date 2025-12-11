"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  CreditCard,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useCart, useCheckout } from "@/hooks/useCart";
import { useCartStore } from "@/stores/cartStore";

export default function CheckoutView() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, isLoading, totalItems, totalPrice } = useCart();
  const { mutate: processCheckout, isProcessing } = useCheckout();
  const { clearCart } = useCartStore();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderId: number;
    orderNumber?: string;
    totalAmount?: number;
  } | null>(null);

  // Validar acceso al checkout
  useEffect(() => {
    if (status === "loading") return;

    // Usar setTimeout para evitar setState sincrónico en el effect
    const timer = setTimeout(() => {
      if (status === "unauthenticated") {
        setToast({
          message: "Debes iniciar sesión para realizar una compra",
          type: "warning",
        });
        setTimeout(() => {
          router.push("/auth/login?redirect=/checkout");
        }, 1500);
        return;
      }

      if (session?.user?.role === "Admin") {
        setToast({
          message: "Los administradores no pueden realizar compras",
          type: "warning",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
        return;
      }

      if (!isLoading && items.length === 0 && !orderSuccess) {
        setToast({
          message: "El carrito está vacío",
          type: "warning",
        });
        setTimeout(() => {
          router.push("/products");
        }, 1500);
        return;
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [status, session, items, isLoading, router, orderSuccess]);

  const handleCheckout = async () => {
    console.log("🛒 Iniciando proceso de checkout...");
    console.log("📦 Items en carrito:", items);

    // Validación final de stock
    const outOfStock = items.filter((item) => item.quantity > item.stock);
    if (outOfStock.length > 0) {
      setToast({
        message: `Algunos productos no tienen stock suficiente: ${outOfStock.map((i) => i.name).join(", ")}`,
        type: "error",
      });
      return;
    }

    const result = await processCheckout();
    console.log("📋 Resultado del checkout:", result);
    console.log("📦 Data recibida:", result.data);

    if (result.success) {
      // Primero establecer el éxito de la orden
      setOrderSuccess(true);

      // Mapear los datos correctamente según lo que devuelve el backend
      // El backend devuelve solo el código de orden como string en result.data
      const orderCode = result.data as unknown as string;
      setOrderData({
        orderId: 0, // No tenemos el ID numérico
        orderNumber: orderCode || "N/A",
        totalAmount: totalPrice, // Usar el total calculado del carrito local
      });

      // Luego limpiar el carrito DESPUÉS de que orderSuccess sea true
      // Esto evita que el useEffect redirija antes de mostrar la pantalla de éxito
      setTimeout(() => {
        clearCart();
      }, 100);

      setToast({
        message: "¡Orden creada exitosamente!",
        type: "success",
      });
      // No redirigir automáticamente, dejar que el usuario elija
    } else {
      console.error("❌ Error en checkout:", result.message);
      setToast({
        message: result.message || "Error al procesar la compra",
        type: "error",
      });
    }
  };

  const calculateItemTotal = (
    price: number,
    quantity: number,
    discount?: number,
  ) => {
    const finalPrice = discount ? price * (1 - discount / 100) : price;
    return finalPrice * quantity;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (orderSuccess && orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Orden creada con éxito!
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Tu orden ha sido registrada correctamente
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Número de orden
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {orderData.orderNumber}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Total pagado:
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${orderData.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Gracias por comprar en Tienda UCN.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                Volver al inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/orders")}
                className="cursor-pointer"
              >
                Ver mis ordenes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Finalizar Orden
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Revisa tu pedido y confirma tu orden
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Productos en tu pedido ({totalItems})
              </h2>

              <div className="space-y-4">
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
                      className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      {/* Imagen */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl || "/placeholder-product.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cantidad: {item.quantity}
                        </p>
                        <div className="flex items-baseline gap-2 mt-1">
                          {item.discount ? (
                            <>
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                ${finalPrice.toLocaleString()} c/u
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ${item.price.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-gray-900 dark:text-white">
                              ${item.price.toLocaleString()} c/u
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Subtotal
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información de envío */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Información de envío
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Usuario:</strong> {session?.user?.email}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  La orden esta registrada solo al dueño de esta cuenta cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({totalItems} productos)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Gratis
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total a pagar
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verificación de stock */}
              {items.some((item) => item.quantity > item.stock) && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700 dark:text-red-300">
                    <p className="font-medium mb-1">Stock insuficiente</p>
                    <p>
                      Algunos productos no tienen suficiente stock. Vuelve al
                      carrito para ajustar las cantidades.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={
                  isProcessing ||
                  items.length === 0 ||
                  items.some((item) => item.quantity > item.stock)
                }
                className="w-full cursor-pointer mb-3"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando orden...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Crear orden
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/cart")}
                disabled={isProcessing}
                className="w-full cursor-pointer"
              >
                Volver al carrito
              </Button>

              {/* Información de seguridad */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Protección al comprador</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
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
