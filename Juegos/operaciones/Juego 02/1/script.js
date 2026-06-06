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
let giroTimeout = null;

// 🎰 Datos
const numerosReel1 = [1,2,3,4,5,6,7,8,9,10];
const numerosReel2 = [1,2,3,4,5,6,7,8,9,10];
const reel2EsFijo = numerosReel2.length === 1;


// 🎯 Elementos
const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const girarBtn = document.getElementById("girar-btn");
const corregirBtn = document.getElementById("corregir-btn");
const input = document.getElementById("respuesta");
const container = document.querySelector(".container");

function esMobile() {
  return window.innerWidth <= 1023;
}

function configurarInput() {
  if (esMobile()) {
    input.setAttribute("readonly", true);
    input.setAttribute("inputmode", "none");
  } else {
    input.removeAttribute("readonly");
    input.setAttribute("inputmode", "numeric");
  }
}

function posicionInicial() {
    const destino1 = Math.floor(Math.random() * numerosReel1.length);
    const destino2 = Math.floor(Math.random() * numerosReel2.length);

    inicializarReel(reel1, numerosReel1);
    inicializarReel(reel2, numerosReel2);

    reel1.style.transition = "none";
    reel2.style.transition = "none";

    reel1.style.transform = `translateY(-${destino1 * 100}px)`;
    reel2.style.transform = `translateY(-${destino2 * 100}px)`;

    num1 = numerosReel1[destino1];
    num2 = numerosReel2[destino2];
    resultadoCorrecto = num1 * num2;
}

// =============================
// 🎹 TECLADO PERSONALIZADO
// =============================
function crearTeclado(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    // 🔥 detectar orientación
    const esVertical = window.innerHeight > window.innerWidth;
    let teclas;
    if (esVertical) {
        // 📱 VERTICAL
        teclas = [
            [1,2,3,4],
            [5,6,7,8],
            [9,0,"borrar",""]
        ];
    } else {
        // 📱 HORIZONTAL
        teclas = [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [0,"borrar",""]
        ];
    }
    // 🔹 contenedor visual (marco)
    const wrapper = document.createElement("div");
    wrapper.className = "keyboard-wrapper";
    // 🔹 teclado
    const keyboard = document.createElement("div");
    keyboard.className = "keyboard";
    // 🔥 columnas dinámicas
    keyboard.style.gridTemplateColumns = `repeat(${teclas[0].length}, 45px)`;
    teclas.forEach(fila => {
        fila.forEach((valor) => {
            // 🔹 espacio vacío
            if (valor === "") {
                const btn = document.createElement("button");
                btn.style.visibility = "hidden";
                btn.disabled = true;
                keyboard.appendChild(btn);
                return;
            }
            // 🔹 borrar
            if (valor === "borrar") {
                const btn = document.createElement("button");
                btn.textContent = "←";
                btn.classList.add("key-borrar");
                btn.addEventListener("click", () => {
                    if (!esperandoRespuesta) return;
                    input.value = input.value.slice(0, -1);
                    corregirBtn.disabled = input.value === "";
                });
                keyboard.appendChild(btn);
                return;
            }
            // 🔹 números
            const btn = document.createElement("button");
            btn.textContent = valor;
            btn.addEventListener("click", () => {
                if (!esperandoRespuesta || endGameExecuted) return;
                if (input.value.length >= 3) return;

                input.value += valor;
                corregirBtn.disabled = input.value === "";
            });
            keyboard.appendChild(btn);
        });
    });
    // 🔥 ensamblado final
    wrapper.appendChild(keyboard);
    container.appendChild(wrapper);
}

window.addEventListener("resize", () => {
    crearTeclado("keyboard-cell");
    crearTeclado("keyboard-vertical");
});

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
function inicializarReel(reel, lista) {
    reel.innerHTML = "";

    for (let i = 0; i < lista.length * 10; i++) {
        const div = document.createElement("div");
        div.className = "digit";
        div.textContent = lista[i % lista.length];
        reel.appendChild(div);
    }
}


function generarDivision() {
    const divisor = numerosReel2[Math.floor(Math.random() * numerosReel2.length)];
    const cociente = Math.floor(Math.random() * 10) + 1; // 1 a 10
    const dividendo = divisor * cociente;
    return {
        num1: dividendo,
        num2: divisor,
        resultado: cociente
    };
}

