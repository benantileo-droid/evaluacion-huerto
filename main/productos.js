/* =========================================================
   HuertoHogar - productos.js
   CRUD de productos con persistencia real en localStorage
   (simula backend/BD), igual que usuarios.js para usuarios.
   Debe cargarse ANTES de script.js y de admin.js en las
   páginas que muestren o gestionen productos.
   ========================================================= */

const CLAVE_PRODUCTOS = "huertohogar_productos";

/* Categorías válidas y prefijo de código usado para generar IDs. */
const CATEGORIAS_PRODUCTO = {
  "Frutas Frescas": "FR",
  "Verduras Orgánicas": "VR",
  "Productos Orgánicos": "PO",
  "Productos Lácteos": "PL",
};

/* Imágenes reales disponibles para asociar a un producto desde la galería
   (fotografías guardadas en la carpeta img/, originalmente de Wikimedia
   Commons, de uso libre). También se puede subir una foto propia desde el
   computador en el formulario de producto. */
const IMAGENES_PRODUCTO = [
  { valor: "../img/manzanas.jpg", texto: "Manzanas" },
  { valor: "../img/naranjas.jpg", texto: "Naranjas" },
  { valor: "../img/platanos.jpg", texto: "Plátanos" },
  { valor: "../img/zanahorias.jpg", texto: "Zanahorias" },
  { valor: "../img/espinacas.jpg", texto: "Espinacas" },
  { valor: "../img/pimientos.jpg", texto: "Pimientos" },
  { valor: "../img/miel.jpg", texto: "Miel" },
  { valor: "../img/quinua.jpg", texto: "Quinua" },
  { valor: "../img/leche.jpg", texto: "Leche" },
];

/* ---------- Catálogo inicial (semilla, Forma A - HuertoHogar) ---------- */
const PRODUCTOS_INICIALES = [
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    unidad: "kilo",
    stock: 150,
    stockCritico: 20,
    imagen: "../img/manzanas.jpg",
    descripcion:
      "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
  },
  {
    id: "FR002",
    nombre: "Naranjas Valencia",
    categoria: "Frutas Frescas",
    precio: 1000,
    unidad: "kilo",
    stock: 200,
    stockCritico: 25,
    imagen: "../img/naranjas.jpg",
    descripcion:
      "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
  },
  {
    id: "FR003",
    nombre: "Plátanos Cavendish",
    categoria: "Frutas Frescas",
    precio: 800,
    unidad: "kilo",
    stock: 250,
    stockCritico: 30,
    imagen: "../img/platanos.jpg",
    descripcion:
      "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
  },
  {
    id: "VR001",
    nombre: "Zanahorias Orgánicas",
    categoria: "Verduras Orgánicas",
    precio: 900,
    unidad: "kilo",
    stock: 100,
    stockCritico: 15,
    imagen: "../img/zanahorias.jpg",
    descripcion:
      "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
  },
  {
    id: "VR002",
    nombre: "Espinacas Frescas",
    categoria: "Verduras Orgánicas",
    precio: 700,
    unidad: "bolsa 500g",
    stock: 80,
    stockCritico: 10,
    imagen: "../img/espinacas.jpg",
    descripcion:
      "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
  },
  {
    id: "VR003",
    nombre: "Pimientos Tricolores",
    categoria: "Verduras Orgánicas",
    precio: 1500,
    unidad: "kilo",
    stock: 120,
    stockCritico: 15,
    imagen: "../img/pimientos.jpg",
    descripcion:
      "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, añaden un toque vibrante a cualquier receta.",
  },
  {
    id: "PO001",
    nombre: "Miel Orgánica",
    categoria: "Productos Orgánicos",
    precio: 5000,
    unidad: "frasco 500g",
    stock: 50,
    stockCritico: 8,
    imagen: "../img/miel.jpg",
    descripcion:
      "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
  },
  {
    id: "PO003",
    nombre: "Quinua Orgánica",
    categoria: "Productos Orgánicos",
    precio: 3200,
    unidad: "bolsa 1kg",
    stock: 60,
    stockCritico: 10,
    imagen: "../img/quinua.jpg",
    descripcion:
      "Quinua orgánica cultivada de forma responsable. Alta en proteínas y libre de gluten, ideal para ensaladas, guisos y una alimentación saludable.",
  },
  {
    id: "PL001",
    nombre: "Leche Entera",
    categoria: "Productos Lácteos",
    precio: 1100,
    unidad: "litro",
    stock: 90,
    stockCritico: 12,
    imagen: "../img/leche.jpg",
    descripcion:
      "Leche entera proveniente de granjas locales dedicadas a la producción responsable. Rica en calcio y nutrientes esenciales, perfecta para toda la familia.",
  },
];

