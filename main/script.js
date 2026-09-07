/* =========================================================
   HuertoHogar - script.js
   Contiene:
   - Carga del arreglo de productos (persistido y gestionado
     desde productos.js / panel admin)
   - Lógica del carrito de compras usando localStorage
   - Renderizado dinámico de productos (home, listado, detalle)
   - Menú responsivo
   Depende de productos.js (cargarlo antes que este archivo).
   ========================================================= */

/* ---------- 1. Arreglo de productos (Forma A - HuertoHogar) ----------
   Se obtiene desde localStorage a través de productos.js. La primera
   vez se siembra automáticamente con el catálogo inicial. Desde el
   panel de administración (admin/producto-nuevo.html,
   admin/producto-editar.html) se puede crear, editar y eliminar
   productos de este mismo catálogo. */
let productos = obtenerProductos();

/* ---------- 2. Utilidades generales ---------- */
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

function buscarProducto(id) {
  return productos.find((p) => p.id === id);
}

/* ---------- 3. Carrito de compras (localStorage) ---------- */
const CARRITO_KEY = "huertohogar_carrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CARRITO_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(id, cantidad) {
  cantidad = parseInt(cantidad) || 1;
  const carrito = obtenerCarrito();
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ id: id, cantidad: cantidad });
  }
  guardarCarrito(carrito);
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function cambiarCantidadCarrito(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  nuevaCantidad = parseInt(nuevaCantidad);
  if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;
  item.cantidad = nuevaCantidad;
  guardarCarrito(carrito);
  renderizarCarrito();
}

function totalItemsCarrito() {
  return obtenerCarrito().reduce((acc, item) => acc + item.cantidad, 0);
}

function actualizarContadorCarrito() {
  document.querySelectorAll(".contador-carrito").forEach((el) => {
    el.textContent = totalItemsCarrito();
  });
}

/* ---------- 4. Renderizado de tarjetas de producto ---------- */
function crearTarjetaProducto(producto) {
  const alertaStock =
    producto.stock <= producto.stockCritico
      ? `<p class="stock-critico">¡Quedan pocas unidades!</p>`
      : "";

  return `
    <article class="tarjeta-producto">
      <a href="producto-detalle.html?id=${producto.id}">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </a>
      <div class="info">
        <span class="categoria">${producto.categoria}</span>
        <h3><a href="producto-detalle.html?id=${producto.id}">${producto.nombre}</a></h3>
        ${alertaStock}
        <span class="precio">${formatearPrecio(producto.precio)} / ${producto.unidad}</span>
        <button class="btn btn-primario btn-pequeno" onclick="agregarAlCarrito('${producto.id}', 1); mostrarConfirmacionAgregado('${producto.nombre}');">
          Añadir al carrito
        </button>
      </div>
    </article>
  `;
}

function renderizarGrilla(contenedorId, listaProductos) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;
  if (listaProductos.length === 0) {
    contenedor.innerHTML = `<p class="centrado">No hay productos en esta categoría por el momento.</p>`;
    return;
  }
  contenedor.innerHTML = listaProductos.map(crearTarjetaProducto).join("");
}

function mostrarConfirmacionAgregado(nombre) {
  const aviso = document.getElementById("aviso-flotante");
  if (!aviso) return;
  aviso.textContent = `"${nombre}" se añadió al carrito.`;
  aviso.style.display = "block";
  clearTimeout(window._avisoTimeout);
  window._avisoTimeout = setTimeout(() => {
    aviso.style.display = "none";
  }, 2200);
}

/* ---------- 5. Filtro por categoría (página productos.html) ---------- */
function inicializarFiltros() {
  const botones = document.querySelectorAll(".filtro-btn");
  if (botones.length === 0) return;

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      botones.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      const categoria = btn.dataset.categoria;
      const filtrados =
        categoria === "todos"
          ? productos
          : productos.filter((p) => p.categoria === categoria);
      renderizarGrilla("grilla-productos", filtrados);
    });
  });
}

/* ---------- 6. Página de detalle de producto ---------- */
function renderizarDetalleProducto() {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || productos[0].id;
  const producto = buscarProducto(id) || productos[0];

  document.title = `${producto.nombre} - HuertoHogar`;

  const migaCategoria = document.getElementById("miga-categoria");
  const migaProducto = document.getElementById("miga-producto");
  if (migaCategoria) migaCategoria.textContent = producto.categoria;
  if (migaProducto) migaProducto.textContent = producto.nombre;

  const alertaStock =
    producto.stock <= producto.stockCritico
      ? `<div class="alerta-stock">⚠️ Stock crítico: quedan solo ${producto.stock} unidades disponibles.</div>`
      : "";

  contenedor.innerHTML = `
    <div>
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="detalle-info">
      <h1>${producto.nombre}</h1>
      <p class="codigo">Código: ${producto.id}</p>
      <p class="precio-detalle">${formatearPrecio(producto.precio)} <small>/ ${producto.unidad}</small></p>
      ${alertaStock}
      <p class="descripcion">${producto.descripcion}</p>
      <div class="selector-cantidad">
        <label for="cantidad">Cantidad:</label>
        <input type="number" id="cantidad" min="1" max="${producto.stock}" value="1">
      </div>
      <button class="btn btn-primario" id="btn-agregar-carrito">Añadir al carrito</button>
      <div class="mensaje-confirmacion" id="confirmacion-detalle">Producto añadido al carrito correctamente.</div>
    </div>
  `;

  document.getElementById("btn-agregar-carrito").addEventListener("click", () => {
    const cantidad = document.getElementById("cantidad").value;
    agregarAlCarrito(producto.id, cantidad);
    const conf = document.getElementById("confirmacion-detalle");
    conf.style.display = "block";
    setTimeout(() => (conf.style.display = "none"), 2500);
  });

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);
  renderizarGrilla("productos-relacionados", relacionados.length ? relacionados : productos.filter(p => p.id !== producto.id).slice(0,4));
}

