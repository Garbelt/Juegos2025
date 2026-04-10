document.addEventListener('DOMContentLoaded', () => {
  // Variables globales y elementos DOM
  const questionElement = document.getElementById('question');

questionElement.addEventListener("click", () => {
  const currentQuestion =
    questions[currentQuestionIndex];
  if (!currentQuestion) return;
  // Guardar el estado actual del lector
const estadoPrevio = lecturaActiva;
// 🔒 Bloquear botón lector durante lectura manual
setEstadoBotonLector(false);
lecturaActiva = true;
hablar(currentQuestion.question, {
  onEnd: () => {
    lecturaActiva = estadoPrevio;
    // 🔓 Restaurar botón
    setEstadoBotonLector(true);
  }
});
});

  const optionsElement = document.getElementById('options');
  const messageElement = document.getElementById('message');
  const questionImage = document.getElementById('questionImage');
  const imageCell = document.getElementById('image-cell');
  const timeAcumuladoElement = document.getElementById('timeacumulado');
  const puntajeElement = document.getElementById('puntaje');
  const fallidosElement = document.getElementById('fallidos');
  const audioTictac = document.getElementById('audio-tictac');
  let questionAudioPlayer = null;
  let audioPaused = false;

  const actualUsername = localStorage.getItem("ActualUs") || "Invitado";
  document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;

  const questions = [
    {
      question: '¿CÓMO SE LLAMA EL PÁJARO QUE APARECE EN LA IMAGEN?',
      type: "image",
      options: [
          { text: 'GORRIÓN.', correct: false, audio: 'audio/GORRIÓN.mp3' },
          { text: 'CALANDRIA.', correct: true, audio: 'audio/CALANDRIA.mp3' },
          { text: 'LECHUZA.', correct: false, audio: 'audio/LECHUZA.mp3' },
          { text: 'ZORZAL.', correct: false, audio: 'audio/ZORZAL.mp3' },
          { text: 'BICHO FEO.', correct: false, audio: 'audio/BICHO FEO.mp3' },
      ],
      audio: 'audio/question1.mp3',
      image: 'image/imagen01.jpg'
    },
    {
      question: '¿CÓMO SE LLAMA EL PÁJARO QUE APARECE EN LA IMAGEN?',
      type: "simple",
      options: [
          { text: 'GORRIÓN.', correct: false, audio: 'audio/GORRIÓN.mp3' },
          { text: 'CARDENAL.', correct: true, audio: 'audio/CARDENAL.mp3' },
          { text: 'JILGUERO.', correct: false, audio: 'audio/JILGUERO.mp3' },
          { text: 'CHINGOLO.', correct: false, audio: 'CHINGOLO.mp3' },
          { text: 'PALOMA.', correct: false, audio: 'audio/PALOMA.mp3' },
      ],
      audio: 'audio/question1.mp3',
    },
    {
      question: '¿CÓMO SE LLAMA EL PÁJARO QUE APARECE EN LA IMAGEN?',
      type: "imageChange",
      options: [
          { text: 'COTORRA.', correct: false, audio: 'audio/COTORRA.mp3' },
          { text: 'HORNERO.', correct: true, audio: 'audio/HORNERO.mp3' },
          { text: 'TERO.', correct: false, audio: 'audio/TERO.mp3' },
          { text: 'CHINGOLO.', correct: false, audio: 'CHINGOLO.mp3' },
          { text: 'CARDENAL.', correct: false, audio: 'audio/CARDENAL.mp3' },
      ],
      audio: 'audio/question1.mp3',
      image: 'image/imagen03.jpg',
      secondImage: 'image/imagen03_alt.jpg'
    },
    {
      question: '¿CÓMO SE LLAMA EL PÁJARO QUE APARECE EN LA IMAGEN?',
      type: "imageaudio",
      options: [
          { text: 'COTORRA.', correct: false, audio: 'audio/COTORRA.mp3' },
          { text: 'GORRIÓN.', correct: true, audio: 'audio/GORRIÓN.mp3' },
          { text: 'LECHUZA.', correct: false, audio: 'audio/LECHUZA.mp3' },
          { text: 'JILGUERO.', correct: false, audio: 'audio/JILGUERO.mp3' },
          { text: 'BICHO FEO.', correct: false, audio: 'audio/BICHO FEO.mp3' },
      ],
      audio: 'audio/question1.mp3',
      image: 'image/imagen04.jpg',
      birdAudio: 'audio/gorriónAudioImage.mp3'
    }
  ];

  const MAX_ERRORES = 3;
  let currentQuestionIndex = 0;
  let optionAudioPlayers = [];
  let birdAudioPlayer = null;
  let tiempoTotalSegundos = 0;
  let intervaloTiempoAcumulado;
  let puntaje = 0;
  let score = 0;
  let errores = 0;
  let intervaloTemporizador;

  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

function disableOptions() {
  const options = optionsElement.querySelectorAll('li');
  options.forEach(option => {
      option.style.pointerEvents = 'none';
  });
  questionElement.style.pointerEvents = 'none';
  questionElement.style.cursor = 'default';
  questionImage.style.pointerEvents = 'none';
  const speakerButton =
    document.getElementById('speaker-button');
  if (speakerButton) {
    speakerButton.style.pointerEvents = 'none';
    speakerButton.style.opacity = '0.4';
    speakerButton.onclick = null;
  }
}

function setEstadoBotonLector(habilitado) {
    const boton = document.getElementById("lectorButton");
    if (!boton) return;
    if (habilitado) {
        boton.style.pointerEvents = "auto";
    } else {
        boton.style.pointerEvents = "none";
    }
}

function enableOptions() {
  const options =
    optionsElement.querySelectorAll('li');
  options.forEach(option => {
      option.style.pointerEvents = 'auto';
  });
  questionElement.style.pointerEvents = 'auto';
  questionElement.style.cursor = 'pointer';
  const lectorBtn =
    document.getElementById("lectorButton");
  if (lectorBtn) {
    lectorBtn.style.pointerEvents = "auto";
    lectorBtn.style.opacity = "1";
  }
}


  function iniciarTemporizador() {
    clearInterval(intervaloTemporizador);
    let tiempoRestante = 15;

    actualizarRelojGrafico(tiempoRestante);
    audioTictac.currentTime = 0;
    audioTictac.play().catch(e => console.log('No se pudo reproducir tictac:', e));
    iniciarTiempoAcumulado();

    intervaloTemporizador = setInterval(() => {
      tiempoRestante--;
      if (tiempoRestante < 0) {
        clearInterval(intervaloTemporizador);
        manejarTiempoAgotado();
      } else {
        actualizarRelojGrafico(tiempoRestante);
      }
    }, 1000);
  }

  function iniciarTiempoAcumulado() {
      clearInterval(intervaloTiempoAcumulado);
      intervaloTiempoAcumulado = setInterval(() => {
          tiempoTotalSegundos++;
          timeAcumuladoElement.textContent = `${formatearTiempo(tiempoTotalSegundos)}`;
      }, 1000);
  }

  function detenerTiempoAcumulado() {
      clearInterval(intervaloTiempoAcumulado);
  }

  function actualizarRelojGrafico(tiempoRestante, tiempoTotal = 15) {
    const porcentaje = (tiempoRestante / tiempoTotal) * 100;
    const reloj = document.getElementById('reloj');
    const porcentajeInvertido = 100 - porcentaje;
    reloj.style.background = `conic-gradient(from 0deg at 50% 50%, #2ecc71  ${porcentajeInvertido}%, #ecf0f1 ${porcentajeInvertido}%)`;
    reloj.textContent = `${tiempoRestante}`;
  }

  function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(error => console.error('Audio playback failed:', error));
    return audio;
  }

function fadeOutAndStopAudio(audio, duration = 2500) {
  if (!audio) return;
  const interval = 50;
  const step = audio.volume / (duration / interval);
  const fade = setInterval(() => {
    if (audio.volume > step) {
      audio.volume -= step;
    } else {
      audio.volume = 0;
      audio.pause();
      audio.currentTime = 0;
      clearInterval(fade);
    }
  }, interval);
}

  function showMessage(text, type) {
    const audioSrc = type === 'correct' ? 'audio/correcto.mp3' : 'audio/error.mp3';
    playAudio(audioSrc);
    messageElement.textContent = text;
    messageElement.className = `found-message ${type}`;
    messageElement.style.display = 'block';
  }

  function manejarTiempoAgotado() {
    clearInterval(intervaloTemporizador);
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    audioTictac.pause();
    detenerTiempoAcumulado();
    disableOptions();

    errores++;
    fallidosElement.textContent = `${errores}`;
    if (errores >= MAX_ERRORES) {
        perderJuego();
        return;
    }

    questions.push(questions[currentQuestionIndex]);
    questions.splice(currentQuestionIndex, 1);

    showMessage('ERROR', 'error');

    setTimeout(() => {
      messageElement.style.display = 'none';
      loadQuestion();
    }, 2000);
  }

  function fadeOutAudio(audio, duration) {
    let volume = audio.volume;
    const step = volume / (duration / 100);
    const fadeAudio = setInterval(() => {
      if (volume > 0) {
        volume -= step;
        if (volume < 0) volume = 0;
        audio.volume = volume;
      } else {
        clearInterval(fadeAudio);
      }
    }, 100);
  }

  function formatearTiempo(segundosTotales) {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  }

function handleOptionClick(event) {
  if(questionAudioPlayer) questionAudioPlayer.pause();
  if (birdAudioPlayer) {fadeOutAndStopAudio(birdAudioPlayer);}
  clearInterval(intervaloTemporizador);
  audioTictac.pause();
  detenerTiempoAcumulado();

  disableOptions(); // ahora también deshabilita título, imagen y botón parlante
  setEstadoBotonLector(false);

  const correct = event.target.dataset.correct === 'true';

  if (correct) {
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    puntaje += 20;
    score += 20;
    puntajeElement.textContent = `${puntaje}`;
    showMessage('CORRECTO', 'correct');

    setTimeout(() => {
      messageElement.style.display = 'none';
      questions.splice(currentQuestionIndex, 1);

      if (questions.length === 0) {
        showMessagexExito();
      } else {
        if (currentQuestionIndex >= questions.length) {
          currentQuestionIndex = 0;
        }
        loadQuestion();
      }
    }, 5000);
  } else {
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);

    errores++;
    fallidosElement.textContent = `${errores}`;
    if (errores >= MAX_ERRORES) {
        perderJuego();
        return;
    }

    questions.push(questions[currentQuestionIndex]);
    questions.splice(currentQuestionIndex, 1);

    showMessage('ERROR', 'error');

    setTimeout(() => {
      messageElement.style.display = 'none';
      loadQuestion();
    }, 2000);
  }
}

