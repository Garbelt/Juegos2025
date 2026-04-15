/* ================= BOTONERA MÓVIL ================= */

const mobileControls = document.querySelector(".mobile-controls");
const mainBtn = document.getElementById("mobile-main-btn");
const mobileReadBtn = document.getElementById("mobile-read-btn");
const mobileToggleHeaderBtn = document.getElementById("mobile-toggle-header-btn");
const mobilePanelBtn = document.getElementById("mobile-panel-btn");

let autoCloseTimeout;
let panelState = 0; // 0=full | 1=mini | 2=hidden


/* ================= UTILIDAD ================= */

function leerBoton(btn) {
  // 🚫 Este botón nunca se lee
  if (btn.id === "mobile-main-btn") {
    return;
  }
  // 🚫 No leer mientras el sistema está leyendo
  if (typeof leyendoAhora !== "undefined" && leyendoAhora) {
    return;
  }
  // 🚫 Caso especial: botón deshabilitado para este juego
  if (
    btn.id === "mobile-toggle-header-btn" &&
    document.body.classList.contains("no-header-toggle")
  ) {
    hablar("Opción no disponible");
    return;
  }
  const texto = btn.getAttribute("aria-label");
  if (texto && typeof hablar === "function") {
    hablar(texto);
  }
}

/* ================= ACTUALIZAR LABELS ================= */

function actualizarBotonPanel() {

  if (document.body.classList.contains("panel-mini")) {
    mobilePanelBtn.setAttribute("aria-label", "Ocultar panel");
    panelState = 1;
  }

  else if (document.body.classList.contains("panel-hidden")) {
    mobilePanelBtn.setAttribute("aria-label", "Maximizar tamaño del panel");
    panelState = 2;
  }

  else {
    // Default seguro
    document.body.classList.add("panel-full");
    mobilePanelBtn.setAttribute("aria-label", "Reducir tamaño del panel");
    panelState = 0;
  }
}

function actualizarBotonTitulos() {
  mobileToggleHeaderBtn.setAttribute(
    "aria-label",
    "Opción no disponible"
  );
}

function actualizarBotonLectura() {

  if (typeof lecturaActiva !== "undefined" && lecturaActiva) {
    mobileReadBtn.setAttribute("aria-label", "Cancelar lectura");
  } else {
    mobileReadBtn.setAttribute("aria-label", "Activar lectura");
  }
}


/* ================= BOTÓN PRINCIPAL ================= */

mainBtn.addEventListener("click", (e) => {
  // 🚫 No abrir si el sistema no está listo
  if (typeof sistemaListo !== "undefined" && !sistemaListo) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  // 🚫 No abrir si el sistema está leyendo
  if (typeof leyendoAhora !== "undefined" && leyendoAhora) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  mobileControls.classList.toggle("open");
  if (mobileControls.classList.contains("open")) {
    clearTimeout(autoCloseTimeout);
    autoCloseTimeout = setTimeout(() => {
      mobileControls.classList.remove("open");
    }, 5000);
  }
});

/* ================= TOGGLE TÍTULOS ================= */

mobileToggleHeaderBtn.addEventListener("click", () => {

  // 🚫 Este juego no permite ocultar títulos
  if (document.body.classList.contains("no-header-toggle")) {

    if (typeof hablar === "function") {
      hablar("Opción no disponible para este juego");
    }

    cerrarMenu();
    return; // 🔴 bloquea toda acción
  }

  // comportamiento normal (otros juegos)
  document.body.classList.toggle("header-hidden");

  actualizarBotonTitulos();
  leerBoton(mobileToggleHeaderBtn);
  cerrarMenu();

});

/* ================= TOGGLE LECTURA ================= */

mobileReadBtn.addEventListener("click", () => {

  if (typeof toggleLectura === "function") {
    toggleLectura();
  }

  actualizarBotonLectura();
  leerBoton(mobileReadBtn);
  cerrarMenu();

});


/* ================= PANEL (CICLO CONTROLADO) ================= */

mobilePanelBtn.addEventListener("click", () => {

  document.body.classList.remove("panel-full", "panel-mini", "panel-hidden");

  panelState++;
  if (panelState > 2) panelState = 0;

  if (panelState === 0) {
    document.body.classList.add("panel-full");
  }

  if (panelState === 1) {
    document.body.classList.add("panel-mini");
  }

  if (panelState === 2) {
    document.body.classList.add("panel-hidden");
  }

  actualizarBotonPanel();
  leerBoton(mobilePanelBtn);
  cerrarMenu();

});


/* ================= ESTADO INICIAL ================= */

document.body.classList.add("panel-full");

actualizarBotonPanel();
actualizarBotonTitulos();
actualizarBotonLectura();
