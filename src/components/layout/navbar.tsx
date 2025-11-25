"use client";

import Link from "next/link";
import { useState } from "react";
import { UserIcon, MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

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

          {/* Carrito (vacío, pero estructurado) */}
          <li>
            <Link href="/cart" className="relative flex items-center">
              <span>🛒</span>
            </Link>
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
          </ul>
        </div>
      )}
    </nav>
  );
};
