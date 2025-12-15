import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/models/cart";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncError: string | null;

  addItem: (product: Omit<CartItem, "quantity">) => {
    success: boolean;
    message?: string;
  };
  removeItem: (productId: number) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
  ) => { success: boolean; message?: string };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotalWithoutDiscount: () => number;
  getTotalSavings: () => number;
  getItemStock: (productId: number) => number;

  // Nuevos métodos para sincronización
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setSyncError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,
      lastSyncError: null,

      addItem: (product) => {
        let result = { success: false, message: "" };

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            // Actualizar el stock del item existente con el stock actual
            const updatedStock = product.stock;

            // Si el producto ya existe, incrementar cantidad solo si hay stock
            if (existingItem.quantity >= updatedStock) {
              // No agregar más si ya alcanzó el stock máximo
              result = {
                success: false,
                message: `Se alcanzó el máximo de stock disponible (${updatedStock} unidades)`,
              };
              return state;
            }
            result = { success: true, message: "" };
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      stock: updatedStock,
                    }
                  : item,
              ),
            };
          }

          // Si es un producto nuevo, verificar que haya stock
          if (product.stock <= 0) {
            result = {
              success: false,
              message: "Producto sin stock disponible",
            };
            return state;
          }

          // Si es un producto nuevo, agregarlo con cantidad 1
          result = { success: true, message: "" };
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });

        return result;
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return { success: true, message: "" };
        }

        let result = { success: false, message: "" };

        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (item && quantity > item.stock) {
            result = {
              success: false,
              message: `Se alcanzó el máximo de stock disponible (${item.stock} unidades)`,
            };
            return state;
          }

          result = { success: true, message: "" };
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item,
            ),
          };
        });

        return result;
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
          return total + price * item.quantity;
        }, 0);
      },

      getSubtotalWithoutDiscount: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      getTotalSavings: () => {
        return get().items.reduce((total, item) => {
          if (item.discount) {
            const savings = item.price * (item.discount / 100) * item.quantity;
            return total + savings;
          }
          return total;
        }, 0);
      },

      getItemStock: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        return item?.stock || 0;
      },

      // Métodos de sincronización
      setItems: (items) => {
        set({ items });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setSyncing: (syncing) => {
        set({ isSyncing: syncing });
      },

      setSyncError: (error) => {
        set({ lastSyncError: error });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