function generarMultiplos(divisor) {
    const lista = [];
    for (let i = 1; i <= 10; i++) {
        lista.push(divisor * i);
    }
    return lista;
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

    // 🔵 REEL1 siempre gira base
    inicializarReel(reel1, numerosReel1);

    const vueltas1 = 10;
    const totalMov1 = vueltas1 * numerosReel1.length;

    let destino2 = 0;
    let divisor = numerosReel2[0];

    // =========================
    // 🟡 CASO NORMAL (reel2 dinámico)
    // =========================
    if (!reel2EsFijo) {

        inicializarReel(reel2, numerosReel2);

        destino2 = Math.floor(Math.random() * numerosReel2.length);
        divisor = numerosReel2[destino2];

        const vueltas2 = Math.max(3, Math.round(20 / numerosReel2.length));
        const totalMov2 = vueltas2 * numerosReel2.length + destino2;

        reel2.style.transition = `transform ${totalMov2 * 50}ms ease-out`;
        reel2.style.transform = `translateY(-${totalMov2 * 100}px)`;

        reel1.style.transition = `transform ${totalMov1 * 50}ms linear`;
        reel1.style.transform = `translateY(-${totalMov1 * 100}px)`;

        setTimeout(() => {

            // 🔥 cuando termina reel2
            num2 = divisor;

            const nuevosValores = generarMultiplos(divisor);
            inicializarReel(reel1, nuevosValores);

            const destino1 = Math.floor(Math.random() * nuevosValores.length);

            const vueltasFinal = 6;
            const totalFinal = vueltasFinal * nuevosValores.length + destino1;

            reel1.style.transition = `transform ${totalFinal * 50}ms ease-out`;
            reel1.style.transform = `translateY(-${totalFinal * 100}px)`;

            setTimeout(() => {

                num1 = nuevosValores[destino1];
                resultadoCorrecto = num1 / num2;

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

                input.placeholder = `${num1} ÷ ${num2}`;

            }, totalFinal * 50);

        }, totalMov2 * 50);
    }

    // =========================
    // 🔵 CASO FIJO (UN SOLO NÚMERO)
    // =========================
    else {

        divisor = numerosReel2[0];
        num2 = divisor;

        const nuevosValores = generarMultiplos(divisor);
        inicializarReel(reel1, nuevosValores);

        const destino1 = Math.floor(Math.random() * nuevosValores.length);

        const vueltasFinal = 6;
        const totalFinal = vueltasFinal * nuevosValores.length + destino1;

        reel1.style.transition = `transform ${totalFinal * 50}ms ease-out`;
        reel1.style.transform = `translateY(-${totalFinal * 100}px)`;

        setTimeout(() => {

            num1 = nuevosValores[destino1];
            resultadoCorrecto = num1 / num2;

            reel1.style.transition = "none";
            reel2.style.transition = "none";

            reel1.style.transform = `translateY(-${destino1 * 100}px)`;
            reel2.style.transform = `translateY(0px)`;

            giroEnCurso = false;
            esperandoRespuesta = true;

            container.classList.remove("disable-clicks");

            input.disabled = false;
            input.focus();
            corregirBtn.disabled = true;

            input.placeholder = `${num1} ÷ ${num2}`;

        }, totalFinal * 50);
    }
}

// =============================
// 🔹 VALIDACIÓN INPUT
// =============================
function validarRespuesta() {
    if (!esperandoRespuesta || endGameExecuted) return;
  
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
    const tiempo = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    document.getElementById("reloj").textContent = tiempo;
    const vertical = document.getElementById("reloj-vertical");
    if (vertical) vertical.textContent = tiempo;
}

function updateErrorsDisplay() {
    document.getElementById("errores").textContent = `${errors}/5`;
    const vertical = document.getElementById("errores-vertical");
    if (vertical) vertical.textContent = `${errors}/5`;
}

function updateScoreDisplay(score) {
    document.getElementById("puntaje").textContent = score;
    const vertical = document.getElementById("puntaje-vertical");
    if (vertical) vertical.textContent = score;
}

// =============================
// 🔹 END GAME (REUTILIZADO)
// =============================
function endGame() {
    if (!endGameExecuted) {
        endGameExecuted = true;

        clearInterval(timerInterval);

        // 🔥 cancelar giro pendiente si existe
        if (giroTimeout) {
            clearTimeout(giroTimeout);
            giroTimeout = null;
        }

        // 🔴 BLOQUEO TOTAL
        clicksEnabled = false;
        esperandoRespuesta = false;
        giroEnCurso = false;

        // 🔴 UI BLOQUEADA
        input.disabled = true;
        input.value = "";
        input.placeholder = "";
        corregirBtn.disabled = true;
        girarBtn.disabled = true;

        container.classList.add("disable-clicks");

        // 🔢 PUNTAJE
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

        if (!endGameExecuted) {clicksEnabled = true;}
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
    const vertical = document.getElementById("actualUsername-vertical");
    if (vertical) vertical.textContent = actualUsername;
    configurarInput();
});

window.addEventListener("resize", configurarInput);

input.addEventListener("input", function() {
    if (!esperandoRespuesta) return;
    const valor = parseInt(input.value);
    corregirBtn.disabled = isNaN(valor);
});


input.addEventListener("keydown", function(e) {
    console.log(e.key, e.code);
    const teclasPermitidas = [
        "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"
    ];
    if (teclasPermitidas.includes(e.key)) return;
    if (e.key === "Enter") {
        validarRespuesta();
        return;
    }
    // 🔥 ESTA ES LA CLAVE
    if (!isNaN(e.key)) {
        return;
    }
    e.preventDefault();
});