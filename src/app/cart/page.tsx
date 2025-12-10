import CartView from "@/views/cart-view";
import { CartErrorBoundary } from "@/components/cart/cart-error-boundary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito de Compras | Tienda UCN",
  description: "Revisa y gestiona los productos en tu carrito de compras",
};

export default function CartPage() {
  return (
    <CartErrorBoundary>
      <CartView />
    </CartErrorBoundary>
  );
}
