// =============================
// 🔹 ESTADO INICIAL
// =============================
document.body.classList.remove("game-started");

let endGameExecuted = false;
let clicksEnabled = true;

let score = 0;
let totalTimeInSeconds = 60;
let errors = 0;
let timerInterval;

// 🎰 Juego
let num1 = null;
let num2 = null;
let resultadoCorrecto = null;
let giroEnCurso = false;
let esperandoRespuesta = false;

// 🎰 Datos
const numeros = Array.from({ length: 10 }, (_, i) => i + 1);

// 🎯 Elementos
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const girarBtn = document.getElementById("girar-btn");
const corregirBtn = document.getElementById("corregir-btn");
const input = document.getElementById("respuesta");
input.setAttribute("readonly", true);
const container = document.querySelector(".container");


function posicionInicial() {
    const destino1 = Math.floor(Math.random() * numeros.length);
    const destino2 = Math.floor(Math.random() * numeros.length);

    // Inicializar contenido (IMPORTANTE)
    inicializarReel(reel1);
    inicializarReel(reel2);

    // Sin animación
    reel1.style.transition = "none";
    reel2.style.transition = "none";

    reel1.style.transform = `translateY(-${destino1 * 100}px)`;
    reel2.style.transform = `translateY(-${destino2 * 100}px)`;

    // Opcional: guardar valores visibles
    num1 = numeros[destino1];
    num2 = numeros[destino2];
    resultadoCorrecto = num1 * num2;
}


// =============================
// 🎹 TECLADO PERSONALIZADO
// =============================
function crearTeclado(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    const teclas = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        ["",0,"borrar"]
    ];

    const keyboard = document.createElement("div");
    keyboard.className = "keyboard";

    teclas.flat().forEach(valor => {
        const btn = document.createElement("button");

        // 🔹 espacio vacío
        if (valor === "") {
            btn.style.visibility = "hidden";
            btn.disabled = true;
        }

        // 🔹 botón borrar
        else if (valor === "borrar") {
            btn.textContent = "←";

            btn.addEventListener("click", () => {
                if (!esperandoRespuesta) return;

                input.value = input.value.slice(0, -1);
                corregirBtn.disabled = input.value === "";
            });
        }

        // 🔹 números
        else {
            btn.textContent = valor;

            btn.addEventListener("click", () => {
                if (!esperandoRespuesta) return;

                if (input.value.length >= 3) return;

                input.value += valor;

                corregirBtn.disabled = input.value === "";
            });
        }

        keyboard.appendChild(btn);
    });

    container.appendChild(keyboard);
}


// =============================
// 🔹 START GAME
// =============================
function startGame() {
    endGameExecuted = false;
    totalTimeInSeconds = 90;
    errors = 0;
    score = 0;

    updateScoreDisplay(score);
    updateErrorsDisplay();
    updateTimerDisplay(totalTimeInSeconds);

    input.disabled = true;
    corregirBtn.disabled = true;

    startTimer();
    posicionInicial();
    crearTeclado("keyboard-cell");
    crearTeclado("keyboard-vertical");
}

// =============================
// 🔹 CARRETE
// =============================
function inicializarReel(reel) {
    reel.innerHTML = "";

    for (let i = 0; i < numeros.length * 10; i++) {
        const div = document.createElement("div");
        div.className = "digit";
        div.textContent = numeros[i % numeros.length];
        reel.appendChild(div);
    }
}

// =============================
// 🔹 GIRAR
// =============================
function girar() {
    if (!clicksEnabled || giroEnCurso || endGameExecuted) return;

    giroEnCurso = true;
    esperandoRespuesta = false;

    girarBtn.disabled = true;
    input.disabled = true;

    corregirBtn.disabled = true;
    input.placeholder = "";

    container.classList.add("disable-clicks");

    inicializarReel(reel1);
    inicializarReel(reel2);

    const destino1 = Math.floor(Math.random() * numeros.length);
    const destino2 = Math.floor(Math.random() * numeros.length);

    const vueltas1 = Math.floor(Math.random() * 5) + 5;
    const vueltas2 = Math.floor(Math.random() * 5) + 5;

    const totalMov1 = vueltas1 * numeros.length + destino1;
    const totalMov2 = vueltas2 * numeros.length + destino2;

    reel1.style.transition = `transform ${totalMov1 * 0.05}s ease-out`;
    reel1.style.transform = `translateY(-${totalMov1 * 100}px)`;

    reel2.style.transition = `transform ${totalMov2 * 0.05}s ease-out`;
    reel2.style.transform = `translateY(-${totalMov2 * 100}px)`;

    setTimeout(() => {

        num1 = numeros[destino1];
        num2 = numeros[destino2];
        resultadoCorrecto = num1 * num2;

        reel1.style.transition = "none";
        reel2.style.transition = "none";

        reel1.style.transform = `translateY(-${destino1 * 100}px)`;
        reel2.style.transform = `translateY(-${destino2 * 100}px)`;

        giroEnCurso = false;
        esperandoRespuesta = true;

        container.classList.remove("disable-clicks");

        input.disabled = false;
        input.focus();
        corregirBtn.disabled = true;
        input.placeholder = `${num1} × ${num2}`;

    }, Math.max(totalMov1, totalMov2) * 50 + 100);
}

