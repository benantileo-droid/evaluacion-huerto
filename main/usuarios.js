/* =========================================================
   HuertoHogar - usuarios.js
   Manejo de usuarios y sesión activa.
   Persistencia real en localStorage (simula backend/BD).
   ========================================================= */

const CLAVE_USUARIOS = "huertohogar_usuarios";
const CLAVE_SESION = "huertohogar_sesion";

/* ---------- Utilidades internas ---------- */
function normalizarRun(run) {
  return String(run || "").replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

/* ---------- CRUD de usuarios ---------- */
function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS);
  return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function buscarUsuarioPorRun(run) {
  const runNormalizado = normalizarRun(run);
  return obtenerUsuarios().find((u) => u.run === runNormalizado) || null;
}

function buscarUsuarioPorCorreo(correo) {
  const correoNormalizado = String(correo || "").toLowerCase();
  return obtenerUsuarios().find((u) => u.correo.toLowerCase() === correoNormalizado) || null;
}

function crearUsuario(datos) {
  const usuarios = obtenerUsuarios();
  const nuevoUsuario = {
    run: normalizarRun(datos.run),
    nombre: (datos.nombre || "").trim(),
    apellidos: (datos.apellidos || "").trim(),
    correo: (datos.correo || "").trim(),
    contrasena: datos.contrasena || "",
    fechaNacimiento: datos.fechaNacimiento || "",
    tipoUsuario: datos.tipoUsuario || "Cliente",
    region: datos.region || "",
    comuna: datos.comuna || "",
    direccion: (datos.direccion || "").trim(),
  };
  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  return nuevoUsuario;
}

function actualizarUsuario(runOriginal, datosNuevos) {
  const usuarios = obtenerUsuarios();
  const runBuscado = normalizarRun(runOriginal);
  const indice = usuarios.findIndex((u) => u.run === runBuscado);
  if (indice === -1) return null;

  usuarios[indice] = {
    ...usuarios[indice],
    ...datosNuevos,
    run: datosNuevos.run ? normalizarRun(datosNuevos.run) : usuarios[indice].run,
  };
  guardarUsuarios(usuarios);

  // Si el usuario editado es el que tiene la sesión activa, se actualiza también.
  const sesion = obtenerSesion();
  if (sesion && sesion.run === runBuscado) {
    iniciarSesion(usuarios[indice]);
  }
  return usuarios[indice];
}

function eliminarUsuario(run) {
  const runBuscado = normalizarRun(run);
  const usuarios = obtenerUsuarios().filter((u) => u.run !== runBuscado);
  guardarUsuarios(usuarios);
}

/* ---------- Autenticación / sesión ---------- */
function validarCredenciales(correo, contrasena) {
  const correoNormalizado = String(correo || "").toLowerCase();
  return (
    obtenerUsuarios().find(
      (u) => u.correo.toLowerCase() === correoNormalizado && u.contrasena === contrasena
    ) || null
  );
}

function iniciarSesion(usuario) {
  const sesion = {
    run: usuario.run,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    tipoUsuario: usuario.tipoUsuario,
  };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function obtenerSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

/* ---------- Usuario administrador por defecto ----------
   Se crea una sola vez para poder acceder al panel admin
   sin depender de un registro previo.
   Credenciales: admin@duoc.cl / admin123
---------------------------------------------------------- */
function sembrarAdministradorPorDefecto() {
  if (!buscarUsuarioPorCorreo("admin@duoc.cl")) {
    crearUsuario({
      run: "111111111",
      nombre: "Administrador",
      apellidos: "HuertoHogar",
      correo: "admin@duoc.cl",
      contrasena: "admin123",
      tipoUsuario: "Administrador",
      region: "Región Metropolitana de Santiago",
      comuna: "Santiago",
      direccion: "Casa matriz HuertoHogar",
    });
  }
}

document.addEventListener("DOMContentLoaded", sembrarAdministradorPorDefecto);
