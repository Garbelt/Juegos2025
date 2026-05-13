
    const vocales = ['A', 'E', 'I', 'O', 'U'];

    // Niveles con tamaños de grilla
    const niveles = [4, 6, 8, 10, 12];
    let nivelActual = 0;

    let gridSize = niveles[nivelActual];
    let grid = [];
    let correctCells = [];
    const DIREC = [];
    const CORSEL = [];
    const INCORSEL = [];

    let timerInterval;
    let totalTimeInSeconds = 120; // tiempo total para los 3 niveles (ejemplo)
    let tiempoRestante = totalTimeInSeconds;
    let score = 0;

    function getRandomConsonant() {
      let c;
      do {
        c = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      } while (vocales.includes(c));
      return c;
    }

    function createPuzzle() {
      gridSize = niveles[nivelActual];
      grid = [];
      correctCells = [];
      DIREC.length = 0;
      CORSEL.length = 0;
      INCORSEL.length = 0;

      const puzzleElement = document.getElementById("puzzle");
      puzzleElement.innerHTML = "";

      for (let i = 0; i < gridSize; i++) {
        const row = [];
        const rowElement = document.createElement("div");
        rowElement.classList.add("row");

        for (let j = 0; j < gridSize; j++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.id = `${i}/${j}`;
          cell.textContent = "";
          row.push(cell);
          rowElement.appendChild(cell);
        }

        grid.push(row);
        puzzleElement.appendChild(rowElement);
      }

      // Insertar las 5 vocales en posiciones aleatorias
      vocales.forEach(letra => {
        let row, col;
        do {
          row = Math.floor(Math.random() * gridSize);
          col = Math.floor(Math.random() * gridSize);
        } while (grid[row][col].textContent !== "");
        grid[row][col].textContent = letra;
        correctCells.push(`${row}/${col}`);
        DIREC.push(`${row}/${col}`);
      });

      fillEmptyCells();

      actualizarInfoNivel();
    }

    function fillEmptyCells() {
      grid.forEach(row => {
        row.forEach(cell => {
          if (cell.textContent === "") {
            cell.textContent = getRandomConsonant();
          }
        });
      });
    }

    function startTimer() {
      updateTimerDisplay(totalTimeInSeconds);
      tiempoRestante = totalTimeInSeconds;

      timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        tiempoRestante = totalTimeInSeconds;
        updateTimerDisplay(totalTimeInSeconds);

        if (totalTimeInSeconds <= 0) {
          clearInterval(timerInterval);
          showMessagexTiempo();
        }
      }, 1000);
    }

    function updateTimerDisplay(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedTime =
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      // escritorio
      document.getElementById("reloj").textContent = formattedTime;
      // móvil vertical
      document.getElementById("reloj-vertical").textContent = formattedTime;
    }

    function disableClicks() {
      document.body.classList.add("disable-clicks");
    }

    function enableClicks() {
      document.body.classList.remove("disable-clicks");
    }

    function mostrarMensajeError(texto) {
      disableClicks();
      const messageElement = document.createElement("div");
      messageElement.textContent = texto;
      messageElement.classList.add("found-message");
      messageElement.style.backgroundColor = "#f88";
      document.body.appendChild(messageElement);

      const audio = new Audio("sounds/error.mp3");
      audio.play();

      setTimeout(() => {
        document.body.removeChild(messageElement);
        enableClicks();
      }, 3000);
    }

    function corregir() {
      disableClicks();
      document.getElementById("corregir-btn").disabled = true;

      // Obtener letras seleccionadas actualmente
      const seleccionadas = CORSEL.map(id => {
        const [row, col] = id.split("/").map(Number);
        return grid[row][col].textContent.toUpperCase();
      });

      const únicas = [...new Set(seleccionadas)];
      const contieneTodas = vocales.every(v => únicas.includes(v));
      const cantidadCorrecta = CORSEL.length === 5 && únicas.length === 5;

      // Bloquear nuevas letras correctas y sumar puntos
      let nuevosAciertos = 0;
      CORSEL.forEach(id => {
        const [row, col] = id.split("/").map(Number);
        const cell = grid[row][col];
        const letra = cell.textContent.toUpperCase();
        if (vocales.includes(letra) && !cell.classList.contains("locked")) {
          cell.classList.add("locked");
          cell.style.backgroundColor = "#ffd700"; // dorado
          nuevosAciertos++;
        }
      });
      score += nuevosAciertos * 10;
      document.getElementById("puntaje").textContent = `${score}`;
      document.getElementById("puntaje-vertical").textContent = score;

      if (contieneTodas && cantidadCorrecta && INCORSEL.length === 0) {
        // Nivel completado
        avanzarNivel();
      } else {
        const faltantes = vocales.filter(v => !únicas.includes(v));
        const faltantesCount = faltantes.length;
        const tieneErrores = INCORSEL.length > 0;

        if (tieneErrores) {
          // Iluminar rojo las incorrectas
          INCORSEL.forEach(id => {
            const [row, col] = id.split("/").map(Number);
            const cell = grid[row][col];
            cell.style.backgroundColor = '#e74c3c';
          });
        }

        const audioError = new Audio("sounds/error.mp3");
        audioError.play();

        if (tieneErrores) {
          setTimeout(() => {
            INCORSEL.forEach(id => {
              const [row, col] = id.split("/").map(Number);
              const cell = grid[row][col];
              cell.style.backgroundColor = '';
              cell.classList.remove("found");
            });
            INCORSEL.length = 0;

            enableClicks();
            document.getElementById("corregir-btn").disabled = false;

            if (faltantesCount > 0 && CORSEL.length < 5 && INCORSEL.length === 0) {
              const audioFaltas = new Audio(`sounds/faltanletras(${faltantesCount}).mp3`);
              audioFaltas.play();
            }
          }, 3000);
        } else {
          enableClicks();
          document.getElementById("corregir-btn").disabled = false;

          if (faltantesCount > 0 && CORSEL.length < 5) {
            const audioFaltas = new Audio(`sounds/faltanletras(${faltantesCount}).mp3`);
            audioFaltas.play();
          }
        }
      }
    }

