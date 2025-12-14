# Tienda UCN – Ecommerce Platform Frontend

Este proyecto consiste en una implementación del frontend de la plataforma de comercio electrónico "Tienda UCN" utilizando **Next.js**. El sistema incluye la creación de vistas, sesión de usuario y la administración del carrito de compras.

El sistema fue creado para que se utilice junto a una API REST creada con ASP.NET Core 9, lo cual permite la administración de los datos de los usuarios y productos.

## Instalación

### Requisitos previos

Antes de ejecutar el proyecto, instala lo siguiente:

- [Visual Studio Code 1.89.1+](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/es/download)
- [Git 2.45.1+](https://git-scm.com/downloads)

Además se debe seguir las instrucciones del archivo README del siguiente repositorio (Backend):

- [Repositorio Backend](https://github.com/Fabrisio-Huayllas/Taller-E-Commerce---Tienda-UCN-.git)

Ya que este será necesario para el funcionamiento completo del proyecto.

Nota: El backend por defecto expone la API en `http://localhost:5000/api`. Si usas otro puerto, ajusta la variable `NEXT_PUBLIC_API_URL` más abajo.

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
   NEXTAUTH_SECRET="your-auth-secret-here"
   ```

### Variables de entorno utilizadas

Estas son las variables que utiliza el frontend y deben existir en `.env.local`:

- `NEXT_PUBLIC_API_URL`: URL base de la API del backend. Ej: `"http://localhost:5000/api"`.
- `NEXTAUTH_SECRET`: Secret de NextAuth, generado con `npx auth secret`.

7. Restaura las dependencias en un terminal de Visual Studio Code.

   ```bash
   npm i
   ```

8. Ejecuta el proyecto en modo desarrollador utilizando el mismo terminal.

   ```bash
   npm run dev
   ```

   Una vez que ya hayas seguido estos pasos, el proyecto se ejecutara en `http://localhost:3000`. Para ver el sitio, presiona `ctrl` y abre la dirección en tu navegador.

9. **Instala todas las dependencias adicionales:**

   Para asegurar que el proyecto se ejecute correctamente con todas las funcionalidades, se debe instalar todas las dependencias adicionales mencionadas en la sección **Dependencias adicionales** más abajo. Puedes ejecutar todos los comandos listados para garantizar que el entorno esté completamente configurado.

### Scripts disponibles

En este proyecto puedes utilizar los siguientes scripts de `npm`:

- `npm run dev`: Inicia el servidor de desarrollo de Next.js.
- `npm run build`: Construye la aplicación para producción.
- `npm start`: Sirve la aplicación ya construida.

### Dependencias adicionales

Si estás configurando el entorno completo de UI, estado y formularios, instala estas dependencias:

```bash
# TanStack Query
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools

# shadcn/ui
npx shadcn@latest add badge

# Utilidades de estilos
npm install class-variance-authority
npm install clsx tailwind-merge

# Toasts
npm install sonner

# Formularios y validaciones
npm install react-hook-form @hookform/resolvers zod

# Componentes Radix UI
npm install @radix-ui/react-select
```

### Comprobación rápida de integración

Para verificar que el frontend se comunica correctamente con el backend:

1. Asegúrate que el backend esté ejecutándose en `http://localhost:5000` (o el puerto configurado).
2. Configura `NEXT_PUBLIC_API_URL` apuntando a `"http://localhost:5000/api"`.
3. Inicia el frontend con `npm run dev` y prueba iniciar sesión o listar productos.

Si necesitas probar los endpoints manualmente, el backend incluye una colección de Postman y documentación de rutas en su README.

## Integrantes del grupo

- **Sebastian Hernandez** - 21.701.267-8 - sebastian.hernandez02@alumnos.ucn.cl
- **Fabrisio Huayllas** - 22.108.928-6 - fabrisio.huayllas02@alumnos.ucn.cl
- **Rodrigo Tapia** - 21.382.034-6 - rodrigo04@alumnos.ucn.cl

---

## Licencia

Este proyecto es desarrollado con fines académicos para la Universidad Católica del Norte.
