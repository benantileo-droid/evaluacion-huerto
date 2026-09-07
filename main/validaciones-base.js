/* =========================================================
   HuertoHogar - validaciones-base.js
   Utilidades de validación reutilizables por los formularios
   de la tienda (registro, login, contacto) Y por el panel
   de administración (nuevo/editar usuario). Debe cargarse
   ANTES de validaciones.js y de cualquier script que use
   estas funciones.
   ========================================================= */

/* ---------- Arreglo complementario: Regiones y Comunas ---------- */
const regionesYComunas = {
  "Región Metropolitana de Santiago": ["Santiago", "Providencia", "Maipú", "Ñuñoa"],
  "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
  "Región del Biobío": ["Concepción", "Nacimiento", "Los Ángeles"],
  "Región de la Araucanía": ["Villarrica", "Temuco", "Pucón"],
  "Región de Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno"],
  "Región de Ñuble": ["Chillán", "San Carlos"],
};

/* ---------- Utilidades de validación ---------- */
const CORREOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

function correoTieneDominioValido(correo) {
  const partes = correo.split("@");
  if (partes.length !== 2) return false;
  return CORREOS_PERMITIDOS.includes(partes[1].toLowerCase());
}

function validarRun(run) {
  run = run.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (run.length < 7 || run.length > 9) return false;
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dv === dvEsperado;
}

/* ---------- Mostrar / limpiar errores en un campo ---------- */
function marcarInvalido(inputId, mensaje) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const campo = input.closest(".campo");
  const errorEl = campo.querySelector(".mensaje-error");
  campo.classList.add("invalido");
  campo.classList.remove("valido");
  if (errorEl) errorEl.textContent = mensaje;
}

function marcarValido(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const campo = input.closest(".campo");
  campo.classList.remove("invalido");
  campo.classList.add("valido");
}

/* ---------- Validador genérico reutilizable ---------- */
function validarCampo(inputId, reglas) {
  const input = document.getElementById(inputId);
  if (!input) return true;
  const valor = input.value.trim();

  for (const regla of reglas) {
    if (!regla.test(valor)) {
      marcarInvalido(inputId, regla.mensaje);
      return false;
    }
  }
  marcarValido(inputId);
  return true;
}

/* ---------- Región / Comuna dependientes ---------- */
function inicializarRegiones(selectRegionId, selectComunaId) {
  const selectRegion = document.getElementById(selectRegionId);
  const selectComuna = document.getElementById(selectComunaId);
  if (!selectRegion || !selectComuna) return;

  Object.keys(regionesYComunas).forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region;
    opcion.textContent = region;
    selectRegion.appendChild(opcion);
  });

  function actualizarComunas() {
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    const comunas = regionesYComunas[selectRegion.value] || [];
    comunas.forEach((comuna) => {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      selectComuna.appendChild(opcion);
    });
  }

  selectRegion.addEventListener("change", actualizarComunas);
}
