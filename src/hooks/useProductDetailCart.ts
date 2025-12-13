"use client";

import { useState, useCallback, useMemo } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Product } from "@/services/productService";

interface UseProductDetailCartProps {
  product: Product | null;
}

export function useProductDetailCart({ product }: UseProductDetailCartProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  // Verificar si el producto ya está en el carrito
  const existingCartItem = useMemo(() => {
    if (!product) return null;
    return items.find((item) => item.id === product.id);
  }, [items, product]);

  const isInCart = !!existingCartItem;
  const buttonText = isInCart ? "Actualizar carrito" : "Agregar al carrito";

  // Validar que la cantidad esté dentro de límites
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (!product) return;
      const validQuantity = Math.max(1, Math.min(product.stock, newQuantity));
      setQuantity(validQuantity);
    },
    [product],
  );

  const incrementQuantity = useCallback(() => {
    if (!product) return;
    handleQuantityChange(quantity + 1);
  }, [quantity, product, handleQuantityChange]);

  const decrementQuantity = useCallback(() => {
    handleQuantityChange(quantity - 1);
  }, [quantity, handleQuantityChange]);

  // Extraer precio base del producto
  const getBasePrice = useCallback((priceString: string): number => {
    return parseFloat(priceString.replace(/[^0-9.]+/g, ""));
  }, []);

  // Agregar o actualizar producto en el carrito
  const handleAddToCart = useCallback(() => {
    if (!product) return { success: false, message: "Producto no disponible" };

    const basePrice = getBasePrice(product.price);

    let successCount = 0;
    let lastError: string | null = null;

    // Agregar la cantidad seleccionada al carrito
    for (let i = 0; i < quantity; i++) {
      const result = addItem({
        id: product.id,
        name: product.title,
        description: product.description,
        price: basePrice,
        imageUrl: product.imagesURL[0] || "",
        stock: product.stock,
        discount: product.discount,
      });

      if (result.success) {
        successCount++;
      } else {
        lastError = result.message || "Error al agregar al carrito";
        break;
      }
    }

    // Resetear cantidad si se agregó exitosamente
    if (successCount > 0) {
      setQuantity(1);
    }

    return {
      success: successCount > 0,
      message: lastError
        ? lastError
        : `${successCount} producto(s) ${isInCart ? "actualizado(s)" : "agregado(s)"} al carrito`,
      addedCount: successCount,
    };
  }, [product, quantity, addItem, getBasePrice, isInCart]);

  return {
    quantity,
    setQuantity: handleQuantityChange,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    isInCart,
    buttonText,
    existingCartItem,
    canAddMore: product ? quantity < product.stock : false,
    canDecrement: quantity > 1,
  };
}
