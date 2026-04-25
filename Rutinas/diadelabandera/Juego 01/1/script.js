

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const questionElement = document.getElementById('question');

  const optionsElement = document.getElementById('options');
  const messageElement = document.getElementById('message');
  const questionImage = document.getElementById('questionImage');
  const questionImageVertical = document.getElementById('questionImage-vertical');
  const imageCell = document.getElementById('image-cell');

  let questionAudioPlayer = null;
  let audioPaused = false;
  let birdAudioPlayer = null;

  const actualUsername = localStorage.getItem("ActualUs") || "Invitado";
  document.getElementById("actualUsername").textContent = `Usuario: ${actualUsername}`;

  const questions = [
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
        "text": "EN MENDOZA",
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
]

  let currentQuestionIndex = 0;
  let primeraPregunta = true;

questionElement.addEventListener("click", () => {
  const currentQuestion =
    questions[currentQuestionIndex];
  if (!currentQuestion) return;
  const estadoPrevio = lecturaActiva;
  // 🔒 Bloquear botón lector
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

  // Bloquear imagen horizontal
  questionImage.style.pointerEvents = 'none';

  // Bloquear imagen vertical
  if (questionImageVertical) {
    questionImageVertical.style.pointerEvents = 'none';
  }

  const speakerButton =
    document.getElementById('speaker-button');

  if (speakerButton) {
    speakerButton.style.pointerEvents = 'none';
    speakerButton.style.opacity = '0.4';
    speakerButton.onclick = null;
  }

  const speakerButtonVertical =
    document.getElementById('speaker-button-vertical');

  if (speakerButtonVertical) {
    speakerButtonVertical.style.pointerEvents = 'none';
    speakerButtonVertical.style.opacity = '0.4';
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

  // Mientras el mensaje esté visible, deshabilitamos toda interacción
  disableOptions();
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

function handleOptionClick(event) {
  if (!sistemaListo) return; // 🛑 evita doble activación
  if(questionAudioPlayer) questionAudioPlayer.pause();
  if (birdAudioPlayer) {fadeOutAndStopAudio(birdAudioPlayer);}
  
  sistemaListo = false; // 🔴 Bloqueo total de interacción
  disableOptions();
  setEstadoBotonLector(false);

  const correct = event.target.dataset.correct === 'true';

  if (correct) {
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    showMessage('CORRECTO', 'correct');
    setTimeout(() => {
      messageElement.style.display = 'none';
      questions.splice(currentQuestionIndex, 1);
if (questions.length === 0) {

  // Detener o desvanecer la música de la pregunta
  fadeOutAudio(
    document.getElementById('audio-musica-pregunta'),
    4000
  );

  // Mostrar mensaje final
  messageElement.textContent = '¡FIN DEL JUEGO!';
  messageElement.className = 'found-message fin';
  messageElement.style.display = 'block';

  // Deshabilitar interacción (coherente con el resto del sistema)
  disableOptions();
  setEstadoBotonLector(false);

  // 🔊 Reproducir audio final
  const audioFin = new Audio("sounds/fin_trivia.mp3");
  audioFin.volume = 1;
  audioFin.play().catch(e =>
    console.log("No se pudo reproducir audio final:", e)
  );

  prepararProximaPagina();

  // Esperar a que termine el audio antes de redirigir
  setTimeout(() => {
    window.location.href = "../2/2.html";
  }, 6000);
} else {
        if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
        loadQuestion();
      }
    }, 3000);
  } else {
    fadeOutAudio(document.getElementById('audio-musica-pregunta'), 2000);
    showMessage('ERROR', 'error');
    setTimeout(() => {
      messageElement.style.display = 'none';
      // Devuelve la pregunta al final
      questions.push(questions[currentQuestionIndex]);
      questions.splice(currentQuestionIndex, 1);
      if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
      loadQuestion();
    }, 2000);
  }
}

function prepararProximaPagina() {
    const nuevoA = Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("entrarA", nuevoA);
    localStorage.setItem("entrarB", nuevoA);
}

function iniciarInterfazPregunta() {
  // Habilitar opciones
  enableOptions();

  // Activar botón parlante
  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.pointerEvents = 'auto';
  speakerButton.style.opacity = '1';
  speakerButton.onclick = speakerButton._playAudioFunc || null;

  // Activar imagen y cursor
  questionImage.style.pointerEvents = 'auto';

  if (questionImageVertical) {
    questionImageVertical.style.pointerEvents = 'auto';
  }

  questionElement.style.cursor = 'pointer';

  // 🔊 INICIAR MÚSICA DE LA PREGUNTA
  const musicaPregunta =
    document.getElementById('audio-musica-pregunta');

  if (musicaPregunta) {
    musicaPregunta.volume = 1;
    musicaPregunta.currentTime = 0;
    musicaPregunta.play().catch(e =>
      console.log(
        'No se pudo reproducir música de pregunta:',
        e
      )
    );
  }
}

function handleImageChangeClick() {
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion || currentQuestion.type !== 'imageChange') return;
  const secondImageSrc = questionImage.dataset.secondImage;
  if (!secondImageSrc) return;
  const originalImageSrc = questionImage.src;
  // Cambiar ambas imágenes (horizontal + vertical)
  questionImage.src = secondImageSrc;
  if (questionImageVertical) {
    questionImageVertical.src = secondImageSrc;
  }
  setTimeout(() => {
    questionImage.src = originalImageSrc;

    if (questionImageVertical) {
      questionImageVertical.src = originalImageSrc;
    }
  }, 3000);
}

function loadQuestion() {
  sistemaListo = false;

  if (questionAudioPlayer) {
    questionAudioPlayer.pause();
  }

  if (birdAudioPlayer) {
    birdAudioPlayer.currentTime = 0;
  }

  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = '';

  // =========================
  // RESET IMAGEN (HORIZONTAL + VERTICAL)
  // =========================
  questionImage.style.display = 'none';
  questionImage.src = '';
  questionImage.onclick = null;
  questionImage.style.pointerEvents = 'none';

  if (questionImageVertical) {
    questionImageVertical.style.display = 'none';
    questionImageVertical.src = '';
    questionImageVertical.onclick = null;
    questionImageVertical.style.pointerEvents = 'none';
  }

  if (imageCell) {
    imageCell.style.display = 'none';
  }

  // =========================
  // RESET SPEAKER
  // =========================
  const speakerButton =
    document.getElementById('speaker-button');

  if (speakerButton) {
    speakerButton.style.display = 'none';
    speakerButton.onclick = null;
    speakerButton.style.pointerEvents = 'none';
    speakerButton.style.opacity = '0.4';
  }

  const speakerButtonVertical =
    document.getElementById('speaker-button-vertical');

  if (speakerButtonVertical) {
    speakerButtonVertical.style.display = 'none';
    speakerButtonVertical.onclick = null;
    speakerButtonVertical.style.pointerEvents = 'none';
    speakerButtonVertical.style.opacity = '0.4';
  }

  // =========================
  // RENDER IMAGEN (HORIZONTAL + VERTICAL)
  // =========================
  if (currentQuestion.image) {
    if (imageCell) imageCell.style.display = 'table-cell';

    questionImage.style.display = 'block';
    questionImage.src = currentQuestion.image;

    if (questionImageVertical) {
      questionImageVertical.style.display = 'block';
      questionImageVertical.src = currentQuestion.image;
    }
  }

  // =========================
  // SPEAKER AUDIO
  // =========================
  if (currentQuestion.type === 'imageaudio') {

    if (speakerButton) {
      speakerButton.style.display = 'block';
    }

    if (speakerButtonVertical) {
      speakerButtonVertical.style.display = 'block';
    }

    speakerButton._playAudioFunc = () => {
      if (!currentQuestion.birdAudio) return;

      if (birdAudioPlayer) {
        birdAudioPlayer.pause();
        birdAudioPlayer.currentTime = 0;
      }

      birdAudioPlayer = new Audio(currentQuestion.birdAudio);
      birdAudioPlayer.volume = 1;

      birdAudioPlayer.play().catch(e =>
        console.log("No se pudo reproducir audio:", e)
      );
    };

    speakerButton.onclick = speakerButton._playAudioFunc;

    if (speakerButtonVertical) {
      speakerButtonVertical.onclick =
        speakerButton._playAudioFunc;
    }
  }

// =========================
// DATASETS
// =========================
  
questionImage.dataset.birdAudio =
  currentQuestion.birdAudio || '';
questionImage.dataset.secondImage =
  currentQuestion.secondImage || '';
questionImage.onclick = null;
if (questionImageVertical) {
  questionImageVertical.onclick = null;
}

  // =========================
  // OPCIONES
  // =========================
  shuffleArray(currentQuestion.options);

  currentQuestion.options.forEach((option) => {
    const li = document.createElement('li');
    li.textContent = option.text;
    li.dataset.correct = option.correct;
    li.style.pointerEvents = 'none';

    li.addEventListener('click', handleOptionClick);

    li.addEventListener('mouseover', () => {
      if (!audioPaused) {
        hablar(option.text);
      }
    });

    optionsElement.appendChild(li);
  });

  // =========================
  // ACTIVACIÓN DEL SISTEMA
  // =========================
  setTimeout(() => {
    sistemaListo = true;
  }, 350);

  const estadoPrevio =
    typeof lecturaActiva !== "undefined"
      ? lecturaActiva
      : true;

  setEstadoBotonLector(false);
  lecturaActiva = true;

  const container = document.querySelector(".container");

  if (container?.classList.contains("container-invisible")) {
    container.classList.remove("container-invisible");
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

  // 🛟 fallback móvil
  setTimeout(() => {
    if (!lecturaTerminada) {
      console.log("⚠️ Fallback lectura");
      finalizarLectura();
    }
  }, 2500);
} // ← cierre de loadQuestion

  window.loadQuestion = loadQuestion;

questionImage.addEventListener('click', handleImageChangeClick);
if (questionImageVertical) {
  questionImageVertical.addEventListener('click', handleImageChangeClick);
}

// 🔊 Si se cancela la lectura, reactivar la interfaz del juego
const lectorBtn = document.getElementById("lectorButton");

if (lectorBtn) {
 lectorBtn.addEventListener("click", () => {
  // esperar a que lector.js actualice lecturaActiva
  requestAnimationFrame(() => {
    if (!lecturaActiva) {
      // Reactivar la interfaz del juego
      enableOptions();
      questionElement.style.pointerEvents = "auto";
      questionElement.style.cursor = "pointer";
      questionImage.style.pointerEvents = "auto";
      const speakerButton =
        document.getElementById("speaker-button");
      if (speakerButton) {
        speakerButton.style.pointerEvents = "auto";
        speakerButton.style.opacity = "1";
        speakerButton.onclick =
          speakerButton._playAudioFunc || null;
      }
    }
  });
});
}
});


