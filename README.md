# HuertoHogar - Tienda Online (Evaluación Parcial 1)

Proyecto de tienda online desarrollado con **HTML5, CSS3 y JavaScript puro**, basado en el
caso **Forma A: HuertoHogar**, siguiendo las instrucciones y la rúbrica de la Evaluación
Parcial 1 (DSY1104 - Desarrollo Fullstack II).

## 📁 Estructura de carpetas

```
HuertoHogar-Tienda/
│
├── main/                     Código principal del sitio (HTML + JS)
│   ├── index.html            Página de inicio (Home)
│   ├── productos.html        Listado de productos con filtro por categoría
│   ├── producto-detalle.html Detalle de un producto + carrito
│   ├── carrito.html          Carrito de compras (usa localStorage)
│   ├── registro.html         Registro de usuario público (rol Cliente)
│   ├── login.html            Inicio de sesión real (valida contra usuarios guardados)
│   ├── nosotros.html         Página "Nosotros" (misión, visión, tiendas)
│   ├── blogs.html            Listado de blogs / noticias
│   ├── blog-detalle-1.html   Detalle del blog 1
│   ├── blog-detalle-2.html   Detalle del blog 2
│   ├── contacto.html         Formulario de contacto (con validaciones)
│   ├── script.js             Lógica del carrito + renderizado dinámico de productos
│   ├── productos.js          CRUD de productos y catálogo inicial (localStorage)
│   ├── usuarios.js           CRUD de usuarios y sesión (localStorage)
│   ├── validaciones-base.js  Utilidades de validación compartidas (tienda + admin)
│   └── validaciones.js       Validaciones específicas de registro/login/contacto
│
├── admin/                    Panel de administración (protegido por sesión/rol)
│   ├── home.html              Dashboard con resumen de productos y usuarios
│   ├── productos.html         Listado de productos (Mostrar producto), con filtro por categoría
│   ├── producto-nuevo.html    Crear producto (Nuevo producto)
│   ├── producto-editar.html   Editar/eliminar un producto existente (Editar producto)
│   ├── usuarios.html          Listado de usuarios (solo Administrador)
│   ├── usuario-nuevo.html     Crear usuario con rol (Administrador/Vendedor/Cliente)
│   ├── usuario-editar.html    Editar datos y rol de un usuario existente
│   └── admin.js                Protección de rutas y menú lateral según rol
│
├── css/
│   └── estilos.css           Hoja de estilos externa (única para todo el sitio)
│
└── img/
    └── *.svg                 Imágenes/íconos del sitio (placeholders editables)
```

## 🔐 Sistema de registro, login y roles

- El **registro público** (`registro.html`) crea usuarios reales guardados en
  `localStorage`, siempre con rol **Cliente**.
- El **login** (`login.html`) valida las credenciales contra los usuarios guardados
  y redirige según el rol: Administrador/Vendedor → panel `admin/home.html`,
  Cliente → `index.html`.
- El **panel de administración** (`admin/`) está protegido: si no hay sesión activa
  con el rol adecuado, redirige automáticamente al login.
- Desde `admin/usuarios.html` (solo rol Administrador) se pueden crear usuarios con
  cualquier rol (Administrador, Vendedor, Cliente), editarlos o eliminarlos.
- Desde `admin/productos.html` (Administrador y Vendedor) se puede ver el catálogo
  completo con filtro por categoría, crear productos (`producto-nuevo.html`, con
  código autogenerado según categoría), editarlos o eliminarlos
  (`producto-editar.html`). Los cambios se reflejan de inmediato en la tienda
  pública (`main/productos.html`, `main/index.html`, detalle y carrito), ya que
  ambos módulos comparten el mismo catálogo guardado en `localStorage`
  (`main/productos.js`).
- Las imágenes de producto pueden elegirse de una galería de fotografías reales
  (Wikimedia Commons, de uso libre) o **subirse directamente desde el
  computador** de quien administra el sitio (se convierten a Base64 y quedan
  guardadas junto con el producto en `localStorage`; máximo 1 MB por imagen).
- **Cuenta de administrador de prueba** (se crea automáticamente la primera vez que
  se abre el sitio): `admin@duoc.cl` / `admin123`.

## ▶️ Cómo abrir el proyecto en Visual Studio Code

1. Descomprime la carpeta `HuertoHogar-Tienda`.
2. Ábrela en Visual Studio Code (`Archivo > Abrir carpeta...`).
3. Instala la extensión **Live Server** (Ritwick Dey) si no la tienes.
4. Haz clic derecho sobre `main/index.html` y selecciona **"Open with Live Server"**.
   - También puedes simplemente abrir `main/index.html` directamente con doble clic en tu
     navegador, ya que el proyecto no requiere servidor ni backend ni internet: todas las
     fotos ya están guardadas en `img/`.

## ✅ Requisitos cubiertos (según pauta)

- **HTML5 semántico**: uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`,
  `<footer>` en todas las páginas.
- **Navegación completa**: menú principal, hipervínculos entre páginas, botones, imágenes,
  formularios, y footer en todas las vistas.
- **CSS externo**: una única hoja de estilos (`css/estilos.css`) enlazada en todas las
  páginas, con diseño responsivo (media queries) y paleta de colores basada en la propuesta
  visual del caso (verde esmeralda, amarillo mostaza, marrón).
- **JavaScript**:
  - Arreglo de productos de HuertoHogar (`main/script.js`) que se recorre para pintar las
    tarjetas de producto dinámicamente en Home, Productos y Detalle.
  - Carrito de compras funcional, guardado en `localStorage`.
  - Validaciones de formularios en tiempo real (registro, login y contacto), con mensajes de
    error personalizados: campos obligatorios, largo máximo/mínimo, formato de correo,
    dominios permitidos (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`), validación de RUN
    chileno, y confirmación de contraseña.
  - Región/Comuna con selección dependiente (arreglo complementario de JS).
  - Sistema de registro y login real con roles (Administrador, Vendedor, Cliente),
    persistido en `localStorage`, y panel de administración protegido para gestionar
    usuarios (ver sección "Sistema de registro, login y roles").
- **Repositorio Git**: recuerda inicializar tu repositorio (`git init`), subirlo a GitHub como
  repositorio público, y hacer commits descriptivos y frecuentes distribuyendo tareas entre
  los integrantes del equipo (requisito de la rúbrica).

## 🎨 Notas de diseño

El **logo** (`img/logo.svg`) se mantiene como ícono vectorial de marca. El resto de las
imágenes (hero de Home, foto de "Nosotros", portadas de los blogs, ícono de carrito
vacío y todas las fotos de productos) son **fotografías reales de uso libre**
(Wikimedia Commons), guardadas **localmente en `img/`**, tal como pide la rúbrica.
No dependen de internet: `main/*.html` y `main/productos.js` apuntan directamente a
`../img/<archivo>.jpg`. Si quieres reemplazar alguna, solo cambia el archivo dentro
de `img/` manteniendo el mismo nombre.

## 🧩 Posibles mejoras para las próximas entregas

- Restringir y construir la vista específica del rol Vendedor (listado de órdenes
  y productos, sin acceso a usuarios).
- Conectar el formulario de contacto y registro a un backend real (hoy usan
  `localStorage` como simulación de base de datos).
- Integrar un mapa interactivo en la página "Nosotros".
- Agregar sistema de reseñas y calificaciones de productos.
