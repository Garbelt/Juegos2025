

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
  const questionImageVertical =  document.getElementById('questionImage-vertical');
  const imageCell = document.getElementById('image-cell');
  const timeAcumuladoElement = document.getElementById('timeAcumulado');
  const timeAcumuladoElementVertical = document.getElementById('timeAcumulado-vertical');
  const puntajeElement = document.getElementById('puntaje');
  const puntajeElementVertical = document.getElementById('puntaje-vertical');
  const fallidosElement = document.getElementById('fallidos');
  const fallidosElementVertical = document.getElementById('fallidos-vertical');
  const audioTictac = document.getElementById('audio-tictac');
  let questionAudioPlayer = null;
  let audioPaused = false;

  const actualUsername = localStorage.getItem("ActualUs") || "Invitado";
  document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;

  const questions =
 
 [
  {
    "question": "¿CÓMO SE LLAMA EL MONUMENTO QUE SE OBSERVA EN LA IMAGEN?",
    "type": "image",
    "options": [
      {
        "text": "MONUMENTO A LA BANDERA",
        "correct": true,
        "audio": "audio/MONUMENTO A LA BANDERA.mp3"
      },
      {
        "text": "OBELISCO DE BUENOS AIRES",
        "correct": false,
        "audio": "audio/OBELISCO DE BUENOS AIRES.mp3"
      },
      {
        "text": "CABILDO DE BUENOS AIRES",
        "correct": false,
        "audio": "audio/CABILDO DE BUENOS AIRES.mp3"
      },
      {
        "text": "MONUMENTO DE LA INDEPENDENCIA",
        "correct": false,
        "audio": "audio/MONUMENTO DE LA INDEPENDENCIA.mp3"
      },
      {
        "text": "MONUMENTO A LOS CAÍDOS EN LA GUERRA DE MALVINAS",
        "correct": false,
        "audio": "audio/MONUMENTO A LOS CAÍDOS EN LA GUERRA DE MALVINAS.mp3"
      }
    ],
    "image": "image/imagen01.jpg"
  },
  {
    "question": "¿POR QUÉ EL 20 DE JUNIO SE CELEBRA EL DÍA DE LA BANDERA?",
    "type": "simple",
    "options": [
      {
        "text": "PORQUE UN 20 DE JUNIO SE IZÓ POR PRIMERA VEZ",
        "correct": false,
        "audio": "audio/PORQUE UN 20 DE JUNIO SE IZÓ POR PRIMERA VEZ.mp3"
      },
      {
        "text": "PORQUE ESE DÍA FALLECIÓ SU CREADOR",
        "correct": true,
        "audio": "audio/PORQUE ESE DÍA FALLECIÓ SU CREADOR.mp3"
      },
      {
        "text": "PORQUE ESE DÍA NACIÓ SU CREADOR",
        "correct": false,
        "audio": "audio/PORQUE ESE DÍA NACIÓ SU CREADOR.mp3"
      },
      {
        "text": "PORQUE EL 20 DE JUNIO SE USÓ POR PRIMERA VEZ LA ESCARAPELA",
        "correct": false,
        "audio": "audio/PORQUE EL 20 DE JUNIO SE USÓ POR PRIMERA VEZ LA ESCARAPELA.mp3"
      }
    ]
  },
  {
    "question": "¿EN QUE AÑO SE IZÓ POR PRIMERA VEZ LA BANDERA NACIONAL ARGENTINA?",
    "type": "simple",
    "options": [
      {
        "text": "EN 1812",
        "correct": true,
        "audio": "audio/EN 1812.mp3"
      },
      {
        "text": "EN 1810",
        "correct": false,
        "audio": "audio/EN 1810.mp3"
      },
      {
        "text": "EN 1816",
        "correct": false,
        "audio": "audio/EN 1816.mp3"
      },
      {
        "text": "EN 1806",
        "correct": false,
        "audio": "audio/EN 1806.mp3"
      },
      {
        "text": "EN 1820",
        "correct": false,
        "audio": "audio/EN 1820.mp3"
      }
    ]
  },
  {
    "question": "¿QUIÉN FUE EL CREADOR DE LA BANDERA?",
    "type": "image",
    "options": [
      {
        "text": "MANUEL BELGRANO",
        "correct": true,
        "audio": "audio/MANUEL BELGRANO.mp3"
      },
      {
        "text": "JOSÉ DE SAN MARTÍN",
        "correct": false,
        "audio": "audio/JOSÉ DE SAN MARTÍN.mp3"
      },
      {
        "text": "DANIEL BELGRANO",
        "correct": false,
        "audio": "audio/DANIEL BELGRANO.mp3"
      },
      {
        "text": "MARTÍN MIGUEL DE GÜEMES",
        "correct": false,
        "audio": "audio/MARTÍN MIGUEL DE GÜEMES.mp3"
      },
      {
        "text": "DOMINGO FAUSTINO SARMIENTO",
        "correct": false,
        "audio": "audio/DOMINGO FAUSTINO SARMIENTO.mp3"
      }
    ],
    "image": "image/imagen04.jpg"
  },
  {
    "question": "¿DÓNDE SE IZÓ POR PRIMERA VEZ NUESTRA BANDERA?",
    "type": "imageChange",
    "options": [
      {
        "text": "EN ROSARIO",
        "correct": true,
        "audio": "audio/EN ROSARIO.mp3"
      },
      {
        "text": "EN CÓRDOBA",
        "correct": false,
        "audio": "audio/EN CÓRDOBA.mp3"
      },
      {
        "text": "EN BUENOS AIRES",
        "correct": false,
        "audio": "audio/EN BUENOS AIRES.mp3"
      },
      {
        "text": "EN SANTA FE",
        "correct": false,
        "audio": "audio/EN SANTA FE.mp3"
      },
      {
        "text": "EN TUCUMÁN",
        "correct": false,
        "audio": "audio/EN TUCUMÁN.mp3"
      }
    ],
    "image": "image/imagen05.jpg",
    "secondImage": "image/imagen05_alt.jpg"
  },
  {
    "question": "¿CÓMO SE LLAMA LA CANCIÓN DE LA CUAL SE LEE UN FRAGMENTO EN LA IMAGEN?",
    "type": "imageaudio",
    "options": [
      {
        "text": "HIMNO NACIONAL ARGENTINO",
        "correct": false,
        "audio": "audio/HIMNO NACIONAL ARGENTINO.mp3"
      },
      {
        "text": "SALUDO A LA BANDERA",
        "correct": false,
        "audio": "audio/SALUDO A LA BANDERA.mp3"
      },
      {
        "text": "MARCHA DE LA BANDERA",
        "correct": true,
        "audio": "audio/MARCHA DE LA BANDERA.mp3"
      },
      {
        "text": "MARCHA DE SAN LORENZO",
        "correct": false,
        "audio": "audio/MARCHA DE SAN LORENZO.mp3"
      },
      {
        "text": "AURORA",
        "correct": false,
        "audio": "audio/AURORA.mp3"
      }
    ],
    "image": "image/imagen06.jpg",
    "birdAudio": "audio/06AudioImage.mp3"
  },
  {
    "question": "¿EN QUÉ AÑO FALLECIÓ MANUEL BELGRANO?",
    "type": "simple",
    "options": [
      {
        "text": "EN 1826",
        "correct": false,
        "audio": "audio/EN 1826.mp3"
      },
      {
        "text": "EN 1816",
        "correct": false,
        "audio": "audio/EN 1816.mp3"
      },
      {
        "text": "EN 1820",
        "correct": true,
        "audio": "audio/EN 1820.mp3"
      },
      {
        "text": "EN 1850",
        "correct": false,
        "audio": "audio/EN 1850.mp3"
      },
      {
        "text": "EN 1810",
        "correct": false,
        "audio": "audio/EN 1810.mp3"
      }
    ]
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
  const options =
    optionsElement.querySelectorAll('li');
  options.forEach(option => {
    option.style.pointerEvents = 'none';
  });
  questionElement.style.pointerEvents =
    'none';
  questionElement.style.cursor =
    'default';
  questionImage.style.pointerEvents =
    'none';
  if (questionImageVertical) {
  questionImageVertical.style.pointerEvents = 'none';
}
  /* =========================
     BOTÓN PARLANTE HORIZONTAL
     ========================= */
  const speakerButton =
    document.getElementById(
      'speaker-button'
    );
  if (speakerButton) {
    speakerButton.style.pointerEvents =
      'none';
    speakerButton.style.opacity =
      '0.4';
    speakerButton.onclick = null;
  }
  /* =========================
     BOTÓN PARLANTE VERTICAL
     ========================= */
  const speakerButtonVertical =
    document.getElementById(
      'speaker-button-vertical'
    );
  if (speakerButtonVertical) {
    speakerButtonVertical.style.pointerEvents =
      'none';
    speakerButtonVertical.style.opacity =
      '0.4';
    speakerButtonVertical.onclick = null;
  }
}

function setEstadoBotonLector(habilitado) {
    const boton = document.getElementById("lectorButton");
    const mobileBtn = document.getElementById("mobile-read-btn");
    if (boton) {
        boton.style.pointerEvents =
            habilitado ? "auto" : "none";
    }
    if (mobileBtn) {
        // CRÍTICO: nunca usar disabled
        mobileBtn.disabled = false;
        mobileBtn.style.pointerEvents =
            habilitado ? "auto" : "none";
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
          if (timeAcumuladoElementVertical) {timeAcumuladoElementVertical.textContent = formatearTiempo(tiempoTotalSegundos);}
      }, 1000);
  }

  function detenerTiempoAcumulado() {
      clearInterval(intervaloTiempoAcumulado);
  }

