// ==============================
// 🎬 Pantalla de inicio y previa
// ==============================

// Mostrar pantalla previa
document.getElementById("start-button").addEventListener("click", function () {
    if (this.classList.contains("disable-clicks")) return;

    document.getElementById("start-button-container").style.display = "none";
    document.getElementById("pre-game-screen").style.display = "flex";

    const titulo = document.getElementById("game-title");

    // 🔊 Leer título
    leerElemento("game-title");

    // ✨ Activar brillo
    titulo.classList.add("brillo-activo");
    setTimeout(() => {
        titulo.classList.remove("brillo-activo");
    }, 2000);
});


// ==============================
// 🎛️ Botones de la pantalla previa
// ==============================

// ▶ Referencias
const verVideoBtn = document.getElementById("ver-video-btn");
const modal = document.getElementById("video-modal");
const video = document.getElementById("pre-game-video");
const cerrarBtn = document.getElementById("close-video");

// ▶ Abrir video
verVideoBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    video.currentTime = 0;
    video.play();

    setBotonesEstado(true);

    document.getElementById("game-title")
        .classList.add("texto-aclarado");

    document.getElementById("game-description")
        .classList.add("texto-aclarado");
});

// ▶ Función única y centralizada de cierre
function cerrarVideo() {
    video.pause();
    video.currentTime = 0;
    modal.style.display = "none";

    setBotonesEstado(false);

    document.getElementById("game-title")
        .classList.remove("texto-aclarado");

    document.getElementById("game-description")
        .classList.remove("texto-aclarado");
}

// ▶ Botón X de cerrar
if (cerrarBtn) {
    cerrarBtn.addEventListener("click", () => {
        cerrarVideo();
        hablar("Video cerrado");
    });
}

// ▶ Click fuera del contenido
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        cerrarVideo();
    }
});


// 🔊 Leer pantalla completa (bloquea solo durante la lectura)
document.getElementById("read-screen").addEventListener("click", () => {

    const descripcion = document
        .getElementById("game-description")
        .textContent.trim();

    const titulo = document.getElementById("game-title");

    hablar(descripcion, {
        bloquearBotones: true,

        onStart: () => {
            titulo.classList.add("texto-aclarado");
        },

        onEnd: () => {
            titulo.classList.remove("texto-aclarado");
        }
    });

});

// ==============================
// ▶️ Botón continuar
// ==============================

document.getElementById("continuar-btn").addEventListener("click", () => {

    document.getElementById("pre-game-screen").style.display = "none";
    document.querySelector(".container").style.display = "block";

    const musica = document.getElementById("background-music");
    if (musica) musica.play();

    showNextInstrument(); // Muestra primer elemento
    hablar("Comienza el juego");

    startGame();
});