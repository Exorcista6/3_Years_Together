// CONFIGURACIÓN DEL QUIZ
const quizQuestions = [
    {
        question: "¿Cuál es mi fecha de nacimiento?",
        type: "multiple",
        options: [
            "13 de noviembre de 1999",
            "13 de diciembre de 1999",
            "13 de noviembre de 1998",
            "14 de noviembre de 1999"
        ],
        correct: "13 de noviembre de 1999",
        successMsg: "Correcto, mi amor. Esa fecha inició mi historia, pero tú hiciste que muchas partes de ella tuvieran más sentido.",
        errorMsg: "Casi, mi amor… intenta una vez más ❤️"
    },
    {
        question: "¿Cómo se llama el parque donde te propuse ser mi enamorada?",
        type: "text",
        correct: ["parque abtao", "abtao"],
        successMsg: "Ese lugar siempre tendrá algo nuestro. Ahí empezó una parte muy bonita de esta historia.",
        errorMsg: "Estás cerquita, mi Solsito. Prueba otra vez ❤️"
    },
    {
        question: "¿Cuál es mi equipo favorito?",
        type: "multiple",
        options: [
            "Alianza Lima",
            "Universitario",
            "Sporting Cristal",
            "Melgar"
        ],
        correct: "Alianza Lima",
        successMsg: "Correcto. Y aunque mi corazón tiene equipo, tú tienes una parte mucho más grande de él.",
        errorMsg: "Casi, mi amor… intenta una vez más ❤️"
    },
    {
        question: "¿Cuál es la marca de moto que más me gustaría comprar próximamente?",
        type: "multiple",
        options: [
            "Royal Enfield",
            "Honda",
            "Yamaha",
            "Suzuki"
        ],
        correct: "Royal Enfield",
        successMsg: "Correcto. Tú conoces hasta esos sueños que todavía estoy construyendo.",
        errorMsg: "Casi, mi amor… esa no era. Intenta otra vez ❤️"
    },
    {
        question: "¿Cuál fue nuestro primer viaje juntos?",
        type: "multiple",
        options: [
            "Paracas",
            "Oxapampa",
            "Ilo"
        ],
        correct: "Paracas",
        successMsg: "Correcto. Ese viaje fue uno de esos recuerdos que se quedan guardados para siempre.",
        errorMsg: "Casi, mi amor… piensa en nuestro primer viaje juntos ❤️"
    },
    {
        question: "Escribe una banda que sabes que es de mis favoritas",
        type: "text",
        correct: ["slipknot"],
        successMsg: "Correcto. Me encanta que conozcas incluso esas partes de mí que hablan con música.",
        errorMsg: "Casi, mi amor… piensa en una banda que sabes que me representa mucho ❤️"
    }
];

// VARIABLES DE ESTADO
let currentScreen = 1;
let currentQuestionIndex = 0;
let touchedHearts = new Set();
const totalScreens = 13;

// ELEMENTOS DOM
const bgMusic = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');
const musicToggle = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.getElementById('progress-bar-container');
const quizContainer = document.getElementById('quiz-container');
const quizProgress = document.getElementById('quiz-progress');
const quizFeedback = document.getElementById('quiz-feedback');
const btnQuizNext = document.getElementById('btn-quiz-next');
const lockIcon = document.getElementById('lock-icon');

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateProgressBar();
});

// NAVEGACIÓN DE PANTALLAS
function nextScreen(screenNumber, startMusic = false) {
    const currentScreenEl = document.getElementById(`screen-${currentScreen}`);
    const nextScreenEl = document.getElementById(`screen-${screenNumber}`);

    if (!currentScreenEl || !nextScreenEl) return;

    if (startMusic) {
        playMusic();
        musicControl.classList.remove('hidden');
        progressBarContainer.classList.remove('hidden');
    }

    currentScreenEl.classList.remove('active');
    setTimeout(() => {
        nextScreenEl.classList.add('active');
        currentScreen = screenNumber;
        updateProgressBar();

        // Inicializar quiz si llegamos a la pantalla 9
        if (screenNumber === 9) {
            loadQuestion();
        }
        
        // Pausar música de fondo si llegamos al video final para que no interfiera
        if (screenNumber === 12) {
            pauseMusic();
        }
    }, 800);
}

function updateProgressBar() {
    const progress = (currentScreen / totalScreens) * 100;
    progressBar.style.width = `${progress}%`;
}

// CONTROL DE MÚSICA
function playMusic() {
    bgMusic.play().catch(e => console.log("Auto-play bloqueado por el navegador"));
    musicToggle.innerHTML = '<span class="icon">🔇</span>';
}

function pauseMusic() {
    bgMusic.pause();
    musicToggle.innerHTML = '<span class="icon">🎵</span>';
}

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
});

// PARTÍCULAS DE FONDO
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = `-20px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        container.appendChild(particle);
    }
}

// DINÁMICA DE CORAZONES (Pantalla 5)
function touchHeart(id, element) {
    touchedHearts.add(id);
    element.classList.add('active');

    if (touchedHearts.size === 3) {
        document.getElementById('btn-unlocked-memory').classList.remove('hidden');
    }
}

// LÓGICA DEL QUIZ (Pantalla 9)
function loadQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    quizProgress.innerText = `Llave ${currentQuestionIndex + 1}/6`;
    quizFeedback.classList.add('hidden');
    btnQuizNext.classList.add('hidden');
    
    let html = `<p class="quiz-question">${q.question}</p>`;

    if (q.type === "multiple") {
        html += `<div class="quiz-options">`;
        q.options.forEach(option => {
            html += `<button class="quiz-option" onclick='checkAnswer(${JSON.stringify(option)})'>${option}</button>`;
        });
        html += `</div>`;
    } else {
        html += `
            <input type="text" id="quiz-input" class="quiz-input" placeholder="Escribe tu respuesta aquí..." onkeydown="if(event.key === 'Enter') checkAnswer()">
            <button class="btn-primary" onclick="checkAnswer()">Validar llave</button>
        `;
    }

    quizContainer.innerHTML = html;
}

function checkAnswer(selectedOption) {
    const q = quizQuestions[currentQuestionIndex];
    let isCorrect = false;

    if (q.type === "multiple") {
        isCorrect = selectedOption === q.correct;
    } else {
        const userInput = document.getElementById('quiz-input').value.toLowerCase().trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes
        
        isCorrect = q.correct.some(ans => {
            const normalizedAns = ans.toLowerCase().trim()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return userInput === normalizedAns;
        });
    }

    if (isCorrect) {
        showFeedback(q.successMsg, true);
        btnQuizNext.classList.remove('hidden');

        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.75';
        });
        
        // Actualizar icono de candado visualmente
        if (currentQuestionIndex === quizQuestions.length - 1) {
            lockIcon.innerText = "🔓";
            btnQuizNext.innerText = "Desbloquear Recuerdo Final";
        }
    } else {
        showFeedback(q.errorMsg, false);
    }
}

function showFeedback(msg, isSuccess) {
    quizFeedback.innerText = msg;
    quizFeedback.className = `feedback ${isSuccess ? 'correct' : 'incorrect'}`;
    quizFeedback.classList.remove('hidden');
}

btnQuizNext.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        nextScreen(10);
    }
});

// FINALIZAR
function finishJourney() {
    // Simplemente recargar o mostrar un mensaje final de despedida
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="content glass">
            <h1 class="title">Te amo, Carla.</h1>
            <p class="subtitle">Gracias por ser parte de mi vida.</p>
            <p>27 de Junio de 2026</p>
        </div>
    `;
}
