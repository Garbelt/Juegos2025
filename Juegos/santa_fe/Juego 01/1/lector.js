// ==============================
// 📘 lector.js — Lector universal para juegos educativos
// ==============================

let lecturaActiva = true;
let leyendoAhora = false;
const synth = window.speechSynthesis;

// ==============================
// ⚙️ Configuración del lector
// ==============================

const CONFIG_LECTOR = {

    // 🔘 Leer botones deshabilitados
    leerBotonesDeshabilitados: false,

    // 🖼️ IDs de imágenes que NO deben leerse
    imagenesIgnoradas: [
        // "mapa-img"
    ],

    // 🔘 IDs de botones que NUNCA deben leerse
    botonesIgnorados: [
        "start-button"
    ],

    // 🔘 IDs de botones que SIEMPRE deben leerse
    // aunque estén deshabilitados
    botonesSiempreLeidos: [
        "lectorButton"
    ]
};

// ==============================

// ✍️ Convertir MAYÚSCULAS a formato normal
function normalizarTextoLectura(texto) {
    return texto
        .toLowerCase()
        .replace(/\b\w/g, letra =>
            letra.toUpperCase()
        );
}

// 🔊 Hablar texto específico (con callback opcional)
function hablar(texto, opciones = {}) {

    const forzarLectura =
        opciones.forzarLectura || false;

    // 🔊 Si la lectura está apagada,
    // solo permitir si está forzada
    if (
        (!lecturaActiva && !forzarLectura) ||
        !texto
    ) return;

    if (leyendoAhora) return;

    leyendoAhora = true;

    texto = normalizarTextoLectura(texto);

    const utterance =
        new SpeechSynthesisUtterance(texto);

    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {

        setTimeout(() => {

            if (
                opciones.bloquearBotones
            ) {
                setBotonesEstado(true);
            }

            if (
                typeof opciones.onStart
                === "function"
            ) {
                opciones.onStart();
            }

        }, 80);

    };

    utterance.onend = () => {

        leyendoAhora = false;

        if (
            opciones.bloquearBotones
        ) {
            setBotonesEstado(false);
        }

        if (
            typeof opciones.onEnd
            === "function"
        ) {
            opciones.onEnd();
        }
    };

    utterance.onerror = () => {

        leyendoAhora = false;

        if (
            opciones.bloquearBotones
        ) {
            setBotonesEstado(false);
        }
    };

    synth.cancel();
    synth.speak(utterance);
}

// 🎚️ Alternar lectura ON/OFF
function toggleLectura() {
    lecturaActiva = !lecturaActiva;
    const estado = lecturaActiva ? "activada" : "desactivada";
    hablar(`Lectura ${estado}`);
}

// 🔒 Bloquear / desbloquear botones (uso opcional)
function setBotonesEstado(estado) {
    const botones = document.querySelectorAll("button:not(.lectorButton)");
    botones.forEach(btn => {
        btn.disabled = estado;
        btn.style.pointerEvents = estado ? "none" : "auto";
        btn.style.opacity = estado ? "0.6" : "1";
    });
}

// 📦 Leer contenido por ID
function leerElemento(id, opciones = {}) {
    const el = document.getElementById(id);
    if (el) {
        const texto = el.textContent.trim() || el.alt || el.value || "";
        hablar(texto, opciones);
    }
}

// 🎯 Leer botones al pasar el mouse
function leerBotones() {

    const botones =
        document.querySelectorAll(
            "button, .btn, .btn-corregir"
        );

    botones.forEach(boton => {

        boton.addEventListener(
            "mouseenter",
            () => {

                const id = boton.id;

                // 🚫 Nunca leer ciertos botones
                if (
                    CONFIG_LECTOR
                        .botonesIgnorados
                        .includes(id)
                ) {
                    return;
                }

                // 🚫 No leer botones deshabilitados
                // excepto los forzados
                const esSiempreLeido =
                    CONFIG_LECTOR
                        .botonesSiempreLeidos
                        .includes(id);

                if (
                    boton.disabled &&
                    !CONFIG_LECTOR
                        .leerBotonesDeshabilitados &&
                    !esSiempreLeido
                ) {
                    return;
                }

                // Prioridad 1: aria-label
                const aria =
                    boton.getAttribute(
                        "aria-label"
                    );

                // Prioridad 2: texto visible
                const texto =
                    boton.textContent.trim();

                if (aria) {
                    hablar(aria, {
                        forzarLectura: esSiempreLeido
                    });
                }
                else if (texto) {
                    hablar(texto, {
                        forzarLectura: esSiempreLeido
                    });
                }
            }
        );

    });

}

// 📷 Leer imágenes
function leerImagenes() {

    const imagenes =
        document.querySelectorAll("img");

    imagenes.forEach(img => {

        // 🚫 Ignorar imágenes específicas
        if (
            CONFIG_LECTOR
                .imagenesIgnoradas
                .includes(img.id)
        ) {
            return;
        }

        img.addEventListener(
            "mouseenter",
            () => {

                const nombre =
                    img.alt ||
                    img.getAttribute(
                        "data-name"
                    ) ||
                    "imagen";

                hablar(nombre);
            }
        );

    });

}

// 🏷️ Leer elementos del juego
function leerElementosDelJuego() {
    const elementosJuego = document.querySelectorAll(".elemento-juego");
    elementosJuego.forEach(el => {
        el.addEventListener("click", () => {
            let texto = "";

            const img = el.querySelector("img");
            if (img) {
                texto = img.alt || img.getAttribute("data-name") || "";
            } else {
                texto = el.textContent.trim();
            }

            if (texto) hablar(texto);
        });
    });
}

// 🧠 Inicializar lector
function inicializarLector() {
    leerBotones();
    leerImagenes();
    leerElementosDelJuego();
    console.log("🔊 Lector universal activado.");
}

// 🎚️ Crear botón flotante universal
function crearBotonLector() {
    const boton = document.createElement("button");
    boton.textContent = "🔊 LECTOR ON/OFF";
    boton.className = "lectorButton";
    boton.addEventListener("click", toggleLectura);
    document.body.appendChild(boton);
}

// 🧩 Inicialización automática
window.addEventListener("DOMContentLoaded", () => {
    inicializarLector();

    const botonManual = document.getElementById("lectorButton");
    if (botonManual) {
        botonManual.addEventListener("click", () => {
            toggleLectura();
            botonManual.textContent = lecturaActiva
                ? "Cancelar Lectura"
                : "Activar Lectura";
        });
    } else {
        crearBotonLector();
    }
});