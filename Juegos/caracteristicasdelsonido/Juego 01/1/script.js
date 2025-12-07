

const words = ["ALTURA", "TIMBRE", "TONO", "VOLUMEN", "INTENSIDAD", "DURACIÓN", "LARGO", "CORTO", "FUERTE", "SUAVE", "DÉBIL", "AGUDO", "GRAVE", "ALTO", "BAJO"];
let totalWords = words.length;
let usedWords = [];
const gridSize = 12;
let grid = [];
let correctCells = [];
let selectedCells = [];
const DIREC = [];
const CORSEL = [];
const INCORSEL = [];
let timerInterval;
let totalTimeInSeconds = 60;
let score = 0;
let messageShown = false;
let gameSaved = false;
let gameEnded = false;
let bonusApplied = false;
let clicksEnabled = true;

// 🔠 Generar letra aleatoria
function getRandomLetterExcluding(excludedLetter) {
  let newLetter;
  do {
    newLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  } while (newLetter === excludedLetter);
  return newLetter;
}

// 🎲 Crear la sopa
function createPuzzle() {
  if (gameEnded) return; // Evitar reinicio tras el fin del juego

  grid = [];
  correctCells = [];
  selectedCells = [];
  DIREC.length = 0;
  CORSEL.length = 0;
  INCORSEL.length = 0;

  const puzzleElement = document.getElementById("puzzle");
  puzzleElement.innerHTML = "";

  let wordFound;
  // elegir palabra no usada; if none left, evitamos bucle infinito
  const unusedWords = words.filter(word => !usedWords.includes(word));
  if (unusedWords.length === 0) {
    // No hay palabras restantes: terminar el juego si aún no terminó
    if (!gameEnded) endGame(true);
    return;
  }

  do {
    wordFound = chooseNewWord();
  } while (usedWords.includes(wordFound));

  usedWords.push(wordFound);

  for (let i = 0; i < gridSize; i++) {
    const row = [];
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${i}/${j}`;
      row.push(cell);
      rowElement.appendChild(cell);
    }

    grid.push(row);
    puzzleElement.appendChild(rowElement);
  }

  insertWordInGrid(wordFound);
  fillEmptyCells();

  document.getElementById("palabras").textContent = `${wordFound}`;

  if (!timerInterval) startTimer();
}

// 🧩 Elegir palabra no usada
function chooseNewWord() {
  const unusedWords = words.filter(word => !usedWords.includes(word));
  if (unusedWords.length === 0) return null;
  return unusedWords[Math.floor(Math.random() * unusedWords.length)];
}

// ➕ Insertar palabra
function insertWordInGrid(word) {
  if (!word) return;
  const wordLength = word.length;
  const { position, direction } = getRandomPositionAndDirection(wordLength);
  const { row, col } = position;

  if (direction === "horizontal") {
    for (let i = 0; i < wordLength; i++) {
      grid[row][col + i].textContent = word[i];
      correctCells.push({ row, col: col + i });
      DIREC.push(`${row}/${col + i}`);
    }
  } else {
    for (let i = 0; i < wordLength; i++) {
      grid[row + i][col].textContent = word[i];
      correctCells.push({ row: row + i, col });
      DIREC.push(`${row + i}/${col}`);
    }
  }
}

// ↔️ Posición y dirección aleatoria
function getRandomPositionAndDirection(wordLength) {
  const remainingSpace = gridSize - wordLength;
  let direction, startRow, startCol;

  if (Math.random() < 0.5) {
    direction = "horizontal";
    startRow = Math.floor(Math.random() * gridSize);
    startCol = Math.floor(Math.random() * (remainingSpace + 1));
  } else {
    direction = "vertical";
    startRow = Math.floor(Math.random() * (remainingSpace + 1));
    startCol = Math.floor(Math.random() * gridSize);
  }

  return { position: { row: startRow, col: startCol }, direction };
}

// 🧱 Rellenar celdas vacías
function fillEmptyCells() {
  grid.forEach(row => row.forEach(cell => {
    if (cell.textContent === "") cell.textContent = getRandomLetterExcluding("");
  }));
}

// ⏱️ Temporizador
function startTimer() {
  updateTimerDisplay(totalTimeInSeconds);
  timerInterval = setInterval(() => {
    totalTimeInSeconds--;
    updateTimerDisplay(totalTimeInSeconds);

    if (totalTimeInSeconds <= 0) {
      clearInterval(timerInterval);
      setTimeout(checkCorrectCellsSelected, 0);
    }
  }, 1000);
}

function updateTimerDisplay(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  document.getElementById("reloj").textContent =
    `Tiempo: ${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

// 🚫 / 🟢 Control de clics
function disableClicks() {
  clicksEnabled = false;
  document.body.classList.add("disable-clicks");
}
function enableClicks() {
  if (!gameEnded) {
    clicksEnabled = true;
    document.body.classList.remove("disable-clicks");
  }
}

// 🔒 Mostrar mensajes del juego (revisado)
function showGameMessage(text, duration = 3000, audioSrc = null, callback = null, extraClass = "") {
  disableClicks();

  const messageElement = document.createElement("div");
  messageElement.innerHTML = text;
  messageElement.classList.add("found-message");
  if (extraClass) messageElement.classList.add(extraClass);

  const container = document.querySelector(".container") || document.body;
  container.appendChild(messageElement);

  // Reproducir sonido si corresponde (solo si no terminó)
  if (audioSrc && !gameEnded) {
    try {
      const audio = new Audio(audioSrc);
      audio.play().catch(()=>{ /* ignorar errores de reproducción */ });
    } catch (e) { /* noop */ }
  }

  setTimeout(() => {
    messageElement.remove();

    // No volver a habilitar clics si el juego terminó
    if (!gameEnded) enableClicks();

    // Ejecutar callback aunque haya terminado (para los finales)
    if (callback) callback();
  }, duration);
}

// ✅ Mostrar palabra encontrada
function showFoundMessage() {
  if (gameEnded) return;

  // 1️⃣ Sumar puntaje inmediatamente
  score += 20;
  document.getElementById("puntaje").textContent = `Puntaje: ${score}`;

  // 2️⃣ Mostrar mensaje
  showGameMessage("PALABRA ENCONTRADA", 3000, "sound/palabraencontrada.mp3", () => {
    if (gameEnded) return;
    // 3️⃣ Solo verificar bonus y crear nueva palabra
    checkForBonus();
    if (!gameEnded) createPuzzle();
  }, "correct");
}


// 🔎 Verificar selección
function checkCorrectCellsSelected() {
  if (gameSaved || gameEnded) return;

  const allCorrectSelected = correctCells.every(c => CORSEL.includes(`${c.row}/${c.col}`));
  const anyIncorrectSelected = INCORSEL.length > 0;

  // Fin por tiempo (prioritario)
  if (totalTimeInSeconds <= 0 && !gameEnded) {
    endGame(false);
    return;
  }

  // Palabra completa encontrada
  if (allCorrectSelected && !anyIncorrectSelected) {
    // Última palabra -> bonus y fin
    if (usedWords.length === totalWords && !bonusApplied) {
      // Aseguramos que solo se aplique una vez
      bonusApplied = true;
      endGame(true);
      return;
    }

    // Caso normal: palabra encontrada (no es el cierre final)
    if (!gameEnded) {
      showFoundMessage();
    }
    return;
  }
}

// 🔚 Fin del juego (único)
function endGame(withBonus = false) {
  if (gameEnded) return;
  gameEnded = true;
  disableClicks();
  clearInterval(timerInterval);

  const backgroundAudio = document.getElementById('background-music');
  if (backgroundAudio) fadeOutAudio(backgroundAudio, 5000);

  if (withBonus) {
    // Asumimos que en el cierre queremos sumar la palabra actual + bonus
    // pero solo si no se añadió antes. Como llegamos aquí directamente,
    // sumamos el +30 de la última palabra y el bonus.
    score += 20;
    const bonus = totalTimeInSeconds + (totalWords * 5);
    score += bonus;
    updateAcumulado(score);
    document.getElementById("puntaje").textContent = `Puntaje: ${score}`;
    showBonusMessage(bonus);
  } else {
    updateAcumulado(score);
    showEndGameMessage();
  }
}

// 🎯 Mensaje de fin normal
function showEndGameMessage() {
  if (messageShown) return;
  messageShown = true;
  // gameEnded ya es true en endGame
  disableClicks();

  showGameMessage("FIN DE ESTE JUEGO", 7000, "sound/findejuego.mp3", () => {
    const backgroundAudio = document.getElementById('background-music');
    fadeOutAudio(backgroundAudio, 5000);

    // Aseguramos que el guardado y la redirección SIEMPRE se ejecuten
    setTimeout(() => {
      saveGameScore();
      window.location.href = "out.html";
    }, 1500);
  }, "correct");
}

// 🎉 Mensaje de bonus final
function showBonusMessage(bonus) {
  if (messageShown) return;
  messageShown = true;
  // gameEnded ya es true en endGame
  disableClicks();

  showGameMessage(`¡DESCUBRISTE TODAS LAS PALABRAS!<br>GANASTE UN BONUS DE ${bonus} PUNTOS.`, 6000, null, () => {
    const backgroundAudio = document.getElementById('background-music');
    fadeOutAudio(backgroundAudio, 5000);

    setTimeout(() => {
      saveGameScore();
      window.location.href = "out.html";
    }, 1500);
  }, "correct");
}


// 💾 Guardado
function saveGameScore() {
  if (gameSaved) return;
  gameSaved = true;

  const usuario = localStorage.getItem("ActualUs") || "desconocido";
  const currentDate = new Date().toLocaleDateString();
  const gameData = {
    fecha: currentDate,
    usuario: usuario,
    puntaje: score,
    juegonumero: incrementGameNumber(),
    game: "SOUND_sdl",
    acumulado: parseInt(localStorage.getItem("acumulado")) || 0,
    rutina: localStorage.getItem("rutina")
  };

  const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
  gamesHistory.push(gameData);
  localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

  saveGameResultToFirebase(score, "SOUND_sdl", "Clasificación de Instrumentos", usuario);
}

function incrementGameNumber() {
  let gameNumber = parseInt(localStorage.getItem("juegonumero")) || 0;
  gameNumber++;
  localStorage.setItem("juegonumero", gameNumber);
  return gameNumber;
}

// 🎁 Bonus auxiliar
function checkForBonus() {
  if (gameSaved || gameEnded) return;
  if (usedWords.length === totalWords) endGame(true);
}

// 🔉 Fundido de audio
function fadeOutAudio(audio, duration) {
  if (!audio) return;
  let volume = audio.volume;
  const step = volume / (duration / 100);
  const fadeAudio = setInterval(() => {
    if (volume > 0) {
      volume -= step;
      if (volume < 0) volume = 0;
      audio.volume = volume;
    } else clearInterval(fadeAudio);
  }, 100);
}

// 💾 Firebase
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
  .then(() => console.log("✅ Resultado completo guardado en Firebase"))
  .catch(error => console.error("❌ Error al guardar:", error));
}

function updateAcumulado(scoreToAdd) {
  let acumulado = parseInt(localStorage.getItem("acumulado")) || 0;
  acumulado += scoreToAdd;
  localStorage.setItem("acumulado", acumulado);
}

// 👆 Manejo de clics en celdas
document.addEventListener("click", function(event) {
  if (!clicksEnabled || gameEnded) return;

  const cell = event.target;
  if (cell.classList.contains("cell")) {
    const cellName = cell.id;

    if (DIREC.includes(cellName)) {
      if (CORSEL.includes(cellName)) {
        CORSEL.splice(CORSEL.indexOf(cellName), 1);
        cell.classList.remove("found");
      } else {
        CORSEL.push(cellName);
        cell.classList.add("found");
      }
    } else {
      if (INCORSEL.includes(cellName)) {
        INCORSEL.splice(INCORSEL.indexOf(cellName), 1);
        cell.classList.remove("found");
      } else {
        INCORSEL.push(cellName);
        cell.classList.add("found");
      }
    }

    setTimeout(checkCorrectCellsSelected, 0);
  }
});

fillEmptyCells();