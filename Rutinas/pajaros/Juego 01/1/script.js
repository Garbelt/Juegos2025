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

    const speakerButtonVertical =
      document.getElementById('speaker-button-vertical');

    if (speakerButtonVertical) {
      speakerButtonVertical.style.pointerEvents = 'none';
      speakerButtonVertical.style.opacity = '0.4';
      speakerButtonVertical.onclick = null;
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

  function loadQuestion() {

    const currentQuestion =
      questions[currentQuestionIndex];

    questionElement.textContent =
      currentQuestion.question;

    optionsElement.innerHTML = '';

    // Reset imágenes

    questionImage.style.display = 'none';
    questionImage.src = '';
    questionImage.style.pointerEvents = 'none';

    if (questionImageVertical) {
      questionImageVertical.style.display = 'none';
      questionImageVertical.src = '';
      questionImageVertical.style.pointerEvents = 'none';
    }

    // Reset botones

    const speakerButton =
      document.getElementById('speaker-button');

    const speakerButtonVertical =
      document.getElementById('speaker-button-vertical');

    if (speakerButton) {
      speakerButton.style.display = 'none';
      speakerButton.onclick = null;
      speakerButton.style.pointerEvents = 'none';
      speakerButton.style.opacity = '0.4';
    }

    if (speakerButtonVertical) {
      speakerButtonVertical.style.display = 'none';
      speakerButtonVertical.onclick = null;
      speakerButtonVertical.style.pointerEvents = 'none';
      speakerButtonVertical.style.opacity = '0.4';
    }

    if (currentQuestion.type === 'imageaudio') {

      if (currentQuestion.image) {

        questionImage.style.display = 'block';
        questionImage.src =
          currentQuestion.image;

        if (questionImageVertical) {
          questionImageVertical.style.display = 'block';
          questionImageVertical.src =
            currentQuestion.image;
        }

        imageCell.style.display =
          'table-cell';

        // DEFINIR FUNCIÓN PRIMERO

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
              console.log("No se pudo reproducir audio:", e)
            );

          }

        };

        speakerButton.style.display =
          'block';

        speakerButton.onclick =
          speakerButton._playAudioFunc;

        if (speakerButtonVertical) {

          speakerButtonVertical.style.display =
            'block';

          speakerButtonVertical._playAudioFunc =
            speakerButton._playAudioFunc;

          speakerButtonVertical.onclick =
            speakerButton._playAudioFunc;

        }

      }

    } else {

      if (currentQuestion.image) {

        questionImage.style.display =
          'block';

        questionImage.src =
          currentQuestion.image;

        if (questionImageVertical) {

          questionImageVertical.style.display =
            'block';

          questionImageVertical.src =
            currentQuestion.image;

        }

        imageCell.style.display =
          'table-cell';

      } else {

        imageCell.style.display =
          'none';

      }

    }

    shuffleArray(currentQuestion.options);

    currentQuestion.options.forEach(option => {

      const li =
        document.createElement('li');

      li.textContent =
        option.text;

      li.dataset.correct =
        option.correct;

      li.style.pointerEvents =
        'auto';

      optionsElement.appendChild(li);

    });

  }

  window.loadQuestion =
    loadQuestion;

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