function actualizarRelojGrafico(
  tiempoRestante,
  tiempoTotal = 15
) {
  const porcentaje =
    (tiempoRestante / tiempoTotal) * 100;
  const porcentajeInvertido =
    100 - porcentaje;
  const reloj =
    document.getElementById('reloj');
  const relojVertical =
    document.getElementById('reloj-vertical');
  const gradiente =
    `conic-gradient(from 0deg at 50% 50%,
     #2ecc71 ${porcentajeInvertido}%,
     #ecf0f1 ${porcentajeInvertido}%)`;
  if (reloj) {
    reloj.style.background = gradiente;
    reloj.textContent = `${tiempoRestante}`;
  }
  if (relojVertical) {
    relojVertical.style.background = gradiente;
    relojVertical.textContent = `${tiempoRestante}`;
  }
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
    if (birdAudioPlayer) {fadeOutAndStopAudio(birdAudioPlayer);}
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    audioTictac.pause();
    detenerTiempoAcumulado();
    disableOptions();

    errores++;
    fallidosElement.textContent = `${errores}/${MAX_ERRORES}`;
    if (fallidosElementVertical) {fallidosElementVertical.textContent = `${errores}/${MAX_ERRORES}`;}
    
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
  if (!sistemaListo) return; // 🛑 evita doble activación
  if(questionAudioPlayer) questionAudioPlayer.pause();
  if (birdAudioPlayer) {fadeOutAndStopAudio(birdAudioPlayer);}
  clearInterval(intervaloTemporizador);
  audioTictac.pause();
  detenerTiempoAcumulado();

  sistemaListo = false; // 🔴 Bloqueo total de interacción
  disableOptions(); // ahora también deshabilita título, imagen y botón parlante
  setEstadoBotonLector(false);

  const correct = event.target.dataset.correct === 'true';

  if (correct) {
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    puntaje += 25;
    score += 25;
    puntajeElement.textContent = `${puntaje}`;
    if (puntajeElementVertical) {puntajeElementVertical.textContent = `${puntaje}`;}
    
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
    fallidosElement.textContent = `${errores}/${MAX_ERRORES}`;
    if (fallidosElementVertical) {fallidosElementVertical.textContent = `${errores}/${MAX_ERRORES}`;}
    
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
  questionElement.style.pointerEvents =
    'none';
  questionElement.style.cursor =
    'default';
  questionImage.style.pointerEvents =
    'none';

  /* =========================
     BOTÓN PARLANTE HORIZONTAL
     ========================= */
  const speakerButton =
    document.getElementById(
      'speaker-button'
    );
  if (speakerButton) {
    speakerButton.style.pointerEvents =
      'none';
    speakerButton.style.opacity =
      '0.4';
    speakerButton.onclick = null;
  }

  /* =========================
     BOTÓN PARLANTE VERTICAL
     ========================= */
  const speakerButtonVertical =
    document.getElementById(
      'speaker-button-vertical'
    );
  if (speakerButtonVertical) {
    speakerButtonVertical.style.pointerEvents =
      'none';
    speakerButtonVertical.style.opacity =
      '0.4';
    speakerButtonVertical.onclick = null;
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
  document.body.classList.add(
    "disable-clicks"
  );
  message.style.display = "block";
  message.style.zIndex = "9999";

  fadeOutAudio(
    document.getElementById(
      'background-music'
    ),
    4000
  );

  const audioFin =
    new Audio(
      "sounds/finporintentos.mp3"
    );

  audioFin.play();
  setTimeout(() => {
    endGame();
    almacenarRegistroConZ(score);
    window.location.href =
      "out.html";
  }, 7000);
}

function showMessagexExito() {
  // Deshabilitar clics en opciones y otros elementos clave
  disableOptions();
  questionElement.style.pointerEvents = 'none';
  questionElement.style.cursor = 'default';
  questionImage.style.pointerEvents = 'none';
  /* =========================
     BOTÓN PARLANTE HORIZONTAL
     ========================= */
  const speakerButton =
    document.getElementById(
      'speaker-button'
    );
  if (speakerButton) {
    speakerButton.style.pointerEvents =
      'none';
    speakerButton.style.opacity =
      '0.4';
    speakerButton.onclick = null;
  }
  /* =========================
     BOTÓN PARLANTE VERTICAL
     ========================= */
  const speakerButtonVertical =
    document.getElementById(
      'speaker-button-vertical'
    );
  if (speakerButtonVertical) {
    speakerButtonVertical.style.pointerEvents =
      'none';
    speakerButtonVertical.style.opacity =
      '0.4';
    speakerButtonVertical.onclick = null;
  }
  let bonus =
    Math.floor(
      (score - tiempoTotalSegundos) /
      (errores + 1)
    );
  if (bonus < 0)
    bonus = 0;
  score += bonus;
  const message =
    document.createElement("div");
  message.classList.add(
    "found-message"
  );
  message.innerHTML = `
    <div style="font-weight: bold; font-size: 32px;">
      ¡FELICITACIONES!
    </div>
    <div style="font-size: 24px;">
      Has completado el juego.
    </div>
    <div style="margin-top: 10px; font-size: 20px;">
      Puntaje final: ${score} (Bonus: ${bonus})
    </div>
  `;
  document.body.appendChild(message);
  document.body.classList.add(
    "disable-clicks"
  );
  message.style.display =
    "block";
  message.style.zIndex =
    "9999";
  fadeOutAudio(
    document.getElementById(
      'background-music'
    ),
    4000
  );
  const audioFin =
    new Audio(
      "sounds/finporcompletar.mp3"
    );
  audioFin.play();
  setTimeout(() => {
    endGame();
    almacenarRegistroConZ(score);
    window.location.href =
      "out.html";
  }, 7000);
}


  function endGame() {
    const currentDate = new Date().toLocaleDateString();
    const userData = {
      fecha: currentDate,
      usuario: localStorage.getItem("ActualUs"),
      puntaje: score,
      juegonumero: incrementGameNumber(),
      game: "BNDR_trv",
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
  sistemaListo = false; // 🔴 BLOQUEO INICIAL INMEDIATO
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

/* =========================
   RESET BOTÓN PARLANTE HORIZONTAL
   ========================= */

const speakerButton = document.getElementById('speaker-button');
if (speakerButton) {speakerButton.style.display = 'none';
  speakerButton.onclick = null;
  speakerButton.style.pointerEvents = 'none';
  speakerButton.style.opacity = '0.4';
}

/* =========================
   RESET BOTÓN PARLANTE VERTICAL
   ========================= */
const speakerButtonVertical = document.getElementById('speaker-button-vertical');
if (speakerButtonVertical) {speakerButtonVertical.style.display = 'none';
  speakerButtonVertical.onclick = null;
  speakerButtonVertical.style.pointerEvents = 'none';
  speakerButtonVertical.style.opacity = '0.4';
}

if (currentQuestion.type === 'imageaudio') {
  if (currentQuestion.image) {
    /* =========================
       IMAGEN HORIZONTAL
       ========================= */
    questionImage.style.display = 'block';
    imageCell.style.display = 'table-cell';
    questionImage.src = currentQuestion.image;
    questionImage.style.cursor = 'default';
    /* =========================
       IMAGEN VERTICAL (sincronizada)
       ========================= */
    if (questionImageVertical) {
      questionImageVertical.src =
        currentQuestion.image;
      questionImageVertical.style.display =
        'block';
      questionImageVertical.style.pointerEvents =
        'none';
    }
/* =========================
   BOTÓN DE AUDIO
   ========================= */
speakerButton.style.display = 'block';
if (speakerButtonVertical) {
  speakerButtonVertical.style.display = 'block';
}
speakerButton._playAudioFunc = () => {
  if (currentQuestion.birdAudio) {
    if (birdAudioPlayer) {
      birdAudioPlayer.pause();
      birdAudioPlayer.currentTime = 0;
    }
    birdAudioPlayer =
      new Audio(currentQuestion.birdAudio);
    birdAudioPlayer.volume = 1;
    birdAudioPlayer.play().catch(e =>
      console.log(
        "No se pudo reproducir audio:",
        e
      )
    );
  }
};
  } else {
    /* =========================
       OCULTAR HORIZONTAL
       ========================= */
    imageCell.style.display = 'none';
    questionImage.style.display = 'none';
    questionImage.src = '';
    /* =========================
       OCULTAR VERTICAL
       ========================= */
    if (questionImageVertical) {
      questionImageVertical.src = '';
      questionImageVertical.style.display =
        'none';
    }
    /* =========================
       OCULTAR BOTÓN AUDIO
       ========================= */
    speakerButton.style.display = 'none';
  }
} else {
if (currentQuestion.image) {
  /* horizontal */
  questionImage.style.display = 'block';
  imageCell.style.display = 'table-cell';
  questionImage.src = currentQuestion.image;
  questionImage.style.pointerEvents = 'none';
  /* vertical */
  if (questionImageVertical) {
    questionImageVertical.src = currentQuestion.image;
    questionImageVertical.style.display = 'block';
    questionImageVertical.style.pointerEvents = 'none';
  }
} else {
  /* horizontal */
  questionImage.style.display = 'none';
  imageCell.style.display = 'none';
  questionImage.src = '';
  /* vertical */
  if (questionImageVertical) {
    questionImageVertical.src = '';
    questionImageVertical.style.display = 'none';
  }
}
  }

  questionImage.dataset.birdAudio = currentQuestion.birdAudio || '';
  questionImage.dataset.secondImage = currentQuestion.secondImage || '';
  if (questionImageVertical) {questionImageVertical.dataset.secondImage = currentQuestion.secondImage || '';}

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

     setTimeout(() => {
          sistemaListo = true;
     }, 350);

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
const estadoPrevio =
  typeof lecturaActiva !== "undefined"
    ? lecturaActiva
    : true;

setEstadoBotonLector(false);
lecturaActiva = true;

const container = document.querySelector(".container");
if (container) {
  if (container.classList.contains("container-invisible")) {
    container.classList.remove("container-invisible");
  }
}
    
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
  /* =========================
     BOTÓN PARLANTE HORIZONTAL
     ========================= */
  const speakerButton =
    document.getElementById('speaker-button');
  speakerButton.style.pointerEvents =
    'auto';
  speakerButton.style.opacity =
    '1';
  speakerButton.onclick =
    speakerButton._playAudioFunc || null;
  /* =========================
     BOTÓN PARLANTE VERTICAL
     ========================= */
  const speakerButtonVertical =
    document.getElementById(
      'speaker-button-vertical'
    );
  if (speakerButtonVertical) {
    speakerButtonVertical.style.pointerEvents =
      'auto';
    speakerButtonVertical.style.opacity =
      '1';
    speakerButtonVertical.onclick =
      speakerButton._playAudioFunc || null;
  }
  // Activar imagen y cursor
  questionImage.style.pointerEvents = 'auto';
  if (questionImageVertical) {questionImageVertical.style.pointerEvents = 'auto';}
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

function handleImageChangeClick() {
  const currentQuestion =
    questions[currentQuestionIndex];
  if (currentQuestion.type !== 'imageChange')
    return;
  const secondImageSrc =
    questionImage.dataset.secondImage;
  if (!secondImageSrc)
    return;
  const originalImageSrc =
    questionImage.src;
  /* cambiar ambas */
  questionImage.src =
    secondImageSrc;
  if (questionImageVertical) {
    questionImageVertical.src =
      secondImageSrc;
  }
  setTimeout(() => {
    questionImage.src =
      originalImageSrc;
    if (questionImageVertical) {
      questionImageVertical.src =
        originalImageSrc;
    }
  }, 3000);
}

// Listener para click en la imagen
questionImage.addEventListener(
  'click',
  handleImageChangeClick
);
if (questionImageVertical) {
  questionImageVertical.addEventListener(
    'click',
    handleImageChangeClick
  );
}
}); 


