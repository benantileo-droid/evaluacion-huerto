/* =========================================================
   HuertoHogar - admin.js
   Protección de rutas, menú lateral dinámico según rol,
   y utilidades comunes al panel de administración.
   Depende de ../main/usuarios.js (cargarlo antes que este).
   ========================================================= */

/* Roles que pueden entrar al panel administrativo en general. */
const ROLES_CON_ACCESO_ADMIN = ["Administrador", "Vendedor"];

/**
 * Verifica que exista una sesión activa y que su rol esté dentro de
 * los roles permitidos para la página actual. Si no cumple, redirige
 * al login. Devuelve la sesión si todo está correcto.
 */
function protegerRutaAdmin(rolesPermitidos) {
  const sesion = obtenerSesion();
  if (!sesion || !rolesPermitidos.includes(sesion.tipoUsuario)) {
    window.location.href = "../main/login.html";
    return null;
  }
  return sesion;
}

/** Pinta el menú lateral según el rol de la sesión activa. */
function renderizarMenuAdmin(sesion, paginaActiva) {
  const contenedor = document.getElementById("menu-admin");
  if (!contenedor) return;

  const esAdministrador = sesion.tipoUsuario === "Administrador";

  const items = [
    { id: "home", href: "home.html", icono: "📊", texto: "Dashboard", visible: true },
    { id: "productos", href: "productos.html", icono: "🥕", texto: "Productos", visible: true },
    { id: "usuarios", href: "usuarios.html", icono: "👤", texto: "Usuarios", visible: esAdministrador },
    { id: "tienda", href: "../main/index.html", icono: "🏬", texto: "Ver tienda", visible: true },
  ];

  let html = `<div class="marca-admin">HuertoHogar<br><small>Panel ${sesion.tipoUsuario}</small></div>`;
  items
    .filter((item) => item.visible)
    .forEach((item) => {
      const clase = item.id === paginaActiva ? "activo" : "";
      html += `<a href="${item.href}" class="${clase}">${item.icono} ${item.texto}</a>`;
    });

  contenedor.innerHTML = html;

  const botonCerrar = document.createElement("button");
  botonCerrar.className = "cerrar-sesion-admin";
  botonCerrar.textContent = "Cerrar sesión";
  botonCerrar.addEventListener("click", () => {
    cerrarSesion();
    window.location.href = "../main/login.html";
  });
  contenedor.appendChild(botonCerrar);
}

/** Muestra el nombre de la persona conectada en el encabezado del panel. */
function mostrarSaludoAdmin(sesion) {
  const el = document.getElementById("saludo-admin");
  if (el) el.textContent = `${sesion.nombre} ${sesion.apellidos || ""}`.trim();
}