function avanzarNivel() {
  nivelActual++;

  if (nivelActual < niveles.length) {
    const mensajeNivel = document.createElement("div");
    mensajeNivel.classList.add("found-message");
    mensajeNivel.innerHTML = `
      <div style="font-weight: bold; font-size: 32px;">¡NIVEL ${nivelActual} COMPLETO!</div>
      <div style="font-size: 24px;">Preparando el siguiente nivel...</div>
    `;
    document.body.appendChild(mensajeNivel);
   
    // Reproducir sonido de avance de nivel
    const audioNivel = document.getElementById("audio-nivel");
    audioNivel.currentTime = 0;
    audioNivel.play();

    setTimeout(() => {
      document.body.removeChild(mensajeNivel);

      // Reproducir audio del nuevo nivel antes de resetear el juego
      const audioNivel = document.getElementById(`audio-nivel-${nivelActual + 1}`);
      if (audioNivel) {
        audioNivel.currentTime = 0;
        audioNivel.play().then(() => {
          // Cuando termina el audio, inicia el siguiente nivel
          audioNivel.onended = () => {
            resetGameForNextLevel();
          };
        }).catch(() => {
          // Si no se puede reproducir audio, avanzamos igual
          resetGameForNextLevel();
        });
      } else {
        // Si no existe el audio, avanzamos igual
        resetGameForNextLevel();
      }

    }, 3000);

  } else {
    clearInterval(timerInterval);
    showMessagexExito();
  }
}



function resetGameForNextLevel() {
  // Reiniciar arreglos
  DIREC.length = 0;
  CORSEL.length = 0;
  INCORSEL.length = 0;

  // Quitar bloqueo de clicks y habilitar botón corregir
  enableClicks();
  document.getElementById("corregir-btn").disabled = false;

  // Crear nueva grilla con el nuevo tamaño
  createPuzzle();

  // Actualizar puntaje e info del nivel
  document.getElementById("puntaje").textContent = `${score}`;
  document.getElementById("puntaje-vertical").textContent = score;
  actualizarInfoNivel();
}


