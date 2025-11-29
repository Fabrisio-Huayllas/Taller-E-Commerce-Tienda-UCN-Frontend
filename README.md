# Tienda UCN – Ecommerce Platform Frontend

Este proyecto consiste en una implementación simplificada del frontend de la plataforma de comercio electrónico "Tienda UCN" utilizando **Next.js**. El sistema incluye la creación de vistas, sesión de usuario y la administración del carrito de compras.

Esta página fue creada con un enfoque "mobile-first", por lo que responde a distintos tamaños de pantalla y mantiene una experiencia de usuario fluida.

El sistema fue creado para que se utilice junto a una **API REST** creada con **ASP.NET Core 9**, lo cual permite la administración de los datos de los usuarios y productos.

## Instalación

### Requisitos previos

Antes de ejecutar el proyecto, instala lo siguiente:

- [Visual Studio Code 1.89.1+](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/es/download)
- [Git 2.45.1+](https://git-scm.com/downloads)

Además se debe seguir las instrucciones del archivo README del siguiente repositorio:

- [Repositorio Backend](https://github.com/Fabrisio-Huayllas/Taller-E-Commerce---Tienda-UCN-.git)

Ya que este será necesario para el funcionamiento completo del proyecto.

### Pasos de instalación

1. **Clona este repositorio utilizando CMD:**

   ```bash
   git clone https://github.com/Fabrisio-Huayllas/Taller-E-Commerce-Tienda-UCN-Frontend
   ```

2. **Navega al directorio del proyecto:**

   ```bash
   cd Taller-E-Commerce-Tienda-UCN-Frontend
   ```

3. **Abre el proyecto en Visual Studio Code:**

   ```bash
   code .
   ```

4. Copia el contenido de `.env.example` en el archivo `.env.local`.

   ```bash
   cp .env.example .env.local
   ```

5. En el archivo `.env.local`, reemplaza `your-api-url-here` en el campo `NEXT_PUBLIC_API_URL` con la URL base de tu API entre comillas (“ ”) para evitar errores al leer el archivo `.env.local`. Si no conoces la URL de tu backend, ve al [repositorio de la API](https://github.com/Fabrisio-Huayllas/Taller-E-Commerce---Tienda-UCN-.git) y verifica el puerto en donde la API se está ejecutando.

   ```bash
   NEXT_PUBLIC_API_URL=your-api-url-here
   ```

6. Crea tu NextAuth secret utilizando el comando:

   ```bash
   npx auth secret
   ```

   Este comando verá que ya tienes una variable para `AUTH_SECRET` (en este caso, esa variable es `NEXTAUTH_SECRET`) en tu archivo `.env.local`, por lo que debes ingresar `y` cuando pregunte **`Overwrite existing AUTH_SECRET? (y/N)`**.

Si no se ha escrito directamente en tu `.env.local`, revisa si el secret fue escrito en la consola y después copialo y reemplaza `your-auth-secret-here` en el campo `NEXTAUTH_SECRET`. Como en el paso anterior, deja el secret en comillas para evitar errores al leerlo.

```bash
NEXTAUTH_SECRET=your-auth-secret-here
```

7. Restaura las dependencias en un terminal de Visual Studio Code.

   ```bash
   npm i
   ```

8. Ejecuta el proyecto en modo desarrollador utilizando el mismo terminal.

   ```bash
   npm run dev
   ```

   Una vez que ya hayas seguido estos pasos, el proyecto se ejecutara en `http://localhost:3000`. Para ver el sitio, presiona `ctrl` y abre la dirección en tu navegador.
