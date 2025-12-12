import { CartItem } from "@/models/cart";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

/**
 * Construye los headers para las peticiones con autenticación
 */
function buildHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export interface CartResponse {
  data: {
    id: number;
    userId: number;
    items: Array<{
      id: number;
      productId: number;
      productTitle: string; // Backend envía ProductTitle
      productImageUrl: string;
      price: number; // Backend envía Price (precio original)
      quantity: number;
      discount: number; // Backend envía Discount (porcentaje)
      stock: number;
      subTotalPrice: string; // Precio sin descuento formateado
      totalPrice: string; // Precio con descuento formateado
    }>;
    totalItems: number;
    totalPrice: number;
  };
  message: string;
}

// Interface para futuro uso si se necesita validación de request
// interface UpdateQuantityRequest {
//   productId: number;
//   quantity: number;
// }

export interface CheckoutResponse {
  data: {
    orderId: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
  };
  message: string;
}

/**
 * Obtiene el carrito del usuario autenticado
 */
export async function getCart(token?: string | null): Promise<CartResponse> {
  try {
    console.log("🔍 Obteniendo carrito del backend...");
    console.log("🍪 Cookies disponibles:", document.cookie);
    console.log("🔑 Token disponible:", token ? "Sí" : "No");

    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(token),
    });

    console.log(
      "📡 Respuesta GET /cart:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      // Si no hay contenido (204) o está vacío, devolver carrito vacío
      if (response.status === 204 || response.status === 404) {
        return {
          data: {
            id: 0,
            userId: 0,
            items: [],
            totalItems: 0,
            totalPrice: 0,
          },
          message: "Carrito vacío",
        };
      }

      // Intentar parsear error
      const text = await response.text();
      console.error("❌ Error response:", text);
      let errorMessage = "Error al obtener el carrito";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    // Verificar que hay contenido antes de parsear
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {
        data: {
          id: 0,
          userId: 0,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
        message: "Carrito vacío",
      };
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Agrega un producto al carrito
 * NOTA: Actualmente no se usa porque se agrega desde cartStore directamente,
 * pero se mantiene para futuro uso si se necesita agregar desde el backend
 */
/* export async function addToCart(
  productId: number,
  quantity: number = 1,
): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Error al agregar producto al carrito";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text || text.trim() === "") {
      throw new Error("Respuesta vacía del servidor");
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
} */

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
): Promise<CartResponse> {
  try {
    // El backend espera FormData con PATCH method
    const formData = new FormData();
    formData.append("productId", productId.toString());
    formData.append("quantity", quantity.toString());

    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Error al actualizar la cantidad";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text || text.trim() === "") {
      throw new Error("Respuesta vacía del servidor");
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Elimina un producto del carrito
 */
export async function removeCartItem(
  productId: number,
): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Error al eliminar el producto";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text || text.trim() === "") {
      return { message: "Producto eliminado" };
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Vacía todo el carrito
 */
export async function clearCartAPI(): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Error al vaciar el carrito";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    if (!text || text.trim() === "") {
      return { message: "Carrito vaciado" };
    }

    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Sincroniza el carrito local con el backend
 * Envía todos los items locales al backend antes de hacer checkout
 */
export async function syncCartToBackend(
  items: CartItem[],
  token?: string | null,
): Promise<void> {
  console.log("🔄 Sincronizando carrito con backend:", items.length, "items");
  console.log("🔑 Token para sincronización:", token ? "Sí" : "No");

  try {
    // Paso 1: Crear o obtener el carrito en el backend
    console.log("📦 Creando/obteniendo carrito en backend...");
    const cartResponse = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(token),
    });

    console.log("📡 Respuesta GET /api/cart:", {
      status: cartResponse.status,
      statusText: cartResponse.statusText,
      ok: cartResponse.ok,
    });

    if (!cartResponse.ok) {
      const text = await cartResponse.text();
      console.error("❌ Error response body:", text);
      throw new Error(
        `Error al crear/obtener carrito (${cartResponse.status}): ${text}`,
      );
    }

    const cartText = await cartResponse.text();
    console.log(
      "✅ Carrito obtenido/creado en backend:",
      cartText.substring(0, 200),
    );

    // Paso 2: Agregar cada item al backend (el backend manejará duplicados)
    for (const item of items) {
      console.log(
        `➕ Agregando ${item.name} (x${item.quantity}) al backend...`,
      );

      // El backend espera FormData, no JSON
      const formData = new FormData();
      formData.append("productId", item.id.toString());
      formData.append("quantity", item.quantity.toString());

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: formData, // No incluir Content-Type header, el browser lo establece automáticamente
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Error al agregar ${item.name}:`, text);

        // Si el item ya existe, intentar actualizar la cantidad
        if (text.includes("ya existe") || response.status === 409) {
          console.log(`🔄 Actualizando cantidad de ${item.name}...`);
          await updateCartItemQuantity(item.id, item.quantity);
        } else {
          throw new Error(`Error al agregar ${item.name}: ${text}`);
        }
      }
    }

    console.log("✅ Carrito sincronizado exitosamente con el backend");
  } catch (error) {
    console.error("❌ Error al sincronizar carrito:", error);
    throw new Error("No se pudo sincronizar el carrito con el servidor");
  }
}

/**
 * Realiza el checkout del carrito
 */
export async function checkoutCart(
  token?: string | null,
): Promise<CheckoutResponse> {
  try {
    console.log("🛒 Iniciando checkout...");
    console.log("🔑 Token para checkout:", token ? "Sí" : "No");
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(token),
    });

    console.log(
      "📡 Respuesta del servidor:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Error del servidor:", text);
      let errorMessage = "Error al procesar la compra";

      if (text) {
        try {
          const error = JSON.parse(text);
          errorMessage = error.message || error.title || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
      }

      throw new Error(errorMessage);
    }

    const text = await response.text();
    console.log("📦 Respuesta cruda:", text);

    if (!text || text.trim() === "") {
      throw new Error("Respuesta vacía del servidor");
    }

    const result = JSON.parse(text);
    console.log("✅ Orden creada:", result);
    return result;
  } catch (error) {
    console.error("💥 Error en checkoutCart:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Convierte la respuesta del API a CartItem para el store local
 */
export function mapCartResponseToItems(response: CartResponse): CartItem[] {
  return response.data.items.map((item) => ({
    id: item.productId,
    name: item.productTitle, // Corregido: usar productTitle del backend
    description: "", // El backend no envía description en CartItemDTO
    price: item.price, // Corregido: usar price (precio original sin descuento)
    imageUrl: item.productImageUrl,
    quantity: item.quantity,
    stock: item.stock,
    discount: item.discount, // Porcentaje de descuento
  }));
}