function actualizarInfoNivel() {
  const actualUsername = localStorage.getItem("ActualUs") || "Usuario";
  document.getElementById("actualUsername").textContent = `${actualUsername}`;
  
  const levelImage = document.getElementById("level-image");
  const nivelNumero = nivelActual + 1;
  levelImage.src = `images/nivel${nivelNumero}.png`;  // Asegúrate de tener nivel1.png, nivel2.png, nivel3.png
  levelImage.alt = `Nivel ${nivelNumero}`;
}


    function fadeOutMusic(audioElement, duration) {
      let volume = audioElement.volume;
      let fadeInterval = 50;
      let fadeStep = volume / (duration * 1000 / fadeInterval);

      let fadeOut = setInterval(function() {
        if (volume > 0) {
          volume -= fadeStep;
          if (volume < 0) volume = 0;
          audioElement.volume = volume;
        } else {
          clearInterval(fadeOut);
          audioElement.pause();
          audioElement.currentTime = 0;
        }
      }, fadeInterval);
    }

    function showMessagexTiempo() {
      fadeOutMusic(document.getElementById("background-music"), 4);

      const message = document.createElement("div");
      message.classList.add("found-message");
      message.innerHTML = `
        <div style="font-weight: bold; font-size: 32px;">¡FIN DEL JUEGO!</div>
        <div style="font-size: 24px;">Tu tiempo se ha terminado.</div>
      `;

      document.body.appendChild(message);
      document.body.classList.add("disable-clicks");

      new Audio("sounds/finportiempo.mp3").play();

      setTimeout(() => {
        endGame();
        almacenarRegistroConZ(score);
        window.location.href = "out.html";
      }, 7000);
    }

function showMessagexExito() {
  clearInterval(timerInterval);

  setTimeout(() => {
    fadeOutMusic(document.getElementById("background-music"), 4);

    const bonus = 3 * tiempoRestante;
    score += bonus;

    const message = document.createElement("div");
    message.classList.add("found-message");

    message.innerHTML = `
      <div style="font-weight: bold; font-size: 32px;">¡FELICITACIONES!</div>
      <div style="font-size: 24px;">Has completado el juego.</div>
      <div style="font-size: 20px;">Bonus por tiempo restante: ${bonus} puntos</div>
    `;

    document.body.appendChild(message);
    document.body.classList.add("disable-clicks");

    document.getElementById("audio-correcto").play();

    setTimeout(() => {
      endGame();
      almacenarRegistroConZ(score);
      window.location.href = "out.html";
    }, 7000);
  }, 2000);
}



    function endGame() {
      const currentDate = new Date().toLocaleDateString();
      const userData = {
        fecha: currentDate,
        usuario: localStorage.getItem("ActualUs"),
        puntaje: score,
        juegonumero: incrementGameNumber(),
        game: "AEI_sdl",
        rutina: localStorage.getItem("rutina")
      };

      const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
      gamesHistory.push(userData);
      localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

      updateAcumulado(score);
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

    function almacenarRegistroConZ(finalScore) {
      const juegonumero = localStorage.getItem("gameNumber") || 1;
      const fechaActual = new Date().toLocaleDateString();
      const usuario = localStorage.getItem("ActualUs") || "Desconocido";
      const acumulado = localStorage.getItem("acumulado") || 0;
      const rutina = localStorage.getItem("rutina") || "No disponible";

      const registro = {
        juegoZ: `Juego ${juegonumero}Z`,
        fecha: fechaActual,
        usuario: usuario,
        acumulado: acumulado,
        rutina: rutina
      };

      localStorage.setItem(`registroConZ-${Date.now()}`, JSON.stringify(registro));
      console.log("Registro almacenado con Z:", registro);
    }

    document.getElementById("corregir-btn").addEventListener("click", corregir);

    document.getElementById("corregir-btn-mobile").addEventListener("click", () => {
        document.getElementById("corregir-btn").click();
    });

    document.addEventListener("click", function (event) {
      const cell = event.target;
      if (!cell.classList.contains("cell") || cell.classList.contains("locked")) return;

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
    });
