import CheckoutView from "@/views/checkout-view";
import { CartErrorBoundary } from "@/components/cart/cart-error-boundary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Tienda UCN",
  description: "Finaliza tu compra de forma segura",
};

export default function CheckoutPage() {
  return (
    <CartErrorBoundary>
      <CheckoutView />
    </CartErrorBoundary>
  );
}
