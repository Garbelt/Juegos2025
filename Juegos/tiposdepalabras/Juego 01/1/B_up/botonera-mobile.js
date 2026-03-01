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
  const texto = btn.getAttribute("aria-label");
  if (texto && typeof hablar === "function") {
    hablar(texto);
  }
}

function cerrarMenu() {
  mobileControls.classList.remove("open");
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

  if (document.body.classList.contains("header-hidden")) {
    mobileToggleHeaderBtn.setAttribute("aria-label", "Mostrar títulos");
  } else {
    mobileToggleHeaderBtn.setAttribute("aria-label", "Ocultar títulos");
  }
}

function actualizarBotonLectura() {

  if (typeof lecturaActiva !== "undefined" && lecturaActiva) {
    mobileReadBtn.setAttribute("aria-label", "Cancelar lectura");
  } else {
    mobileReadBtn.setAttribute("aria-label", "Activar lectura");
  }
}


/* ================= BOTÓN PRINCIPAL ================= */

mainBtn.addEventListener("click", () => {

  mobileControls.classList.toggle("open");
  leerBoton(mainBtn);

  if (mobileControls.classList.contains("open")) {

    clearTimeout(autoCloseTimeout);

    autoCloseTimeout = setTimeout(() => {
      mobileControls.classList.remove("open");
    }, 5000);

  }

});

/* ================= TOGGLE TÍTULOS ================= */

mobileToggleHeaderBtn.addEventListener("click", () => {

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