/* Se sube cada vez que cambia el catálogo semilla (ej: se actualizan fotos de
   productos). Si la versión guardada en el navegador no coincide, se vuelve a
   sembrar el catálogo con los datos nuevos; así el cambio llega también a
   quienes ya habían abierto el sitio antes y tenían datos viejos guardados en
   su localStorage. Las ediciones hechas desde el panel admin no se pierden
   una vez que la versión ya quedó al día. */
const VERSION_CATALOGO_PRODUCTOS = 4;
const CLAVE_VERSION_PRODUCTOS = "huertohogar_productos_version";

/* ---------- CRUD de productos ---------- */
function obtenerProductos() {
  const datos = localStorage.getItem(CLAVE_PRODUCTOS);
  const versionGuardada = Number(localStorage.getItem(CLAVE_VERSION_PRODUCTOS));

  if (!datos || versionGuardada !== VERSION_CATALOGO_PRODUCTOS) {
    guardarProductos(PRODUCTOS_INICIALES);
    localStorage.setItem(CLAVE_VERSION_PRODUCTOS, String(VERSION_CATALOGO_PRODUCTOS));
    return PRODUCTOS_INICIALES.slice();
  }
  return JSON.parse(datos);
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function buscarProductoPorId(id) {
  const idBuscado = String(id || "").toUpperCase();
  return obtenerProductos().find((p) => p.id === idBuscado) || null;
}

/** Genera el siguiente código correlativo para una categoría (Ej: FR004). */
function generarIdProducto(categoria) {
  const prefijo = CATEGORIAS_PRODUCTO[categoria] || "PR";
  const productos = obtenerProductos();
  const numeros = productos
    .filter((p) => p.id.startsWith(prefijo))
    .map((p) => parseInt(p.id.slice(prefijo.length), 10))
    .filter((n) => !isNaN(n));
  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return prefijo + String(siguiente).padStart(3, "0");
}

function crearProducto(datos) {
  const productos = obtenerProductos();
  const nuevoProducto = {
    id: datos.id || generarIdProducto(datos.categoria),
    nombre: (datos.nombre || "").trim(),
    categoria: datos.categoria || "",
    precio: Number(datos.precio) || 0,
    unidad: (datos.unidad || "").trim(),
    stock: Number(datos.stock) || 0,
    stockCritico: Number(datos.stockCritico) || 0,
    imagen: datos.imagen || "../img/manzanas.jpg",
    descripcion: (datos.descripcion || "").trim(),
  };
  productos.push(nuevoProducto);
  guardarProductos(productos);
  return nuevoProducto;
}

function actualizarProducto(idOriginal, datosNuevos) {
  const productos = obtenerProductos();
  const idBuscado = String(idOriginal || "").toUpperCase();
  const indice = productos.findIndex((p) => p.id === idBuscado);
  if (indice === -1) return null;

  productos[indice] = {
    ...productos[indice],
    ...datosNuevos,
    precio:
      datosNuevos.precio !== undefined ? Number(datosNuevos.precio) : productos[indice].precio,
    stock: datosNuevos.stock !== undefined ? Number(datosNuevos.stock) : productos[indice].stock,
    stockCritico:
      datosNuevos.stockCritico !== undefined
        ? Number(datosNuevos.stockCritico)
        : productos[indice].stockCritico,
  };
  guardarProductos(productos);
  return productos[indice];
}

function eliminarProducto(id) {
  const idBuscado = String(id || "").toUpperCase();
  const productos = obtenerProductos().filter((p) => p.id !== idBuscado);
  guardarProductos(productos);
}
