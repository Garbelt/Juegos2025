

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startButtonContainer = document.getElementById("start-button-container");
    const container = document.querySelector(".container");
    const audio = document.getElementById("background-music");
    const reloj = document.getElementById("reloj");
    const puntaje = document.getElementById("puntaje");

    if (!startButton || !startButtonContainer || !container || !audio || !reloj || !puntaje) {
        console.error("Error: One or more DOM elements are missing.");
        return;
    }

    let endGameExecuted = false; // Variable para asegurar que endGame() solo se ejecute una vez
    let timerInterval;
    let time;
    const initialScore = 100;
    const baseScore = 50; // Puntos base por completar el puzzle
    const timeLimit = 120; // Límite de tiempo en segundos
    let score = initialScore;
    const size = 5; // Tamaño del rompecabezas (5X5)
    const numMovesToShuffle = 200; // Número de movimientos aleatorios para mezclar el puzzle

    let selectedPiece = null;

    startButton.addEventListener("click", () => {
        startButtonContainer.style.display = "none";
        container.style.display = "block";
        audio.play();

        startTimer();
        createPuzzle();
    });

    function startTimer() {
        time = timeLimit;
        updateClockDisplay();
        timerInterval = setInterval(() => {
            time--;
            updateClockDisplay();

            if (time <= 0) {
                clearInterval(timerInterval);
                showTimeUpMessage();
            }
        }, 1000);
    }

function updateClockDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    const tiempoFormateado = `${minutes}:${seconds}`;

    const puntajeActual = calcularPuntajeActual();
    score = puntajeActual;

    document.getElementById("reloj").textContent = tiempoFormateado;
    const relojVertical = document.getElementById("reloj-vertical");
    if (relojVertical) {
        relojVertical.textContent = tiempoFormateado;
    }
    document.getElementById("puntaje").textContent = puntajeActual;
    const puntajeVertical = document.getElementById("puntaje-vertical");
    if (puntajeVertical) {
        puntajeVertical.textContent = puntajeActual;
    }
}

    function splitImage(imageSrc) {
        const pieces = [];
        for (let i = 0; i < size * size; i++) {
            const piece = document.createElement("div");
            piece.classList.add("piece");
            piece.style.backgroundImage = `url(${imageSrc})`;
            piece.style.backgroundPosition = `${(i % size) * (100 / (size - 1))}% ${(Math.floor(i / size)) * (100 / (size - 1))}%`;
            piece.dataset.index = i;
            piece.style.order = i;
            pieces.push(piece);
        }
        return pieces;
    }

    function createPuzzle() {
        const puzzleContainer = document.getElementById("puzzle");
        if (!puzzleContainer) {
            console.error("Error: Puzzle container element is missing.");
            return;
        }

        puzzleContainer.innerHTML = ""; // Clear any existing pieces
        const imageSrc = "Image/RompeCa.jpg"; // Reemplaza con la ruta de tu imagen
        const pieces = splitImage(imageSrc);

        // Colocar las piezas en el orden correcto inicialmente
        pieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });

        // Mezclar las piezas
        shufflePuzzle(pieces);

        puzzleContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("piece")) {
                if (!selectedPiece) {
                    selectPiece(event.target);
                } else {
                    swapPieces(selectedPiece, event.target);
                    if (checkIfSolved()) {
                        clearInterval(timerInterval);
                        showSolvedMessage();
                    }
                }
            }
        });
    }

    function shufflePuzzle(pieces) {
        const shuffledIndexes = Array.from({ length: size * size }, (_, i) => i).sort(() => Math.random() - 0.5);
        pieces.forEach((piece, index) => {
            piece.style.order = shuffledIndexes[index];
            piece.dataset.index = shuffledIndexes[index];
        });
    }

    function selectPiece(piece) {
        piece.classList.add("selected");
        selectedPiece = piece;
    }

    function swapPieces(piece1, piece2) {
        const tempOrder = piece1.style.order;
        piece1.style.order = piece2.style.order;
        piece2.style.order = tempOrder;

        const tempIndex = piece1.dataset.index;
        piece1.dataset.index = piece2.dataset.index;
        piece2.dataset.index = tempIndex;

        piece1.classList.remove("selected");
        selectedPiece = null;

        // Reproducir el sonido al intercambiar piezas
        playSwapSound();
    }

    function playSwapSound() {
        const swapSound = new Audio("sound/changecoin.mp3");
        swapSound.play();
    }

    function checkIfSolved() {
        const pieces = Array.from(document.querySelectorAll(".piece"));
        return pieces.every((piece, index) => parseInt(piece.dataset.index) === index);
    }

    function calcularPuntajeActual() {
        return Math.max(
            0,
            Math.round(
                initialScore * (time / timeLimit)
            )
        );
    }