function perderJuego() {
  disableOptions();
  questionElement.style.pointerEvents = 'none';
  questionElement.style.cursor = 'default';
  questionImage.style.pointerEvents = 'none';
  const speakerButton =
    document.getElementById('speaker-button');
  if (speakerButton) {
    speakerButton.style.pointerEvents = 'none';
    speakerButton.style.opacity = '0.4';
    speakerButton.onclick = null;
  }
  // 🔴 NO se calcula bonus
  // 🔴 NO se modifica score
  const message =
    document.createElement("div");
  message.classList.add("found-message");
  message.innerHTML = `
    <div style="font-weight: bold; font-size: 32px;">
      LO SIENTO, PERDISTE
    </div>
    <div style="font-size: 24px;">
      Has alcanzado el máximo de errores.
    </div>
    <div style="margin-top: 10px; font-size: 20px;">
      Puntaje final: ${score}
    </div>
  `;
  document.body.appendChild(message);
  document.body.classList.add("disable-clicks");
  message.style.display = "block";
  message.style.zIndex = "9999";
  fadeOutAudio(
    document.getElementById('background-music'),
    4000
  );
  const audioFin =
    new Audio("sounds/finporintentos.mp3");
  audioFin.play();
  setTimeout(() => {
    endGame();
    almacenarRegistroConZ(score);
    window.location.href = "out.html";
  }, 7000);
}

