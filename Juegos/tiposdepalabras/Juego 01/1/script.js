

let endGameExecuted = false; // Variable para asegurar que endGame() solo se ejecute una vez
let clicksEnabled = true; // Variable para habilitar/deshabilitar clics
let score = 0; // Puntaje global
let totalTimeInSeconds = 30; // Tiempo total en segundos
let errors = 0; // Contador de errores
let timerInterval; // Intervalo del temporizador
let currentInstrument; // Instrumento actual

const instruments = [
{ name: "casa", type: "SUSTANTIVO" },
{ name: "perro", type: "SUSTANTIVO" },
{ name: "mosca", type: "SUSTANTIVO" },
{ name: "ventana", type: "SUSTANTIVO" },
{ name: "cielo", type: "SUSTANTIVO" },
{ name: "montaña", type: "SUSTANTIVO" },
{ name: "río", type: "SUSTANTIVO" },
{ name: "sol", type: "SUSTANTIVO" },
{ name: "flor", type: "SUSTANTIVO" },
{ name: "primavera", type: "SUSTANTIVO" },
{ name: "correr", type: "VERBO" },
{ name: "saltar", type: "VERBO" },
{ name: "pintar", type: "VERBO" },
{ name: "leer", type: "VERBO" },
{ name: "sumar", type: "VERBO" },
{ name: "reir", type: "VERBO" },
{ name: "romper", type: "VERBO" },
{ name: "andar", type: "VERBO" },
{ name: "beber", type: "VERBO" },
{ name: "escribir", type: "VERBO" },
{ name: "cantar", type: "VERBO" },
{ name: "caminar", type: "VERBO" },
{ name: "volar", type: "VERBO" },
{ name: "risa", type: "SUSTANTIVO" },
{ name: "suma", type: "SUSTANTIVO" },
{ name: "lindo", type: "ADJETIVO" },
{ name: "triste", type: "ADJETIVO" },
{ name: "rojizo", type: "ADJETIVO" },
{ name: "lento", type: "ADJETIVO" },
{ name: "amarillento", type: "ADJETIVO" },
{ name: "suaves", type: "ADJETIVO" },
{ name: "sucio", type: "ADJETIVO" },
{ name: "amargo", type: "ADJETIVO" },
{ name: "caluroso", type: "ADJETIVO" },
{ name: "argentino", type: "ADJETIVO" },
{ name: "peludo", type: "ADJETIVO" },
{ name: "sencillo", type: "ADJETIVO" },
{ name: "oloroso", type: "ADJETIVO" }
];

// ======================== END GAME ========================
function endGame() {
    if (!endGameExecuted) {
        endGameExecuted = true;
        clearInterval(timerInterval);
        
        // Sumar bonus si corresponde
        if (errors < 5 && totalTimeInSeconds > 0) {
            score += (5 - errors) * totalTimeInSeconds;
        }

        updateScoreDisplay(score); // Puntaje final en pantalla

        saveGameScore(); // Guardar en localStorage y Firebase

        showMessage('Fin del Juego', 'fin');

        setTimeout(() => showMessageWithDelay(), 3000);
    }
}

function showMessageWithDelay() {
    // Mostrar puntaje obtenido durante 6 segundos
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
    
    if (type === 'puntaje') {
        messageElement.style.backgroundColor = '#8ec6e6';
    } else {
        messageElement.style.backgroundColor = '';
    }

    messageElement.style.display = "block";

    const sound = {
        correct: 'sound/correcto.mp3',
        error: 'sound/error.mp3',
        fin: 'sound/Fin del Juego.mp3'
    }[type];

    if (sound && type !== 'puntaje') {
        new Audio(sound).play();
    }

    // Duración visible del mensaje
    const duration = { fin: 2000, puntaje: 6000 }[type] || 1000;

    setTimeout(() => {
        messageElement.style.display = "none";

        // 👇 Solo mostramos el siguiente instrumento después del mensaje correcto o error
        if (type === 'correct' || type === 'error') {
            if (!endGameExecuted) showNextInstrument();
        }

        // Reactivar clics si el juego sigue
        if (!endGameExecuted) clicksEnabled = true;
    }, duration);
}


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

// ======================== SAVE GAME ========================
function saveGameScore() {
    const usuario = localStorage.getItem("ActualUs") || "desconocido";
    const currentDate = new Date().toLocaleDateString();

    // Guardar en localStorage
    const gameData = {
        fecha: currentDate,
        usuario: usuario,
        puntaje: score,
        juegonumero: incrementGameNumber(), // solo en localStorage
        game: "PLBRS_clsf1",
        acumulado: parseInt(localStorage.getItem("acumulado")) || 0,
        rutina: localStorage.getItem("rutina")
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    updateAcumulado(score);

    // Guardar en Firebase (sin juegonumero)
    saveGameResultToFirebase(score, "PLBRS_clsf1", "Clasificar tipos de palabras", usuario);
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
    })
    .then(() => console.log("✅ Resultado guardado en Firebase"))
    .catch(error => console.error("❌ Error al guardar en Firebase:", error));
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

// ======================== GAME LOGIC ========================
function startGame() {
    endGameExecuted = false;
    totalTimeInSeconds = 30;
    errors = 0;
    score = 0;
    document.getElementById("reloj").textContent = `00:30`;
    updateErrorsDisplay();
    shuffleInstruments();
    startTimer();
}

function shuffleInstruments() {
    for (let i = instruments.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [instruments[i], instruments[j]] = [instruments[j], instruments[i]];
    }
}

function showNextInstrument() {
    if (instruments.length > 0) {
        currentInstrument = instruments.pop();
        const instrumentElement = document.getElementById("instrument");
        instrumentElement.innerHTML = "";

        // 👇 Aquí mostramos el nombre en texto
        const textElement = document.createElement("div");
        textElement.textContent = currentInstrument.name.toUpperCase();
        textElement.style.fontSize = "28px";
        textElement.style.fontWeight = "bold";
        textElement.style.color = "#333";
        textElement.style.textTransform = "capitalize";
        instrumentElement.appendChild(textElement);
    } else {
        endGame();
    }
}


function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay(totalTimeInSeconds);

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
    document.getElementById("reloj").textContent = `Tiempo: ${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function updateErrorsDisplay() {
    document.getElementById("errores").textContent = `Errores: ${errors}/5`;
}

function updateScoreDisplay(score) {
    document.getElementById("puntaje").textContent = `Puntaje: ${score}`;
}

document.getElementById("sustantivo-button").addEventListener("click", () => checkAnswer("SUSTANTIVO"));
document.getElementById("verbo-button").addEventListener("click", () => checkAnswer("VERBO"));
document.getElementById("adjetivo-button").addEventListener("click", () => checkAnswer("ADJETIVO"));


function checkAnswer(selectedType) {
    if (!clicksEnabled) return;
    if (selectedType === currentInstrument.type) {
        showMessage('CORRECTO', 'correct');
        score += 10;
        updateScoreDisplay(score);
        totalTimeInSeconds += 10;
    } else {
        showMessage('ERROR', 'error');
        totalTimeInSeconds -= 15;
        errors++;
        updateErrorsDisplay();
    }
}

window.addEventListener("load", function() {
    const actualUsername = localStorage.getItem("ActualUs");
    document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;
});

document.getElementById("start-button").addEventListener("click", function() {
    document.getElementById("start-button-container").style.display = "none";
    document.querySelector(".container").style.display = "block";
    document.getElementById("background-music").play();

    startGame();
    showNextInstrument(); // 👈 AHORA se muestra el primer instrumento al comenzar
});