/* ---------- 7. Página de carrito ---------- */
function renderizarCarrito() {
  const contenedorTabla = document.getElementById("cuerpo-tabla-carrito");
  const zonaVacio = document.getElementById("carrito-vacio");
  const zonaTabla = document.getElementById("zona-tabla-carrito");
  if (!contenedorTabla) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    if (zonaVacio) zonaVacio.style.display = "block";
    if (zonaTabla) zonaTabla.style.display = "none";
    return;
  }

  if (zonaVacio) zonaVacio.style.display = "none";
  if (zonaTabla) zonaTabla.style.display = "block";

  let total = 0;
  contenedorTabla.innerHTML = carrito
    .map((item) => {
      const producto = buscarProducto(item.id);
      if (!producto) return "";
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      return `
        <tr>
          <td>
            <div class="producto-carrito">
              <img src="${producto.imagen}" alt="${producto.nombre}">
              <div>
                <strong>${producto.nombre}</strong><br>
                <small>${formatearPrecio(producto.precio)} / ${producto.unidad}</small>
              </div>
            </div>
          </td>
          <td>
            <div class="control-cantidad">
              <button onclick="cambiarCantidadCarrito('${producto.id}', ${item.cantidad - 1})">-</button>
              <input type="number" min="1" value="${item.cantidad}" onchange="cambiarCantidadCarrito('${producto.id}', this.value)">
              <button onclick="cambiarCantidadCarrito('${producto.id}', ${item.cantidad + 1})">+</button>
            </div>
          </td>
          <td>${formatearPrecio(subtotal)}</td>
          <td><button class="btn-eliminar" onclick="eliminarDelCarrito('${producto.id}')">Eliminar</button></td>
        </tr>
      `;
    })
    .join("");

  const totalEl = document.getElementById("total-carrito");
  if (totalEl) totalEl.textContent = formatearPrecio(total);
}

/* ---------- 7.1 Barra de navegación según sesión activa ---------- */
function actualizarNavSesion() {
  const zonaInvitado = document.getElementById("zona-invitado");
  const zonaUsuario = document.getElementById("zona-usuario");
  if (!zonaInvitado || !zonaUsuario) return;

  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;

  const linkPanelAdmin = document.getElementById("link-panel-admin");
  const ROLES_CON_ACCESO_ADMIN = ["Administrador", "Vendedor"];

  if (sesion) {
    zonaInvitado.style.display = "none";
    zonaUsuario.style.display = "inline-flex";
    const nombreEl = document.getElementById("nombre-usuario-nav");
    if (nombreEl) nombreEl.textContent = sesion.nombre;

    if (linkPanelAdmin) {
      const tieneAccesoAdmin = ROLES_CON_ACCESO_ADMIN.includes(sesion.tipoUsuario);
      linkPanelAdmin.style.display = tieneAccesoAdmin ? "inline" : "none";
    }
  } else {
    zonaInvitado.style.display = "inline-flex";
    zonaUsuario.style.display = "none";
    if (linkPanelAdmin) linkPanelAdmin.style.display = "none";
  }

  const botonCerrar = document.getElementById("cerrar-sesion-nav");
  if (botonCerrar && !botonCerrar.dataset.listo) {
    botonCerrar.dataset.listo = "true";
    botonCerrar.addEventListener("click", (evento) => {
      evento.preventDefault();
      if (typeof cerrarSesion === "function") cerrarSesion();
      window.location.href = "index.html";
    });
  }
}

/* ---------- 8. Menú responsivo ---------- */
function inicializarMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu-principal");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    menu.classList.toggle("abierto");
  });
}

/* ---------- 9. Marcar enlace activo en navegación ---------- */
function marcarEnlaceActivo() {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu-principal a").forEach((enlace) => {
    if (enlace.getAttribute("href") === pagina) {
      enlace.classList.add("activo");
    }
  });
}

/* ---------- 10. Inicialización general ---------- */
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  actualizarNavSesion();
  inicializarMenu();
  marcarEnlaceActivo();

  // Home: primeros 8 productos destacados
  renderizarGrilla("grilla-destacados", productos.slice(0, 8));

  // Página de productos completa
  if (document.getElementById("grilla-productos")) {
    renderizarGrilla("grilla-productos", productos);
    inicializarFiltros();
  }

  // Detalle de producto
  renderizarDetalleProducto();

  // Carrito
  renderizarCarrito();
});
