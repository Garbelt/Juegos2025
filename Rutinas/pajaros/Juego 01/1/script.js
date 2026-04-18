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
  messageElement.textContent = '¡Fin de la trivia!';
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
  // Asignar función de reproducción si existe
  speakerButton.onclick = speakerButton._playAudioFunc || null;

  // Activar imagen y cursor
  questionImage.style.pointerEvents = 'auto';
  questionElement.style.cursor = 'pointer';

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

    speakerButton.onclick =
      speakerButton._playAudioFunc;
  }

} else {

  if (currentQuestion.image) {
    questionImage.style.display = 'block';
    imageCell.style.display = 'table-cell';
    questionImage.src = currentQuestion.image;
  } else {
    imageCell.style.display = 'none';
  }

}

    questionImage.dataset.birdAudio = currentQuestion.birdAudio || '';
    questionImage.dataset.secondImage = currentQuestion.secondImage || '';

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
