"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserIcon, MenuIcon, XIcon, ShoppingCart, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/common/cart-drawer";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { data: session, status } = useSession();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Sesión cerrada exitosamente");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="bg-white dark:bg-background shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-2xl hover:text-blue-600 transition-colors"
        >
          Tienda UCN
        </Link>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-8 font-medium items-center">
          <li>
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Servicios
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contacto
            </Link>
          </li>

          {/* Auth buttons */}
          {mounted && status === "loading" ? (
            <li>
              <div className="ml-4 h-10 w-24 animate-pulse bg-gray-200 rounded"></div>
            </li>
          ) : session?.user ? (
            <>
              {/* Mostrar nombre del usuario */}
              <li className="text-sm text-gray-700 dark:text-gray-300">
                Hola, {session.user.name?.split(" ")[0]}
              </li>

              {/* Botón admin (solo si es admin) */}
              {session.user.role === "Admin" && (
                <li>
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                      Panel Admin
                    </Button>
                  </Link>
                </li>
              )}

              {/* Botón logout */}
              <li>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="ml-4 flex gap-2 items-center"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </Button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/auth/login">
                <Button className="ml-4 flex gap-2 items-center">
                  <UserIcon size={18} /> Iniciar Sesión
                </Button>
              </Link>
            </li>
          )}

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
              <Link
                href="/"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition-colors cursor-pointer block py-2"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition-colors cursor-pointer block py-2"
              >
                Productos
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition-colors cursor-pointer block py-2"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={toggleMenu}
                className="hover:text-blue-600 transition-colors cursor-pointer block py-2"
              >
                Contacto
              </Link>
            </li>

            {/* Auth buttons en móvil */}
            {mounted && status === "loading" ? (
              <li className="w-full px-6">
                <div className="h-10 animate-pulse bg-gray-200 rounded"></div>
              </li>
            ) : session?.user ? (
              <>
                <li className="text-sm text-gray-700 dark:text-gray-300 py-2">
                  Hola, {session.user.name?.split(" ")[0]}
                </li>

                {session.user.role === "Admin" && (
                  <li className="w-full px-6">
                    <Link href="/admin/products" onClick={toggleMenu}>
                      <Button className="w-full" variant="outline">
                        Panel Admin
                      </Button>
                    </Link>
                  </li>
                )}

                <li className="w-full px-6">
                  <Button
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="w-full flex gap-2 items-center"
                    variant="ghost"
                  >
                    <LogOut size={18} /> Cerrar Sesión
                  </Button>
                </li>
              </>
            ) : (
              <li className="w-full px-6">
                <Link href="/auth/login" onClick={toggleMenu}>
                  <Button className="w-full flex gap-2 items-center rounded-full">
                    <UserIcon size={18} /> Iniciar Sesión
                  </Button>
                </Link>
              </li>
            )}

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