function showMessagexExito() {
  // Deshabilitar clics en opciones y otros elementos clave
  disableOptions();
  questionElement.style.pointerEvents = 'none';
  questionElement.style.cursor = 'default';
  questionImage.style.pointerEvents = 'none';
  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.pointerEvents = 'none';
  speakerButton.style.opacity = '0.4';
  speakerButton.onclick = null;

  let bonus = Math.floor((score - tiempoTotalSegundos) / (errores + 1));
  if (bonus < 0) bonus = 0;
  score += bonus;

  const message = document.createElement("div");
  message.classList.add("found-message");
  message.innerHTML = `
    <div style="font-weight: bold; font-size: 32px;">¡FELICITACIONES!</div>
    <div style="font-size: 24px;">Has completado el juego.</div>
    <div style="margin-top: 10px; font-size: 20px;">Puntaje final: ${score} (Bonus: ${bonus})</div>
  `;
  document.body.appendChild(message);
  document.body.classList.add("disable-clicks");
  message.style.display = "block";
  message.style.zIndex = "9999";

  fadeOutAudio(document.getElementById('background-music'), 4000);

  const audioFin = new Audio("sounds/finporcompletar.mp3");
  audioFin.play();

  setTimeout(() => {
    endGame();
    almacenarRegistroConZ(score);
    window.location.href = "out.html";
  }, 7000);
}


  function endGame() {
    const currentDate = new Date().toLocaleDateString();
    const userData = {
      fecha: currentDate,
      usuario: localStorage.getItem("ActualUs"),
      puntaje: score,
      juegonumero: incrementGameNumber(),
      game: "PJRS_trvcp",
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

  // Esta función carga la pregunta y configura todo
function loadQuestion() {
  if (questionAudioPlayer) {questionAudioPlayer.pause();}
  if (birdAudioPlayer) {birdAudioPlayer.currentTime = 0;}

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = '';

  // Reset imagen y botón parlante
  questionImage.style.display = 'none';
  questionImage.src = '';
  questionImage.style.cursor = 'default';
  questionImage.onclick = null;
  questionImage.style.pointerEvents = 'none';

  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.display = 'none';
  speakerButton.onclick = null;
  speakerButton.style.pointerEvents = 'none';
  speakerButton.style.opacity = '0.4';

  if (currentQuestion.type === 'imageaudio') {
    if (currentQuestion.image) {
      questionImage.style.display = 'block';
      imageCell.style.display = 'table-cell';
      questionImage.src = currentQuestion.image;
      questionImage.style.cursor = 'default';

      speakerButton.style.display = 'block';

speakerButton._playAudioFunc = () => {
  if (currentQuestion.birdAudio) {
    // Si ya hay audio sonando, lo detenemos
    if (birdAudioPlayer) {
      birdAudioPlayer.pause();
      birdAudioPlayer.currentTime = 0;
    }
    birdAudioPlayer =
      new Audio(currentQuestion.birdAudio);
    birdAudioPlayer.volume = 1;
    birdAudioPlayer.play().catch(e =>
      console.log("No se pudo reproducir audio:", e)
    );
  }
};
    } else {
      imageCell.style.display = 'none';
      questionImage.style.display = 'none';
    }
  } else {
    if (currentQuestion.image) {
      questionImage.style.display = 'block';
      imageCell.style.display = 'table-cell';
      questionImage.src = currentQuestion.image;
      questionImage.style.pointerEvents = 'none';
    } else {
      questionImage.style.display = 'none';
      imageCell.style.display = 'none';
      questionImage.src = '';
    }
  }

  questionImage.dataset.birdAudio = currentQuestion.birdAudio || '';
  questionImage.dataset.secondImage = currentQuestion.secondImage || '';

  shuffleArray(currentQuestion.options);

  currentQuestion.options.forEach((option) => {
      const li = document.createElement('li');
      li.textContent = option.text;
      li.dataset.correct = option.correct;
      li.dataset.audio = option.audio;
      li.style.pointerEvents = 'none';
      li.addEventListener('click', handleOptionClick);

      // 🔊 Lectura de opción al pasar el mouse
      li.addEventListener('mouseenter', () => {
        if (typeof lecturaActiva !== "undefined" && lecturaActiva) {
          if (typeof hablar === "function") {
            hablar(li.textContent);
          }
        }
      });

      // 📱 Lectura en pantallas táctiles
      li.addEventListener('pointerdown', () => {
        if (typeof lecturaActiva !== "undefined" && lecturaActiva) {
          if (typeof hablar === "function") {
            hablar(li.textContent);
          }
        }
      });
      optionsElement.appendChild(li);
  });

  // === DESHABILITAR CLICK EN TITULO AL INICIO ===
  questionElement.style.cursor = 'default';
  questionElement.onclick = null;

  // === BLOQUEAR INTERFAZ AL CARGAR ===
  disableOptions();
  questionImage.style.pointerEvents = 'none';
  speakerButton.style.pointerEvents = 'none';
  speakerButton.style.opacity = '0.4';
  questionElement.style.cursor = 'default';

// === LECTURA AUTOMÁTICA DE LA PREGUNTA (SIEMPRE) ===
// Guardar estado actual del lector
const estadoPrevio = lecturaActiva;
// 🔒 Bloquear botón lector mientras se lee la pregunta
setEstadoBotonLector(false);
// Forzar lectura temporal
lecturaActiva = true;

let lecturaTerminada = false;

function finalizarLectura() {
  if (lecturaTerminada) return;
  lecturaTerminada = true;
  lecturaActiva = estadoPrevio;
  setEstadoBotonLector(true);
  iniciarInterfazPregunta();
}

hablar(currentQuestion.question, {
  bloquearBotones: true,
  onEnd: finalizarLectura
});
// 🛟 Fallback crítico para móviles
setTimeout(() => {
  if (!lecturaTerminada) {
    console.log("⚠️ Fallback: lectura no inició o no terminó");
    finalizarLectura();
  }
}, 2500);

} // ← cierre de loadQuestion

window.loadQuestion = loadQuestion;

function iniciarInterfazPregunta() {
  // Habilitar opciones
  enableOptions();

  // Activar botón parlante
  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.pointerEvents = 'auto';
  speakerButton.style.opacity = '1';
  // Asignar función de reproducción si existe
  speakerButton.onclick = speakerButton._playAudioFunc || null;

  // Activar imagen y cursor
  questionImage.style.pointerEvents = 'auto';
  questionElement.style.cursor = 'pointer';

  // 🔥 INICIAR RELOJ
  iniciarTemporizador();

  // 🔊 INICIAR MÚSICA DE LA PREGUNTA
  const musicaPregunta = document.getElementById('audio-musica-pregunta');
  if (musicaPregunta) {
    musicaPregunta.volume = 1;
    musicaPregunta.currentTime = 0;
    musicaPregunta.play().catch(e =>
      console.log('No se pudo reproducir música de pregunta:', e)
    );
  }
}

// Listener para click en la imagen
questionImage.addEventListener('click', () => {
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.type === 'imageChange') {
    const secondImageSrc = questionImage.dataset.secondImage;

    if (secondImageSrc) {
      const originalImageSrc = questionImage.src;

      questionImage.src = secondImageSrc;

      setTimeout(() => {
        questionImage.src = originalImageSrc;
      }, 3000);
    }
  }
});
});
