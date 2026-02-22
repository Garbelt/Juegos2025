// ==============================
// 📘 lector.js — Lector universal para juegos educativos
// ==============================

let lecturaActiva = true;
let leyendoAhora = false;
const synth = window.speechSynthesis;

// 🔊 Hablar texto específico (con callback opcional)
function hablar(texto, opciones = {}) {
    if (!lecturaActiva || !texto) return;
    if (leyendoAhora) return;

    leyendoAhora = true;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // ✅ Cuando REALMENTE empieza a hablar
    utterance.onstart = () => {

        if (opciones.bloquearBotones) {
            setBotonesEstado(true);
        }

        if (typeof opciones.onStart === "function") {
            opciones.onStart();
        }
    };

    // ✅ Cuando termina
    utterance.onend = () => {
        leyendoAhora = false;

        if (opciones.bloquearBotones) {
            setBotonesEstado(false);
        }

        if (typeof opciones.onEnd === "function") {
            opciones.onEnd();
        }
    };

    utterance.onerror = () => {
        leyendoAhora = false;

        if (opciones.bloquearBotones) {
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
    const botones = document.querySelectorAll("button, .btn, .btn-corregir");
    botones.forEach(boton => {
        boton.addEventListener("mouseenter", () => {
            hablar(boton.textContent.trim());
        });
    });
}

// 📷 Leer imágenes
function leerImagenes() {
    const imagenes = document.querySelectorAll("img");
    imagenes.forEach(img => {
        img.addEventListener("mouseenter", () => {
            const nombre = img.alt || img.getAttribute("data-name") || "imagen";
            hablar(nombre);
        });
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