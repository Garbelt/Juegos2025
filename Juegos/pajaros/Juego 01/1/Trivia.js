document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const messageElement = document.getElementById('message');
  const toggleButton = document.getElementById('toggleButton');
  const questionImage = document.getElementById('questionImage');
  const imageCell = document.getElementById('image-cell');

  let questionAudioPlayer = null;
  let optionAudioPlayers = [];
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

  let currentQuestionIndex = 0;

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

  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.pointerEvents = 'none';
  speakerButton.style.opacity = '0.4';
  speakerButton.onclick = null;
}

function enableOptions() {
  const options = optionsElement.querySelectorAll('li');
  options.forEach(option => {
      option.style.pointerEvents = 'auto';
  });
  questionElement.style.pointerEvents = 'auto';
  questionElement.style.cursor = 'pointer';

  questionImage.style.pointerEvents = 'auto';

  const speakerButton = document.getElementById('speaker-button');
  speakerButton.style.pointerEvents = 'auto';
  speakerButton.style.opacity = '1';
  speakerButton.onclick = speakerButton._playAudioFunc || null;
}

  function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(error => console.error('Audio playback failed:', error));
    return audio;
  }

  function playOptionAudio(event) {
    if (!audioPaused) {
      const audioSrc = event.target.dataset.audio;
      optionAudioPlayers.push(playAudio(audioSrc));
    }
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

function handleOptionClick(event) {
  optionAudioPlayers.forEach(player => player.pause());
  if(questionAudioPlayer) questionAudioPlayer.pause();
  disableOptions();

  const correct = event.target.dataset.correct === 'true';

  if (correct) {
    showMessage('CORRECTO', 'correct');
    setTimeout(() => {
      messageElement.style.display = 'none';
      questions.splice(currentQuestionIndex, 1);
if (questions.length === 0) {
  // Mostrar mensaje final
  messageElement.textContent = '¡Fin de la trivia!';
  messageElement.className = 'found-message fin';
  messageElement.style.display = 'block';
  
  prepararProximaPagina();
  // Redirigir después de unos segundos
  setTimeout(() => {
    window.location.href = "../../catalogo.html"; // ← aquí ponés tu destino
  }, 4000); // tiempo en milisegundos (4 segundos)
} else {
        if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;
        loadQuestion();
      }
    }, 3000);
  } else {
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

  function loadQuestion() {
    if (questionAudioPlayer) {
      questionAudioPlayer.pause();
      questionAudioPlayer.removeEventListener('ended', onQuestionAudioEnded);
    }

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
            const audio = new Audio(currentQuestion.birdAudio);
            audio.play();
          }
        };
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

    questionImage.dataset.secondImage = currentQuestion.secondImage || '';

    shuffleArray(currentQuestion.options);
    currentQuestion.options.forEach((option) => {
      const li = document.createElement('li');
      li.textContent = option.text;
      li.dataset.correct = option.correct;
      li.dataset.audio = option.audio;
      li.style.pointerEvents = 'none';
      li.addEventListener('click', handleOptionClick);
      li.addEventListener('mouseover', playOptionAudio);
      optionsElement.appendChild(li);
    });

    questionAudioPlayer = new Audio(currentQuestion.audio);

    function onQuestionAudioEnded() {
      enableOptions();
      questionImage.style.pointerEvents = 'auto';
      speakerButton.style.pointerEvents = 'auto';
      speakerButton.style.opacity = '1';
      speakerButton.onclick = speakerButton._playAudioFunc || null;
      questionElement.style.cursor = 'pointer';
      questionElement.onclick = () => {
        const audioCopy = new Audio(currentQuestion.audio);
        audioCopy.play().catch(console.error);
      };
    }

    questionAudioPlayer.addEventListener('ended', onQuestionAudioEnded);
    questionAudioPlayer.play().catch(console.error);
  }

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

  document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("start-button-container").style.display = "none";
    toggleButton.style.display = "block";
    document.querySelector(".container").style.display = "flex";
    loadQuestion();
  });

  toggleButton.addEventListener('click', () => {
    audioPaused = !audioPaused;
    toggleButton.textContent = audioPaused ? 'Activar Lectura' : 'Cancelar Lectura';
  });

});
