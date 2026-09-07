/* =========================================================
   HuertoHogar - validaciones.js
   Validaciones de formularios controladas por JavaScript,
   con mensajes de error y sugerencias personalizadas.
   Depende de validaciones-base.js (cargarlo antes que este)
   y de usuarios.js para el registro y el login reales.
   ========================================================= */

/* =========================================================
   FORMULARIO: REGISTRO DE USUARIO
   ========================================================= */
function inicializarValidacionRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  inicializarRegiones("region", "comuna");

  const reglas = {
    run: [
      { test: (v) => v.length > 0, mensaje: "El RUN es obligatorio." },
      { test: (v) => v.length >= 7 && v.length <= 9, mensaje: "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion." },
      { test: (v) => validarRun(v), mensaje: "El RUN ingresado no es válido. Ejemplo válido: 19011022K" },
    ],
    nombre: [
      { test: (v) => v.length > 0, mensaje: "El nombre es obligatorio." },
      { test: (v) => v.length <= 50, mensaje: "El nombre no puede superar los 50 caracteres." },
    ],
    apellidos: [
      { test: (v) => v.length > 0, mensaje: "Los apellidos son obligatorios." },
      { test: (v) => v.length <= 100, mensaje: "Los apellidos no pueden superar los 100 caracteres." },
    ],
    correo: [
      { test: (v) => v.length > 0, mensaje: "El correo es obligatorio." },
      { test: (v) => v.length <= 100, mensaje: "El correo no puede superar los 100 caracteres." },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), mensaje: "Ingresa un correo con formato válido." },
      { test: (v) => correoTieneDominioValido(v), mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" },
    ],
    contrasena: [
      { test: (v) => v.length > 0, mensaje: "La contraseña es obligatoria." },
      { test: (v) => v.length >= 4 && v.length <= 10, mensaje: "La contraseña debe tener entre 4 y 10 caracteres." },
    ],
    direccion: [
      { test: (v) => v.length > 0, mensaje: "La dirección es obligatoria." },
      { test: (v) => v.length <= 300, mensaje: "La dirección no puede superar los 300 caracteres." },
    ],
    region: [{ test: (v) => v.length > 0, mensaje: "Selecciona una región." }],
    comuna: [{ test: (v) => v.length > 0, mensaje: "Selecciona una comuna." }],
  };

  Object.keys(reglas).forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", () => validarCampo(id, reglas[id]));
      input.addEventListener("input", () => {
        if (input.closest(".campo").classList.contains("invalido")) {
          validarCampo(id, reglas[id]);
        }
      });
    }
  });

  function validarConfirmacion() {
    const pass = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar-contrasena");
    if (confirmar.value.length === 0) {
      marcarInvalido("confirmar-contrasena", "Debes confirmar tu contraseña.");
      return false;
    }
    if (confirmar.value !== pass) {
      marcarInvalido("confirmar-contrasena", "Las contraseñas no coinciden.");
      return false;
    }
    marcarValido("confirmar-contrasena");
    return true;
  }
  const confirmarInput = document.getElementById("confirmar-contrasena");
  if (confirmarInput) {
    confirmarInput.addEventListener("blur", validarConfirmacion);
    confirmarInput.addEventListener("input", validarConfirmacion);
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;
    Object.keys(reglas).forEach((id) => {
      if (!validarCampo(id, reglas[id])) esValido = false;
    });
    if (!validarConfirmacion()) esValido = false;

    const runValor = document.getElementById("run").value.trim();
    const correoValor = document.getElementById("correo").value.trim();

    // Validaciones de unicidad contra los usuarios ya registrados.
    if (esValido && typeof buscarUsuarioPorRun === "function" && buscarUsuarioPorRun(runValor)) {
      marcarInvalido("run", "Ya existe un usuario registrado con este RUN.");
      esValido = false;
    }
    if (esValido && typeof buscarUsuarioPorCorreo === "function" && buscarUsuarioPorCorreo(correoValor)) {
      marcarInvalido("correo", "Ya existe una cuenta registrada con este correo.");
      esValido = false;
    }

    const mensajeExito = document.getElementById("mensaje-exito-registro");
    if (esValido) {
      // Todo registro público queda con rol Cliente. Los roles Administrador
      // y Vendedor solo se asignan desde el panel de administración.
      crearUsuario({
        run: runValor,
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        correo: correoValor,
        contrasena: document.getElementById("contrasena").value,
        fechaNacimiento: document.getElementById("fecha-nacimiento").value,
        tipoUsuario: "Cliente",
        region: document.getElementById("region").value,
        comuna: document.getElementById("comuna").value,
        direccion: document.getElementById("direccion").value.trim(),
      });

      mensajeExito.style.display = "block";
      mensajeExito.textContent = "¡Registro exitoso! Redirigiendo a inicio de sesión...";
      form.reset();
      document.querySelectorAll(".campo").forEach((c) => c.classList.remove("valido", "invalido"));
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1400);
    } else {
      mensajeExito.style.display = "none";
      const primerError = form.querySelector(".campo.invalido");
      if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* =========================================================
   FORMULARIO: INICIO DE SESIÓN
   ========================================================= */
function inicializarValidacionLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  const reglas = {
    "correo-login": [
      { test: (v) => v.length > 0, mensaje: "El correo es obligatorio." },
      { test: (v) => v.length <= 100, mensaje: "El correo no puede superar los 100 caracteres." },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), mensaje: "Ingresa un correo con formato válido." },
      { test: (v) => correoTieneDominioValido(v), mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" },
    ],
    "contrasena-login": [
      { test: (v) => v.length > 0, mensaje: "La contraseña es obligatoria." },
      { test: (v) => v.length >= 4 && v.length <= 10, mensaje: "La contraseña debe tener entre 4 y 10 caracteres." },
    ],
  };

  Object.keys(reglas).forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", () => validarCampo(id, reglas[id]));
    }
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;
    Object.keys(reglas).forEach((id) => {
      if (!validarCampo(id, reglas[id])) esValido = false;
    });

    const mensajeExito = document.getElementById("mensaje-exito-login");
    if (!esValido) {
      mensajeExito.style.display = "none";
      return;
    }

    const correo = document.getElementById("correo-login").value.trim();
    const contrasena = document.getElementById("contrasena-login").value;
    const usuario = typeof validarCredenciales === "function" ? validarCredenciales(correo, contrasena) : null;

    if (!usuario) {
      mensajeExito.style.display = "none";
      marcarInvalido("contrasena-login", "Correo o contraseña incorrectos.");
      return;
    }

    iniciarSesion(usuario);
    mensajeExito.style.display = "block";
    mensajeExito.textContent = `Bienvenido/a, ${usuario.nombre}. Redirigiendo...`;

    setTimeout(() => {
      if (usuario.tipoUsuario === "Administrador" || usuario.tipoUsuario === "Vendedor") {
        window.location.href = "../admin/home.html";
      } else {
        window.location.href = "index.html";
      }
    }, 900);
  });
}

