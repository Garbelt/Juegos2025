
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startButtonContainer = document.getElementById("start-button-container");
    const container = document.querySelector(".container");
    const audio = document.getElementById("background-music");
    const reloj = document.getElementById("reloj");
    const puntaje = document.getElementById("puntaje");

    if (!startButton || !startButtonContainer || !container || !audio || !reloj || !puntaje) {
        console.error("Error: One or more DOM elements are missing.");
        return;}

const showImageBtn = document.getElementById("show-image-btn");
const previewContainer = document.getElementById("preview-image");
const previewImg = document.getElementById("preview-img");

if (showImageBtn) {
    const showPreview = () => {
        if (!currentImageSrc) return;
        previewImg.src = currentImageSrc;
        previewContainer.style.display = "block";
        document
            .getElementById("puzzle")
            .classList.add("disable-clicks");
    };
    const hidePreview = () => {
        previewContainer.style.display = "none";
        document
            .getElementById("puzzle")
            .classList.remove("disable-clicks");
    };
    // Desktop
    showImageBtn.addEventListener("mousedown", showPreview);
    showImageBtn.addEventListener("mouseup", hidePreview);
    showImageBtn.addEventListener("mouseleave", hidePreview);
    // Mobile / touch
    showImageBtn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // evita scroll o delay raro
        showPreview();
    }, { passive: false });
    showImageBtn.addEventListener("touchend", hidePreview);
    showImageBtn.addEventListener("touchcancel", hidePreview);
}

    let celebrationInterval = null;
    let currentImageSrc = null;
    let endGameExecuted = false; // Variable para asegurar que endGame() solo se ejecute una vez
    let timerInterval;
    let time;
    const initialScore = 100;
    const baseScore = 50; // Puntos base por completar el puzzle
    const timeLimit = 120; // Límite de tiempo en segundos
    let score = initialScore;
    const size = 3; // Tamaño del rompecabezas (5X5)
    const numMovesToShuffle = 200; // Número de movimientos aleatorios para mezclar el puzzle

    let selectedPiece = null;

    function startGame() {
        console.log("GAME STARTED");
        container.style.display = "block";
        createPuzzle();
        startTimer();
        audio.currentTime = 0;
        audio.play();
    }
    window.startGame = startGame;

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

    function getRandomImage() {
        const totalImages = 4; // 👈 CAMBIAR según la cantidad real de imágenes
        // Número aleatorio entre 1 y totalImages
        const randomNumber = Math.floor(Math.random() * totalImages) + 1;
        // Formato con 2 dígitos: 01, 02, 03...
        const formattedNumber = String(randomNumber).padStart(2, "0");
        const imagePath = `Image/RompeCa${formattedNumber}.jpg`;
        console.log("Imagen seleccionada:", imagePath);
        return imagePath;
    }

function createPuzzle() {
    const puzzleContainer =
        document.getElementById("puzzle");
    if (!puzzleContainer) {
        console.error(
            "Error: Puzzle container element is missing."
        );
        return;
    }
    /* quitar cuatritono si existía del juego anterior */
    const previewImg =
        document.querySelector(
            "#preview-image img"
        );
    if (previewImg) {
        previewImg.classList.remove(
            "cuatritono"
        );
    }
    /* limpiar piezas anteriores */
    puzzleContainer.innerHTML = "";
    /* recrear la capa de celebración */
    const celebrationLayer =
        document.createElement("div");
    celebrationLayer.id =
        "celebration-layer";
    puzzleContainer.appendChild(
        celebrationLayer
    );
    /* seleccionar imagen */
    currentImageSrc =
        getRandomImage();
    const imageSrc =
        currentImageSrc;
    const pieces =
        splitImage(imageSrc);
    /* colocar piezas */
    pieces.forEach(piece => {
        puzzleContainer.appendChild(
            piece
        );
    });
    /* mezclar */
    shufflePuzzle(pieces);
    /* manejar clicks */
    puzzleContainer.onclick =
        (event) => {
            if (
                event.target
                    .classList
                    .contains("piece")
            ) {
                if (!selectedPiece) {
                    selectPiece(
                        event.target
                    );
                } else {
                    swapPieces(
                        selectedPiece,
                        event.target
                    );
                    if (checkIfSolved()) {
                        clearInterval(
                            timerInterval
                        );
                         onPuzzleCompleted();
                    }
                }
            }
        };
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

function startCelebrationEffect() {
    const layer =
        document.getElementById("celebration-layer");
    if (celebrationInterval) {
        clearInterval(celebrationInterval);
    }
    layer.style.display = "block";
    celebrationInterval = setInterval(() => {
        createSparkle();
    }, 180);
}

function createSparkle() {
    const layer = document.getElementById("celebration-layer");
    const puzzle = document.getElementById("puzzle");
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    const size = puzzle.clientWidth;
    sparkle.style.left =
        Math.random() * size + "px";
    sparkle.style.top =
        Math.random() * size + "px";
    layer.appendChild(sparkle);
    setTimeout(() => {
        sparkle.remove();
    }, 1200);
}

function onPuzzleCompleted() {
    console.log("PUZZLE COMPLETADO");
    clearInterval(timerInterval);
    const puzzle = document.getElementById("puzzle");
    // bloquear interacción
    puzzle.classList.add("disable-clicks");
    // deshabilitar ojito
    if (showImageBtn) {
        showImageBtn.disabled = true;
        showImageBtn.classList.add("disabled-eye");
    }
    // 🧩 estado final del puzzle
    const pieces = Array.from(document.querySelectorAll(".piece"));
    pieces.forEach((piece, index) => {
        piece.style.order = index;
        piece.dataset.index = index;
    });
    // 🎨 CUATRITONO APLICADO AL PUZZLE REAL
    puzzle.classList.add("cuatritono");
    startCelebrationEffect();
    setTimeout(() => {
        showSolvedMessage();
    }, 4000);
}

function showSolvedMessage() {
    score = baseScore + calcularPuntajeActual();
    const existingMessage = document.querySelector(".found-message");
    if (existingMessage) existingMessage.remove();
    const message = document.createElement("div");
    message.classList.add("found-message");
    message.textContent = `¡HAS COMPLETADO EL ROMPECABEZAS! TU PUNTAJE ES DE: ${score}`;
    document.body.appendChild(message);
    fadeOutAudio(audio, 6000);
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
        game: "VCLS_rmpc",
        acumulado: parseInt(localStorage.getItem("acumulado")) || 0
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    updateAcumulado(score);

    // Guardado en Firebase
    firebase.database().ref("games").push().set({
        fecha: currentDate,
        game: "VCLS_rmpc",
        puntaje: score,
        title: "Rompecabezas de las vocales",
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