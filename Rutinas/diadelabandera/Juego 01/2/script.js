

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

    let endGameExecuted = false;
    let timerInterval;
    let time;
    const initialScore = 100;
    let score = initialScore;

    const baseScore = 100; // Puntos base por completar el puzzle
    const timeLimit = 120; // Límite de tiempo en segundos
    const size = 3; // Tamaño del rompecabezas (4X4)
    const numMovesToShuffle = 200; // Número de movimientos aleatorios para mezclar el puzzle

    startButton.addEventListener("click", () => {
        startButtonContainer.style.display = "none";
        // NO iniciar juego aquí
    });

    function startGame() {
        container.style.display = "block";
        audio.play();
        startTimer();
        createPuzzle();
    }

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

function calcularPuntajeActual() {
    return Math.max(
        0,
        Math.round(
            initialScore * (time / timeLimit)
        )
    );
}

function updateClockDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    const tiempoFormateado = `${minutes}:${seconds}`;
    const puntajeActual = calcularPuntajeActual();
    score = puntajeActual;
    reloj.textContent = tiempoFormateado;
    puntaje.textContent = puntajeActual;
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

        // Añadir una pieza vacía
        const emptyPiece = document.createElement("div");
        emptyPiece.classList.add("piece", "empty");
        emptyPiece.style.order = size * size - 1;
        emptyPiece.dataset.index = size * size - 1;
        pieces[size * size - 1] = emptyPiece;

        // Colocar las piezas en el orden correcto inicialmente
        pieces.forEach(piece => {
            puzzleContainer.appendChild(piece);
        });

        // Mezclar las piezas con movimientos aleatorios
        shufflePuzzle();

        puzzleContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("piece") && !event.target.classList.contains("empty")) {
                movePiece(event.target);
                if (checkIfSolved()) {
                    clearInterval(timerInterval);
                    showSolvedMessage();
                }
            }
        });
    }

    function shufflePuzzle() {
        const puzzleContainer = document.getElementById("puzzle");
        if (!puzzleContainer) {
            console.error("Error: Puzzle container element is missing.");
            return;
        }
        
        const pieces = Array.from(puzzleContainer.children);
        const emptyPiece = document.querySelector(".empty");

        for (let i = 0; i < numMovesToShuffle; i++) {
            const neighbors = getMovableNeighbors(emptyPiece);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            movePiece(randomNeighbor, true); // Mover pieza sin comprobar si está resuelto
        }
    }

    function getMovableNeighbors(emptyPiece) {
        const emptyIndex = parseInt(emptyPiece.dataset.index);
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        const neighbors = [];
        if (emptyRow > 0) neighbors.push(document.querySelector(`.piece[data-index="${emptyIndex - size}"]`)); // Arriba
        if (emptyRow < size - 1) neighbors.push(document.querySelector(`.piece[data-index="${emptyIndex + size}"]`)); // Abajo
        if (emptyCol > 0) neighbors.push(document.querySelector(`.piece[data-index="${emptyIndex - 1}"]`)); // Izquierda
        if (emptyCol < size - 1) neighbors.push(document.querySelector(`.piece[data-index="${emptyIndex + 1}"]`)); // Derecha

        return neighbors;
    }

    function movePiece(piece, shuffling = false) {
        const emptyPiece = document.querySelector(".empty");
        const pieceIndex = parseInt(piece.dataset.index);
        const emptyIndex = parseInt(emptyPiece.dataset.index);

        const pieceRow = Math.floor(pieceIndex / size);
        const emptyRow = Math.floor(emptyIndex / size);
        const pieceCol = pieceIndex % size;
        const emptyCol = emptyIndex % size;

        // Verificar si las celdas adyacentes están en la misma fila o columna
        if ((pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) ||
            (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1)) {
            // Intercambiar la pieza con la pieza vacía
            emptyPiece.style.order = piece.style.order;
            piece.style.order = emptyIndex;

            // Intercambiar el índice de la pieza vacía y la pieza seleccionada
            emptyPiece.dataset.index = pieceIndex;
            piece.dataset.index = emptyIndex;

            // Registro en consola del movimiento
            if (!shuffling) {
                console.log(`Moved piece ${pieceIndex} to empty spot ${emptyIndex}`);
            }
        }
    }

    function checkIfSolved() {
        const pieces = Array.from(document.querySelectorAll(".piece"));
        return pieces.every((piece, index) => parseInt(piece.dataset.index) === index);
    }

function showSolvedMessage() {
    score = baseScore + calcularPuntajeActual();
    const existingMessage =
        document.querySelector(".found-message");
    if (existingMessage)
        existingMessage.remove();
    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent =
        `¡HAS COMPLETADO EL ROMPECABEZAS! TU PUNTAJE ES DE: ${score}`;
    document.body.appendChild(message);
    document
        .querySelector("#puzzle")
        .classList.add("disable-clicks");
    fadeOutAudio(audio, 6000);
    endGame();
}

function showTimeUpMessage() {
    score = calcularPuntajeActual();
    const existingMessage =
        document.querySelector(".found-message");
    if (existingMessage)
        existingMessage.remove();
    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent =
        `¡TU TIEMPO SE HA AGOTADO!`;
    document.body.appendChild(message);
    document
        .querySelector("#puzzle")
        .classList.add("disable-clicks");
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
        game: "MBELG_rmpc02",
        acumulado: parseInt(localStorage.getItem("acumulado")) || 0
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    updateAcumulado(score);

    // Guardado en Firebase
    firebase.database().ref("games").push().set({
        fecha: currentDate,
        game: "MBELG_rmpc02",
        puntaje: score,
        title: "MANUEL BELGRANO",
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

function updateAcumulado(scoreToAdd) {
    let acumulado =
        parseInt(
            localStorage.getItem("acumulado")
        ) || 0;
    acumulado += scoreToAdd;
    localStorage.setItem(
        "acumulado",
        acumulado
    );
}

function incrementGameNumber() {
    let gameNumber =
        parseInt(
            localStorage.getItem("gameNumber")
        ) || 0;
    gameNumber++;
    localStorage.setItem(
        "gameNumber",
        gameNumber
    );
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
        const usernameElement = document.getElementById("actualUsername");
        if (usernameElement) {
            usernameElement.textContent = `Usuario: ${actualUsername}`;
        } else {
            console.error("Error: Username element not found.");
        }
    });
});




