// ==============================
// 📘 lector.js — Lector universal mejorado para juegos educativos
// ==============================

let lecturaActiva = true;
const synth = window.speechSynthesis;

// 🔊 Hablar texto específico
function hablar(texto) {
    if (!lecturaActiva || !texto) return;

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.rate = 0.9; // velocidad moderada
    utterance.pitch = 1;  // tono natural

    synth.cancel(); // Detener cualquier lectura anterior
    synth.speak(utterance);
}

// 🎚️ Alternar lectura ON/OFF
function toggleLectura() {
    lecturaActiva = !lecturaActiva;
    const estado = lecturaActiva ? "activada" : "desactivada";
    hablar(`Lectura ${estado}`);
}

// 📦 Leer el contenido de un elemento por su ID o clase
function leerElemento(id) {
    const el = document.getElementById(id);
    if (el) {
        const texto = el.textContent.trim() || el.alt || el.value || "";
        hablar(texto);
    }
}

// 🎯 Hacer que todos los botones hablen al pasar el mouse
function leerBotones() {
    const botones = document.querySelectorAll("button, .btn, .btn-corregir");
    botones.forEach(boton => {
        boton.addEventListener("mouseenter", () => hablar(boton.textContent.trim()));
    });
}

// 📷 Leer imágenes (usando atributo alt o data-name)
function leerImagenes() {
    const imagenes = document.querySelectorAll("img");
    imagenes.forEach(img => {
        img.addEventListener("mouseenter", () => {
            const nombre = img.alt || img.getAttribute("data-name") || "imagen";
            hablar(nombre);
        });
    });
}

// 🏷️ Leer elementos del juego (instrumento o palabra a clasificar)
function leerElementosDelJuego() {
    const elementosJuego = document.querySelectorAll(".elemento-juego"); // todos los elementos de juego
    elementosJuego.forEach(el => {
        el.addEventListener("click", () => {
            let texto = "";

            // Si hay una imagen dentro
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


// 🧠 Función rápida para inicializar el lector en cualquier juego
function inicializarLector() {
    leerBotones();
    leerImagenes();
    leerElementosDelJuego(); // 👈 solo lectura de elementos del juego
    console.log("🔊 Lector activado y listo.");
}

// 🎚️ Crear un botón flotante universal para activar/desactivar lectura
function crearBotonLector() {
    const boton = document.createElement("button");
    boton.textContent = "🔊 LECTOR ON/OFF";
    boton.className = "lectorButton";
    boton.addEventListener("click", toggleLectura);
    document.body.appendChild(boton);
}

// 🧩 Inicializar automáticamente cuando carga la página
window.addEventListener("DOMContentLoaded", () => {
    inicializarLector();

    // Si existe un botón manual con id="lectorButton", usarlo
    const botonManual = document.getElementById("lectorButton");
    if (botonManual) {
        botonManual.addEventListener("click", () => {
            toggleLectura();
            botonManual.textContent = lecturaActiva ? "Cancelar Lectura" : "Activar Lectura";
        });
    } else {
        // Si no existe, crear el botón flotante
        crearBotonLector();
    }
});