// =============================
// 🔹 VALIDACIÓN INPUT
// =============================
function validarRespuesta() {
    if (!esperandoRespuesta) return;
    const valor = parseInt(input.value);
    if (valor === resultadoCorrecto) {
        showMessage('CORRECTO', 'correct');
        score += 20;
        updateScoreDisplay(score);
    } else {
        showMessage('ERROR', 'error');
        errors++;
        updateErrorsDisplay();
        if (errors >= 5) {
            endGame();
            return;
        }
    }
    input.value = "";
    input.disabled = true;
    corregirBtn.disabled = true;
    esperandoRespuesta = false;
    input.placeholder = "";
    girarBtn.disabled = false;
}

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        validarRespuesta();
    }
});

// =============================
// 🔹 TIMER
// =============================
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        updateTimerDisplay(totalTimeInSeconds);

        if (totalTimeInSeconds <= 0 || errors >= 5) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    document.getElementById("reloj").textContent =
        `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function updateErrorsDisplay() {
    document.getElementById("errores").textContent = `${errors}/5`;
}

function updateScoreDisplay(score) {
    document.getElementById("puntaje").textContent = score;
}

// =============================
// 🔹 END GAME (REUTILIZADO)
// =============================
function endGame() {
    if (!endGameExecuted) {
        endGameExecuted = true;

        clearInterval(timerInterval);

        if (errors < 5 && totalTimeInSeconds > 0) {
            score += (5 - errors) * totalTimeInSeconds;
        }

        updateScoreDisplay(score);
        saveGameScore();

        showMessage('Fin del Juego', 'fin');

        setTimeout(() => showMessageWithDelay(), 3000);
    }
}

// =============================
// 🔹 MENSAJES (REUTILIZADO)
// =============================
function showMessageWithDelay() {
    const storedScore = JSON.parse(localStorage.getItem("gamesHistory")).pop().puntaje;
    showMessage(`Puntaje obtenido: ${storedScore}`, 'puntaje');

    fadeOutBackgroundMusic(6);

    setTimeout(() => {
        window.location.href = "out.html";
    }, 7000);
}

function showMessage(text, type) {
    clicksEnabled = false;

    const messageElement = document.getElementById("message");
    messageElement.textContent = text;
    messageElement.className = `found-message ${type}`;

    messageElement.style.display = "block";

    const sound = {
        correct: 'sound/correcto.mp3',
        error: 'sound/error.mp3',
        fin: 'sound/Fin del Juego.mp3'
    }[type];

    if (sound && type !== 'puntaje') {
        new Audio(sound).play();
    }

    const duration = { fin: 2000, puntaje: 6000 }[type] || 1000;

    setTimeout(() => {
        messageElement.style.display = "none";

        if (!endGameExecuted) clicksEnabled = true;

    }, duration);
}

// =============================
// 🔹 AUDIO
// =============================
function fadeOutBackgroundMusic(duration) {
    const audio = document.getElementById("background-music");
    const initialVolume = audio.volume;

    const fadeOutInterval = setInterval(() => {
        audio.volume -= initialVolume / (duration * 10);

        if (audio.volume <= 0) {
            clearInterval(fadeOutInterval);
            audio.pause();
            audio.volume = initialVolume;
        }
    }, 100);
}

// =============================
// 🔹 STORAGE + FIREBASE (REUTILIZADO)
// =============================
function saveGameScore() {
    const usuario = localStorage.getItem("ActualUs") || "desconocido";
    const currentDate = new Date().toLocaleDateString();

    const gameData = {
        fecha: currentDate,
        usuario: usuario,
        puntaje: score,
        juegonumero: incrementGameNumber(),
        game: "OPER_multip01",
        acumulado: parseInt(localStorage.getItem("acumulado")) || 0,
        rutina: localStorage.getItem("rutina")
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    updateAcumulado(score);

    saveGameResultToFirebase(score, "OPER_multip01", "Multiplicaciones con Carreteles", usuario);
}

function saveGameResultToFirebase(puntaje, gameCode, gameTitle, usuario) {
    const fecha = new Date().toLocaleDateString("es-ES");

    const newGameRef = firebase.database().ref("games").push();
    newGameRef.set({
        fecha: fecha,
        game: gameCode,
        puntaje: puntaje,
        title: gameTitle,
        usuario: usuario
    });
}

function updateAcumulado(scoreToAdd) {
    let acumulado = parseInt(localStorage.getItem("acumulado")) || 0;
    acumulado += scoreToAdd;
    localStorage.setItem("acumulado", acumulado);
}

function incrementGameNumber() {
    let gameNumber = parseInt(localStorage.getItem("gameNumber")) || 0;
    gameNumber++;
    localStorage.setItem("gameNumber", gameNumber);
    return gameNumber;
}

// =============================
// 🔹 EVENTOS
// =============================
girarBtn.addEventListener("click", girar);
corregirBtn.addEventListener("click", validarRespuesta);

window.addEventListener("load", function() {
    const actualUsername = localStorage.getItem("ActualUs");
    document.getElementById("actualUsername").textContent = actualUsername;
});

input.addEventListener("input", function() {
    if (!esperandoRespuesta) return;
    const valor = parseInt(input.value);
    corregirBtn.disabled = isNaN(valor);
});