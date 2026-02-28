function evaluarLayoutAdaptativo() {
    if (!document.body.classList.contains("panel-adaptativo")) return;

    const contenedor = document.querySelector(".container");
    if (!contenedor) return;

    const anchoReal = contenedor.offsetWidth;

    const esVertical = window.innerHeight > window.innerWidth;

    const anchoCritico = 850;

    if (esVertical && anchoReal < anchoCritico) {
        document.body.classList.add("panel-below");
        activarLayoutVertical();
    } else {
        document.body.classList.remove("panel-below");
        desactivarLayoutVertical();
    }
}

// ===== Funciones para mostrar/ocultar layouts =====
function activarLayoutVertical() {
    const layoutVertical = document.querySelector('.layout-vertical');
    const layoutHorizontal = document.querySelector('.layout-horizontal');
    if (!layoutVertical || !layoutHorizontal) return;

    layoutVertical.style.display = 'table';
    layoutHorizontal.style.display = 'none';
}

function desactivarLayoutVertical() {
    const layoutVertical = document.querySelector('.layout-vertical');
    const layoutHorizontal = document.querySelector('.layout-horizontal');
    if (!layoutVertical || !layoutHorizontal) return;

    layoutVertical.style.display = 'none';
    layoutHorizontal.style.display = 'table';
}

// ===== PASO 3 — Mover nodos (solo una vez) =====
function prepararLayoutVertical() {
    const layoutVertical = document.querySelector('.layout-vertical');
    if (!layoutVertical) return;

    const thTitulos = document.querySelector('.layout-horizontal th.title-cell');
    const tdJuego = document.querySelector('.layout-horizontal td:first-child');
    const tdPanel = document.querySelector('.layout-horizontal td.celda-panel');

    const celdaTitulosVertical = layoutVertical.querySelector('.celda-titulos-vertical');
    const celdaJuegoVertical = layoutVertical.querySelector('.celda-juego-vertical');
    const celdaPanelVertical = layoutVertical.querySelector('.celda-panel-vertical');

    if (thTitulos && celdaTitulosVertical) celdaTitulosVertical.appendChild(thTitulos);
    if (tdJuego && celdaJuegoVertical) celdaJuegoVertical.appendChild(tdJuego);
    if (tdPanel && celdaPanelVertical) celdaPanelVertical.appendChild(tdPanel);
}

// ===== Eventos =====
window.addEventListener('load', () => {
    prepararLayoutVertical();
    evaluarLayoutAdaptativo();
});
window.addEventListener('resize', evaluarLayoutAdaptativo);
window.addEventListener('orientationchange', evaluarLayoutAdaptativo);