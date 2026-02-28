// ================= ADAPTADOR DE PANEL SEGÚN ORIENTACIÓN =================

function adaptarPanel() {
    const isMobile = window.innerWidth <= 1023;
    const isPortrait = isMobile && window.innerHeight > window.innerWidth;
    const containerDesktop = document.querySelector(".container");
    const containerVertical = document.querySelector(".container-vertical");

    if (isPortrait) {
        // Móvil vertical: mostrar tabla vertical
        if(containerDesktop) containerDesktop.style.display = "none";
        if(containerVertical) containerVertical.style.display = "block";

        // Clonar o reasignar el instrumento actual y panel
        actualizarElementosPanel(true);

    } else {
        // Escritorio o móvil horizontal: mostrar tabla original
        if(containerDesktop) containerDesktop.style.display = "block";
        if(containerVertical) containerVertical.style.display = "none";

        actualizarElementosPanel(false);
    }
}

// Función que asigna los IDs de elementos a usar según orientación
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

// ===== Detectar cambio de orientación y tamaño =====
window.addEventListener("load", adaptarPanel);
window.addEventListener("resize", adaptarPanel);

// ===== Reasignar eventos de botones =====
function reasignarEventos() {
    if (!window.btnSustantivo || !window.btnVerbo || !window.btnAdjetivo) return;

    // Limpiar eventos antiguos
    window.btnSustantivo.replaceWith(window.btnSustantivo.cloneNode(true));
    window.btnVerbo.replaceWith(window.btnVerbo.cloneNode(true));
    window.btnAdjetivo.replaceWith(window.btnAdjetivo.cloneNode(true));

    // Reasignar referencias
    actualizarElementosPanel(window.innerWidth <= 1023 && window.innerHeight > window.innerWidth);

    // Eventos
    window.btnSustantivo.addEventListener("click", () => checkAnswer("SUSTANTIVO"));
    window.btnVerbo.addEventListener("click", () => checkAnswer("VERBO"));
    window.btnAdjetivo.addEventListener("click", () => checkAnswer("ADJETIVO"));
}

// Ejecutar después de adaptar panel
window.addEventListener("load", reasignarEventos);
window.addEventListener("resize", reasignarEventos);