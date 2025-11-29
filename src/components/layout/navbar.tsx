"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserIcon, MenuIcon, XIcon, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/common/cart-drawer";
import { useCartStore } from "@/stores/cartStore";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white dark:bg-background shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="font-bold text-2xl">Tienda UCN</div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-8 font-medium items-center">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/products">Productos</Link>
          </li>
          <li>
            <Link href="/services">Servicios</Link>
          </li>
          <li>
            <Link href="/contact">Contacto</Link>
          </li>

          {/* Login */}
          <li>
            <Link href="/login">
              <Button className="ml-4 flex gap-2 items-center">
                <UserIcon size={18} /> Iniciar Sesión
              </Button>
            </Link>
          </li>

          {/* Carrito */}
          <li>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Botón hamburguesa (mobile) */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Menu móvil */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-white dark:bg-background shadow-md">
          <ul className="text-center space-y-3 font-medium">
            <li>
              <Link href="/" onClick={toggleMenu}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" onClick={toggleMenu}>
                Productos
              </Link>
            </li>
            <li>
              <Link href="/services" onClick={toggleMenu}>
                Servicios
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMenu}>
                Contacto
              </Link>
            </li>

            {/* Login en móvil */}
            <li className="w-full px-6">
              <Link href="/login" onClick={toggleMenu}>
                <Button className="w-full flex gap-2 items-center rounded-full">
                  <UserIcon size={18} /> Iniciar Sesión
                </Button>
              </Link>
            </li>

            {/* Carrito en móvil */}
            <li className="w-full px-6">
              <Button
                onClick={() => {
                  setCartOpen(true);
                  toggleMenu();
                }}
                className="w-full flex gap-2 items-center rounded-full"
                variant="outline"
              >
                <ShoppingCart size={18} />
                Carrito
                {mounted && totalItems > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </li>
          </ul>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
};
