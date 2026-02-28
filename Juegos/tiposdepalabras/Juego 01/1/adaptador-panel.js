// ==========================
// ADAPTACIÓN DE PANEL (HORIZONTAL / VERTICAL)
// ==========================

function adaptarPanel() {
    const containerDesktop = document.querySelector(".container");
    const containerVertical = document.querySelector(".container-vertical");

    // Detectar orientación real
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
        // Mostrar solo la versión vertical
        if (containerDesktop) containerDesktop.style.display = "none";
        if (containerVertical) containerVertical.style.display = "block";

        actualizarElementosPanel(true);

    } else {
        // Mostrar la versión horizontal/escritorio
        if (containerDesktop) containerDesktop.style.display = "block";
        if (containerVertical) containerVertical.style.display = "none";

        actualizarElementosPanel(false);
    }
}

// ==========================
// ASIGNAR ELEMENTOS SEGÚN ORIENTACIÓN
// ==========================
function actualizarElementosPanel(esVertical) {
    if (esVertical) {
        window.instrumentElement = document.getElementById("instrument-vertical");
        window.btnSustantivo = document.getElementById("sustantivo-button-vertical");
        window.btnVerbo = document.getElementById("verbo-button-vertical");
        window.btnAdjetivo = document.getElementById("adjetivo-button-vertical");
        window.puntajeElement = document.getElementById("puntaje-vertical");
        window.erroresElement = document.getElementById("errores-vertical");
        window.usuarioElement = document.getElementById("actualUsername-vertical");
        window.relojElement = document.getElementById("reloj-vertical");
    } else {
        window.instrumentElement = document.getElementById("instrument");
        window.btnSustantivo = document.getElementById("sustantivo-button");
        window.btnVerbo = document.getElementById("verbo-button");
        window.btnAdjetivo = document.getElementById("adjetivo-button");
        window.puntajeElement = document.getElementById("puntaje");
        window.erroresElement = document.getElementById("errores");
        window.usuarioElement = document.getElementById("actualUsername");
        window.relojElement = document.getElementById("reloj");
    }
}

// ==========================
// REASIGNAR EVENTOS DE BOTONES
// ==========================
function reasignarEventos() {
    if (!window.btnSustantivo || !window.btnVerbo || !window.btnAdjetivo) return;

    // Clonar para eliminar listeners anteriores
    window.btnSustantivo.replaceWith(window.btnSustantivo.cloneNode(true));
    window.btnVerbo.replaceWith(window.btnVerbo.cloneNode(true));
    window.btnAdjetivo.replaceWith(window.btnAdjetivo.cloneNode(true));

    // Reasignar referencias
    const esVertical = window.innerWidth <= 1023 && window.innerHeight > window.innerWidth;
    actualizarElementosPanel(esVertical);

    // Agregar eventos
    window.btnSustantivo.addEventListener("click", () => checkAnswer("SUSTANTIVO"));
    window.btnVerbo.addEventListener("click", () => checkAnswer("VERBO"));
    window.btnAdjetivo.addEventListener("click", () => checkAnswer("ADJETIVO"));
}

// ==========================
// LLAMADAS SOLO AL INICIAR EL JUEGO
// ==========================
document.getElementById("continuar-btn").addEventListener("click", () => {

    document.getElementById("pre-game-screen").style.display = "none";

    // Mostrar contenedor principal según orientación
    adaptarPanel();

    // Reasignar eventos de botones
    reasignarEventos();

    // Música y comienzo de juego
    const musica = document.getElementById("background-music");
    if (musica) musica.play();

    startGame();
});

// ==========================
// AJUSTES DINÁMICOS AL CAMBIAR TAMAÑO / ORIENTACIÓN
// ==========================
window.addEventListener("resize", () => {
    // Solo si el juego ya empezó
    if (!document.querySelector(".container").style.display.includes("none") ||
        !document.querySelector(".container-vertical").style.display.includes("none")) {
        adaptarPanel();
        reasignarEventos();
    }
});