/* =========================================================
   FORMULARIO: CONTACTO
   ========================================================= */
function inicializarValidacionContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  const reglas = {
    "nombre-contacto": [
      { test: (v) => v.length > 0, mensaje: "El nombre es obligatorio." },
      { test: (v) => v.length <= 100, mensaje: "El nombre no puede superar los 100 caracteres." },
    ],
    "correo-contacto": [
      { test: (v) => v.length > 0, mensaje: "El correo es obligatorio." },
      { test: (v) => v.length <= 100, mensaje: "El correo no puede superar los 100 caracteres." },
      { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), mensaje: "Ingresa un correo con formato válido." },
      { test: (v) => correoTieneDominioValido(v), mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" },
    ],
    "comentario-contacto": [
      { test: (v) => v.length > 0, mensaje: "El comentario es obligatorio." },
      { test: (v) => v.length <= 500, mensaje: "El comentario no puede superar los 500 caracteres." },
    ],
  };

  Object.keys(reglas).forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", () => validarCampo(id, reglas[id]));
    }
  });

  const comentarioInput = document.getElementById("comentario-contacto");
  const contador = document.getElementById("contador-comentario");
  if (comentarioInput && contador) {
    comentarioInput.addEventListener("input", () => {
      contador.textContent = `${comentarioInput.value.length} / 500 caracteres`;
    });
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    let esValido = true;
    Object.keys(reglas).forEach((id) => {
      if (!validarCampo(id, reglas[id])) esValido = false;
    });

    const mensajeExito = document.getElementById("mensaje-exito-contacto");
    if (esValido) {
      mensajeExito.style.display = "block";
      mensajeExito.textContent = "¡Gracias por escribirnos! Tu mensaje fue enviado correctamente.";
      form.reset();
      document.querySelectorAll(".campo").forEach((c) => c.classList.remove("valido", "invalido"));
      if (contador) contador.textContent = "0 / 500 caracteres";
    } else {
      mensajeExito.style.display = "none";
    }
  });
}

/* ---------- Inicialización ---------- */
document.addEventListener("DOMContentLoaded", () => {
  inicializarValidacionRegistro();
  inicializarValidacionLogin();
  inicializarValidacionContacto();
});
