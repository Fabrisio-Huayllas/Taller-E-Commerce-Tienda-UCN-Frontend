import { CartItem } from "@/models/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CartResponse {
  data: {
    id: number;
    userId: number;
    items: Array<{
      id: number;
      productId: number;
      productName: string;
      productDescription: string;
      productPrice: number;
      productImageUrl: string;
      quantity: number;
      stock: number;
      discount?: number;
    }>;
    totalItems: number;
    totalPrice: number;
  };
  message: string;
}

export interface UpdateQuantityRequest {
  productId: number;
  quantity: number;
}

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
export async function getCart(): Promise<CartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
 */
export async function addToCart(
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
}

/**
 * Actualiza la cantidad de un producto en el carrito
 */
export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
): Promise<CartResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/cart/items/${productId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );

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
    const response = await fetch(
      `${API_BASE_URL}/api/cart/items/${productId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
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
 * Realiza el checkout del carrito
 */
export async function checkoutCart(): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = "Error al procesar la compra";

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
 * Convierte la respuesta del API a CartItem para el store local
 */
export function mapCartResponseToItems(response: CartResponse): CartItem[] {
  return response.data.items.map((item) => ({
    id: item.productId,
    name: item.productName,
    description: item.productDescription,
    price: item.productPrice,
    imageUrl: item.productImageUrl,
    quantity: item.quantity,
    stock: item.stock,
    discount: item.discount,
  }));
}
