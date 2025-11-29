// script.js - Juego de provincias con guardado LOCAL + FIREBASE (DTOS_sei)

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const startButtonContainer = document.getElementById("start-button-container");
  const container = document.querySelector(".container");
  const audio = document.getElementById("background-music");
  const reloj = document.getElementById("reloj");
  const puntaje = document.getElementById("puntaje");
  const intentos = document.getElementById("intentos");
  const indicacion = document.getElementById("indicacion");
  const titulo = document.getElementById("titulo-instruccion");
  const cuadrantes = document.querySelectorAll(".quadrant");

  let score = 0;
  let time = 90;
  let attempts = 5;
  let timerInterval;

  // Para asegurar que endGame() solo se ejecute una vez
  let endGameExecuted = false;

  /* -------------------------------
     PROVINCIAS (presentación para el alumno)
  -------------------------------- */
  const partesOriginal = [
    '9 DE JULIO', 'GENERAL OBLIGADO', 'VERA', 'SAN JAVIER', 'SAN CRISTÓBAL', 'SAN JUSTO',
    'GARAY', 'LA CAPITAL', 'LAS COLONIAS', 'SAN JERÓNIMO', 'SAN MARTÍN',
    'CASTELLANOS', 'BELGRANO', 'CASEROS', 'GENERAL LÓPEZ', 'CONSTITUCIÓN',
    'IRIONDO', 'ROSARIO', 'SAN LORENZO',
  ];

  let pendientes = [...partesOriginal];
  let resueltos = [];
  let partesAleatorias = [];
  let parteActualIndex = 0;

  /* -------------------------------
     NORMALIZADOR: quita acentos, pasa a minúsculas
     y reemplaza espacios por "_" para coincidir con clases
     ej: "ENTRE RÍOS" -> "entre_rios"
  -------------------------------- */
  function normalizarTexto(texto) {
    if (texto === undefined || texto === null) return "";
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");
  }

  /* -------------------------------
     SAVE / FIREBASE helpers (igual que tu juego modelo)
     gameCode: DTOS_sei
     title: "Señalar las provincias en el mapa"
  -------------------------------- */
  const GAME_CODE = "DTOS_sei";
  const GAME_TITLE = "Señalar las provincias en el mapa";

  async function saveGameResultToFirebase(puntaje, gameCode, gameTitle, usuario) {
    if (typeof firebase === "undefined" || !firebase.database) {
      console.warn("Firebase no está disponible. Se omitirá guardado en Firebase.");
      return;
    }
    const fecha = new Date().toLocaleDateString("es-ES");
    const newGameRef = firebase.database().ref("games").push();
    try {
      await newGameRef.set({
        fecha: fecha,
        game: gameCode,
        puntaje: puntaje,
        title: gameTitle,
        usuario: usuario
      });
      console.log("✅ Resultado guardado en Firebase");
    } catch (error) {
      console.error("❌ Error al guardar en Firebase:", error);
    }
  }

  function updateAcumuladoLocal(scoreToAdd) {
    let acumulado = parseInt(localStorage.getItem("acumulado")) || 0;
    acumulado += scoreToAdd;
    localStorage.setItem("acumulado", acumulado);
  }

  function incrementGameNumberLocal() {
    let gameNumber = parseInt(localStorage.getItem("gameNumber")) || 0;
    gameNumber++;
    localStorage.setItem("gameNumber", gameNumber);
    return gameNumber;
  }

  function saveGameScoreLocalAndFirebase(finalScore) {
    const usuario = localStorage.getItem("ActualUs") || "desconocido";
    const currentDate = new Date().toLocaleDateString();

    // Guardar en localStorage
    const gameData = {
      fecha: currentDate,
      usuario: usuario,
      puntaje: finalScore,
      juegonumero: incrementGameNumberLocal(), // sólo en localStorage
      game: GAME_CODE,
      acumulado: parseInt(localStorage.getItem("acumulado")) || 0,
      rutina: localStorage.getItem("rutina")
    };

    const gamesHistory = JSON.parse(localStorage.getItem("gamesHistory")) || [];
    gamesHistory.push(gameData);
    localStorage.setItem("gamesHistory", JSON.stringify(gamesHistory));

    // Actualizar acumulado local
    updateAcumuladoLocal(finalScore);

    // Guardar en Firebase (sin juegonumero)
    saveGameResultToFirebase(finalScore, GAME_CODE, GAME_TITLE, usuario);
  }

  /* -------------------------------
     Timer / UI / Mensajes
  -------------------------------- */
  function startTimer() {
    updateDisplay();
    timerInterval = setInterval(() => {
      time--;
      updateDisplay();
      if (time <= 0) {
        clearInterval(timerInterval);
        showMessagexTiempo();
      }
    }, 1000);
  }

  function updateDisplay() {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    reloj.textContent = `Tiempo: ${minutes}:${seconds}`;
    puntaje.textContent = `Puntaje: ${score}`;
    intentos.textContent = `Intentos: ${attempts}`;
  }

  function barajarPendientes() {
    partesAleatorias = [...pendientes].sort(() => Math.random() - 0.5);
    parteActualIndex = 0;
  }

  function actualizarTextoSeleccion() {
    if (parteActualIndex >= partesAleatorias.length) {
      if (pendientes.length === 0) {
        clearInterval(timerInterval);
        showMessagexExito();
      } else {
        barajarPendientes();
        indicacion.textContent = partesAleatorias[parteActualIndex];
      }
    } else {
      indicacion.textContent = partesAleatorias[parteActualIndex];
    }
  }

  function fadeOutMusic(audioElement, duration) {
    let volume = audioElement.volume;
    let fadeInterval = 50;
    let fadeStep = volume / (duration * 1000 / fadeInterval);

    let fadeOut = setInterval(function () {
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

function showTemporaryMessage(text, type) {
  const messageEl = document.getElementById("message");
  if (!messageEl) return;

  // Limpiar y aplicar clases
  messageEl.className = "found-message " + (type || "");
  messageEl.textContent = text;

  // Forzar visibilidad / prioridad
  messageEl.style.display = "block";
  messageEl.style.zIndex = "100000";

  // Evitar que el overlay o .disable-clicks lo tape visualmente
  // (no tocamos body.classList aquí para no romper la lógica de bloqueo)
  // Si necesitás que se reactive interacción interna, hacerlo aparte

  // Sonidos opcionales
  try {
    if (type === "correct") new Audio("sounds/correcto.mp3").play();
    if (type === "error") new Audio("sounds/error.mp3").play();
  } catch (e) { /* ignore */ }

  // Duración por defecto 2s para mensajes temporales
  setTimeout(() => {
    // ocultar (no eliminar)
    messageEl.style.display = "none";
    // limpiar clase variante para evitar conflictos posteriores
    messageEl.className = "found-message";
  }, 2000);
}

function showMessagexExito() {
  // mostrar breve confirmación primero
  showTemporaryMessage("CORRECTO", "correct");

  setTimeout(() => {
    titulo.style.visibility = "hidden";
    indicacion.textContent = '';
    fadeOutMusic(audio, 4);

    const bonus = time * 2;
    score += bonus;

    const messageEl = document.getElementById("message");
    if (!messageEl) return;

    messageEl.className = "found-message fin";
    messageEl.innerHTML = `
      <div style="font-weight: bold; font-size: 32px;">¡FELICITACIONES!</div>
      <div style="font-size: 24px;">Has completado el juego.</div>
      <div style="margin-top: 10px; font-size: 20px;">Puntaje final: ${score} (Bonus: ${bonus})</div>
    `;
    messageEl.style.display = "block";
    messageEl.style.zIndex = "100000";

    // Bloquear interacciones si así lo quieres
    document.body.classList.add("disable-clicks");

    try { new Audio("sounds/finporcompletar.mp3").play(); } catch(e){}

    setTimeout(async () => {
      if (!endGameExecuted) {
        endGameExecuted = true;
        saveGameScoreLocalAndFirebase(score);

    }
      window.location.href = "out.html";
    }, 7000);
  }, 2000);
}

function showMessagexTiempo() {
  if (endGameExecuted) return;
  endGameExecuted = true;

  titulo.style.visibility = "hidden";
  document.getElementById('indicacion').textContent = '';

  fadeOutMusic(audio, 4);

  const messageEl = document.getElementById("message");
  if (!messageEl) return;

  messageEl.className = "found-message fin";
  messageEl.innerHTML = `
    <div style="font-weight: bold; font-size: 32px;">¡FIN DEL JUEGO!</div>
    <div style="font-size: 24px;">Tu tiempo se ha terminado.</div>
  `;
  messageEl.style.display = "block";
  messageEl.style.zIndex = "100000";
  document.body.classList.add("disable-clicks");

  try { new Audio("sounds/finportiempo.mp3").play(); } catch(e){}

  saveGameScoreLocalAndFirebase(score);
  
  setTimeout(() => {
    window.location.href = "out.html";
  }, 7000);
}

function showMessagexIntentos() {
  if (endGameExecuted) return;
  endGameExecuted = true;

  // mensaje de error breve
  showTemporaryMessage("ERROR", "error");

  setTimeout(() => {
    titulo.style.visibility = "hidden";
    document.getElementById('indicacion').textContent = '';
    fadeOutMusic(audio, 4);

    const messageEl = document.getElementById("message");
    if (!messageEl) return;

    messageEl.className = "found-message fin";
    messageEl.innerHTML = `<div style="font-size: 24px;">Lo siento. Perdiste.</div>`;
    messageEl.style.display = "block";
    messageEl.style.zIndex = "100000";
    document.body.classList.add("disable-clicks");

    try { new Audio("sounds/finporintentos.mp3").play(); } catch(e){}

    saveGameScoreLocalAndFirebase(score);
    
    setTimeout(() => {
      window.location.href = "out.html";
    }, 7000);
  }, 2000);
}

  // Mantener compatibilidad: endGame ahora centraliza guardado por seguridad
  function endGame() {
    if (endGameExecuted) return;
    endGameExecuted = true;

    // Guardar resultado (local + firebase)
    saveGameScoreLocalAndFirebase(score);
    
    // stop timer
    if (timerInterval) clearInterval(timerInterval);

    // redirigir con pequeña pausa
    setTimeout(() => {
      window.location.href = "out.html";
    }, 1500);
  }


  // inicio / eventos
  startButton.addEventListener("click", () => {
    startButtonContainer.style.display = "none";
    container.style.display = "block";
    try { audio && audio.play && audio.play(); } catch(e){}
    startTimer();
    barajarPendientes();
    actualizarTextoSeleccion();
    updateDisplay();
  });

  cuadrantes.forEach(zona => {
    zona.addEventListener("click", () => {
      if (attempts <= 0 || pendientes.length === 0 || endGameExecuted) return;

      const parteEsperada = normalizarTexto(partesAleatorias[parteActualIndex]);

      const parteSeleccionada =
        zona.classList.contains("9_de_julio") ? "9_de_julio"
        : zona.classList.contains("general_obligado") ? "general_obligado"
        : zona.classList.contains("vera") ? "vera"
        : zona.classList.contains("san_javier") ? "san_javier"
        : zona.classList.contains("san_cristobal") ? "san_cristobal"
        : zona.classList.contains("san_justo") ? "san_justo"
        : zona.classList.contains("garay") ? "garay"
        : zona.classList.contains("la_capital") ? "la_capital"
        : zona.classList.contains("las_colonias") ? "las_colonias"
        : zona.classList.contains("san_jeronimo") ? "san_jeronimo"
        : zona.classList.contains("san_martin") ? "san_martin"
        : zona.classList.contains("castellanos") ? "castellanos"
        : zona.classList.contains("belgrano") ? "belgrano"
        : zona.classList.contains("caseros") ? "caseros"
        : zona.classList.contains("general_lopez") ? "general_lopez"
        : zona.classList.contains("constitucion") ? "constitucion"
        : zona.classList.contains("iriondo") ? "iriondo"
        : zona.classList.contains("rosario") ? "rosario"
        : zona.classList.contains("san_lorenzo") ? "san_lorenzo"
        : "";

      if (parteEsperada === normalizarTexto(parteSeleccionada)) {
        const parteResuelta = partesAleatorias[parteActualIndex];
        if (!resueltos.includes(parteResuelta)) {
          resueltos.push(parteResuelta);
          pendientes = pendientes.filter(p => p !== parteResuelta);
          score += 30;
          showTemporaryMessage("CORRECTO", "correct");
          try { new Audio("sounds/correcto.mp3").play(); } catch(e){}
        }
      } else {
        attempts--;
        showTemporaryMessage("ERROR", "error");
        try { new Audio("sounds/error.mp3").play(); } catch(e){}
      }

      parteActualIndex++;
      updateDisplay();

      if (attempts <= 0) {
        clearInterval(timerInterval);
        showMessagexIntentos();
      } else {
        actualizarTextoSeleccion();
      }
    });
  });

  // Exponer utilidades por si el HTML las llama
  window.normalizarTexto = normalizarTexto;
  window.almacenarRegistroConZ = almacenarRegistroConZ;
  window.incrementGameNumber = incrementGameNumberLocal;
});