function showSolvedMessage() {
    score = baseScore + calcularPuntajeActual();

    const existingMessage = document.querySelector(".found-message");
    if (existingMessage) existingMessage.remove();

    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent = `¡HAS COMPLETADO EL ROMPECABEZAS! TU PUNTAJE ES DE: ${score}`;
    document.body.appendChild(message);

    document.querySelector("#puzzle").classList.add("disable-clicks");
    fadeOutAudio(audio, 6000);

    // Llamar a endGame inmediatamente, que controlará mensajes y redirección
    endGame();
}

function showTimeUpMessage() {
    score = calcularPuntajeActual();
    const existingMessage = document.querySelector(".found-message");
    if (existingMessage) existingMessage.remove();

    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent = `¡TU TIEMPO SE HA AGOTADO!`;
    document.body.appendChild(message);

    document.querySelector("#puzzle").classList.add("disable-clicks");
    fadeOutAudio(audio, 6000);

    endGame();
}

function endGame() {
    if (endGameExecuted) return;
    endGameExecuted = true;
    clearInterval(timerInterval);

    const usuario = localStorage.getItem("ActualUs") || "desconocido";
    const currentDate = new Date().toLocaleDateString();

    // Guardar en localStorage
    const gameData = {
        fecha: currentDate,
        usuario: usuario,
        puntaje: score,
        juegonumero: incrementGameNumber(),
        game: "SMBLS_rmpc01",
        acumulado: parseInt(localStorage.getItem("acumulado")) || 0
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    updateAcumulado(score);

    // Guardado en Firebase
    firebase.database().ref("games").push().set({
        fecha: currentDate,
        game: "SMBLS_rmpc01",
        puntaje: score,
        title: "Rompecabezas de la Escarapela Argentina",
        usuario: usuario
    })
    .then(() => console.log("✅ Resultado guardado en Firebase"))
    .catch(error => console.error("❌ Error al guardar en Firebase:", error));

    // Aquí NO llamamos showMessage()
    // La UI ya está manejada por showSolvedMessage() o showTimeUpMessage()
    
    // Redirección tras un tiempo
    setTimeout(() => {
        fadeOutAudio(audio, 6000);
        setTimeout(() => {
            window.location.href = "out.html";
        }, 6000);
    }, 3000);
}



function showMessageWithDelay() {
    const storedScore = JSON.parse(localStorage.getItem("gamesHistory")).pop().puntaje;
    showMessage(`Puntaje obtenido: ${storedScore}`, 'puntaje');

    fadeOutBackgroundMusic(6);

    // Redireccionar después de 6 segundos
    setTimeout(() => {
        window.location.href = "out.html";
    }, 6000);
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

    function fadeOutAudio(audio, duration) {
        const fadeOutInterval = 50;
        const fadeOutSteps = duration / fadeOutInterval;
        const fadeOutStepValue = audio.volume / fadeOutSteps;

        const fadeOut = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(0, audio.volume - fadeOutStepValue);
            } else {
                clearInterval(fadeOut);
            }
        }, fadeOutInterval);
    }

window.addEventListener("load", () => {
    const actualUsername = localStorage.getItem("ActualUs");
    const usernameElement =
        document.getElementById("actualUsername");
    const usernameVerticalElement =
        document.getElementById("actualUsername-vertical");
    if (usernameElement) {
        usernameElement.textContent =
            `Usuario: ${actualUsername}`;
    }
    if (usernameVerticalElement) {
        usernameVerticalElement.textContent =
            actualUsername;
    }
});
});