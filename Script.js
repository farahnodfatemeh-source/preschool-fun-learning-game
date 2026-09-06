/* =========================================================
   ماجراجویی رنگین‌کمان کوچولو
   script.js
   بازی آموزشی و سرگرم‌کننده برای کودکان پیش‌دبستانی
========================================================= */
"use strict";
/* =========================
   تنظیمات بازی
========================= */
const QUESTIONS_PER_GAME = 10;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let soundEnabled = true;
let answeredCorrectly = false;
let audioContext = null;
/* =========================
   دریافت عناصر HTML
========================= */
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const nextButton = document.getElementById("nextButton");
const soundToggle = document.getElementById("soundToggle");
const scoreElement = document.getElementById("score");
const questionNumberElement = document.getElementById("questionNumber");
const totalQuestionsElement = document.getElementById("totalQuestions");
const correctAnswersElement = document.getElementById("correctAnswers");
const progressBar = document.getElementById("progressBar");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const questionVisual = document.getElementById("questionVisual");
const answersContainer = document.getElementById("answersContainer");
const feedback = document.getElementById("feedback");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackMessage = document.getElementById("feedbackMessage");
const finalScore = document.getElementById("finalScore");
const finalCorrect = document.getElementById("finalCorrect");
const finalTotal = document.getElementById("finalTotal");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const confettiContainer = document.getElementById("confettiContainer");
const flowerContainer = document.getElementById("flowerContainer");
/* =========================
   بانک سؤال‌ها
========================= */
const questionBank = [
    {
        category: "🎨 رنگ‌ها",
        question: "کدام رنگ قرمز است؟",
        visual: "🎨",
        options: [
            { text: "قرمز", icon: "🔴", correct: true },
            { text: "آبی", icon: "🔵", correct: false },
            { text: "سبز", icon: "🟢", correct: false },
            { text: "زرد", icon: "🟡", correct: false }
        ]
    },
    {
        category: "🔢 عددها",
        question: "کدام عدد، عدد ۳ است؟",
        visual: "🔢",
        options: [
            { text: "۵", icon: "5️⃣", correct: false },
            { text: "۳", icon: "3️⃣", correct: true },
            { text: "۸", icon: "8️⃣", correct: false },
            { text: "۱", icon: "1️⃣", correct: false }
        ]
    },
    {
        category: "🐾 حیوانات",
        question: "کدام حیوان می‌گوید «میو میو»؟",
        visual: "🐾",
        options: [
            { text: "سگ", icon: "🐶", correct: false },
            { text: "گاو", icon: "🐮", correct: false },
            { text: "گربه", icon: "🐱", correct: true },
            { text: "شیر", icon: "🦁", correct: false }
        ]
    },
    {
        category: "🔷 شکل‌ها",
        question: "کدام شکل گرد است؟",
        visual: "🔷",
        options: [
            { text: "مربع", icon: "🟥", correct: false },
            { text: "مثلث", icon: "🔺", correct: false },
            { text: "دایره", icon: "🔴", correct: true },
            { text: "ستاره", icon: "⭐", correct: false }
        ]
    },
    {
        category: "🍎 شمارش",
        question: "چند سیب می‌بینی؟",
        visual: "🍎🍎🍎",
        options: [
            { text: "۲ تا", icon: "2️⃣", correct: false },
            { text: "۴ تا", icon: "4️⃣", correct: false },
            { text: "۵ تا", icon: "5️⃣", correct: false },
            { text: "۳ تا", icon: "3️⃣", correct: true }
        ]
    },
    {
        category: "🌈 رنگ‌ها",
        question: "کدام رنگ مثل آسمان است؟",
        visual: "☁️",
        options: [
            { text: "آبی", icon: "🔵", correct: true },
            { text: "قرمز", icon: "🔴", correct: false },
            { text: "زرد", icon: "🟡", correct: false },
            { text: "صورتی", icon: "🩷", correct: false }
        ]
    },
    {
        category: "🐾 حیوانات",
        question: "کدام حیوان بزرگ و خرطوم دارد؟",
        visual: "🐘",
        options: [
            { text: "خرگوش", icon: "🐰", correct: false },
            { text: "فیل", icon: "🐘", correct: true },
            { text: "ماهی", icon: "🐟", correct: false },
            { text: "پرنده", icon: "🐦", correct: false }
        ]
    },
    {
        category: "🔢 عددها",
        question: "بعد از عدد ۲ کدام عدد می‌آید؟",
        visual: "2️⃣",
        options: [
            { text: "۱", icon: "1️⃣", correct: false },
            { text: "۴", icon: "4️⃣", correct: false },
            { text: "۳", icon: "3️⃣", correct: true },
            { text: "۵", icon: "5️⃣", correct: false }
        ]
    },
    {
        category: "🍓 میوه‌ها",
        question: "کدام میوه قرمز و دانه‌دانه است؟",
        visual: "🍓",
        options: [
            { text: "موز", icon: "🍌", correct: false },
            { text: "توت‌فرنگی", icon: "🍓", correct: true },
            { text: "پرتقال", icon: "🍊", correct: false },
            { text: "هندوانه", icon: "🍉", correct: false }
        ]
    },
    {
        category: "🌱 طبیعت",
        question: "کدام چیز روی درخت رشد می‌کند؟",
        visual: "🌳",
        options: [
            { text: "سیب", icon: "🍎", correct: true },
            { text: "کفش", icon: "👟", correct: false },
            { text: "توپ", icon: "⚽", correct: false },
            { text: "مداد", icon: "✏️", correct: false }
        ]
    },
    {
        category: "🎨 رنگ‌ها",
        question: "کدام رنگ مثل خورشید است؟",
        visual: "☀️",
        options: [
            { text: "بنفش", icon: "🟣", correct: false },
            { text: "زرد", icon: "🟡", correct: true },
            { text: "آبی", icon: "🔵", correct: false },
            { text: "سبز", icon: "🟢", correct: false }
        ]
    },
    {
        category: "🔷 شکل‌ها",
        question: "کدام شکل سه گوشه دارد؟",
        visual: "🔺",
        options: [
            { text: "دایره", icon: "⚪", correct: false },
            { text: "مربع", icon: "🟥", correct: false },
            { text: "مثلث", icon: "🔺", correct: true },
            { text: "بیضی", icon: "🥚", correct: false }
        ]
    }
];
/* =========================
   ابزارهای کمکی
========================= */
/**
 * مخلوط کردن آرایه به روش Fisher-Yates
 */
function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [result[i], result[randomIndex]] = [
            result[randomIndex],
            result[i]
        ];
    }
    return result;
}
/**
 * انتخاب سؤال‌های تصادفی بدون تکرار
 */
function createGameQuestions() {
    return shuffle(questionBank).slice(0, QUESTIONS_PER_GAME);
}
let gameQuestions = [];
/* =========================
   مدیریت صفحه‌ها
========================= */
function showScreen(screenToShow) {
    [startScreen, gameScreen, resultScreen].forEach(screen => {
        if (screen) {
            screen.classList.add("hidden");
        }
    });
    if (screenToShow) {
        screenToShow.classList.remove("hidden");
    }
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
/* =========================
   شروع بازی
========================= */
function startGame() {
    initializeAudio();
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    answeredCorrectly = false;
    gameQuestions = createGameQuestions();
    totalQuestionsElement.textContent = gameQuestions.length;
    finalTotal.textContent = gameQuestions.length;
    updateScore();
    showScreen(gameScreen);
    loadQuestion();
}
/* =========================
   نمایش سؤال
========================= */
function loadQuestion() {
    answeredCorrectly = false;
    const currentQuestion = gameQuestions[currentQuestionIndex];
    if (!currentQuestion) {
        finishGame();
        return;
    }
    questionNumberElement.textContent = currentQuestionIndex + 1;
    questionCategory.textContent = currentQuestion.category;
    questionText.textContent = currentQuestion.question;
    questionVisual.textContent = currentQuestion.visual;
    const progress =
        ((currentQuestionIndex + 1) / gameQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    feedback.classList.add("hidden");
    nextButton.classList.add("hidden");
    renderAnswers(currentQuestion.options);
}
/* =========================
   ساخت گزینه‌ها
========================= */
function renderAnswers(options) {
    answersContainer.innerHTML = "";
    /*
     * گزینه‌ها قبل از نمایش کاملاً مخلوط می‌شوند.
     * بنابراین جواب صحیح همیشه در یک جای ثابت نیست.
     */
    const shuffledOptions = shuffle(options);
    shuffledOptions.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-button";
        button.dataset.correct = option.correct ? "true" : "false";
        button.setAttribute(
            "aria-label",
            `گزینه ${index + 1}: ${option.text}`
        );
        const icon = document.createElement("span");
        icon.className = "answer-icon";
        icon.textContent = option.icon;
        const text = document.createElement("span");
        text.className = "answer-text";
        text.textContent = option.text;
        button.appendChild(icon);
        button.appendChild(text);
        button.addEventListener("click", () => {
            handleAnswer(button);
        });
        answersContainer.appendChild(button);
    });
}
/* =========================
   بررسی پاسخ
========================= */
function handleAnswer(selectedButton) {
    if (answeredCorrectly) {
        return;
    }
    const allButtons =
        answersContainer.querySelectorAll(".answer-button");
    const isCorrect =
        selectedButton.dataset.correct === "true";
    if (isCorrect) {
        answeredCorrectly = true;
        score += 10;
        correctAnswers++;
        selectedButton.classList.add("correct");
        allButtons.forEach(button => {
            button.disabled = true;
            button.classList.add("disabled");
        });
        updateScore();
        showCorrectFeedback();
        playCorrectSound();
        createConfetti(18);
        setTimeout(() => {
            nextButton.classList.remove("hidden");
        }, 700);
    } else {
        selectedButton.classList.add("wrong");
        selectedButton.disabled = true;
        playWrongSound();
        showWrongFeedback();
        setTimeout(() => {
            selectedButton.classList.remove("wrong");
        }, 700);
    }
}
/* =========================
   بازخورد پاسخ صحیح
========================= */
function showCorrectFeedback() {
    feedback.classList.remove("hidden");
    feedbackIcon.textContent = "🎉";
    feedbackTitle.textContent = "آفرین قهرمان! 🌟";
    feedbackMessage.textContent =
        "جوابت کاملاً درست بود! خیلی خوب فکر کردی.";
}
/* =========================
   بازخورد پاسخ غلط
========================= */
function showWrongFeedback() {
    feedback.classList.remove("hidden");
    feedbackIcon.textContent = "💛";
    feedbackTitle.textContent = "اشکالی نداره!";
    feedbackMessage.textContent =
        "یک بار دیگه فکر کن و دوباره امتحان کن 😊";
}
/* =========================
   سؤال بعدی
========================= */
function nextQuestion() {
    if (!answeredCorrectly) {
        return;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex >= gameQuestions.length) {
        finishGame();
        return;
    }
    loadQuestion();
}
/* =========================
   بروزرسانی امتیاز
========================= */
function updateScore() {
    scoreElement.textContent = score;
    correctAnswersElement.textContent = correctAnswers;
}
/* =========================
   پایان بازی
========================= */
function finishGame() {
    showScreen(resultScreen);
    finalScore.textContent = score;
    finalCorrect.textContent = correctAnswers;
    finalTotal.textContent = gameQuestions.length;
    const percentage =
        (correctAnswers / gameQuestions.length) * 100;
    if (percentage === 100) {
        resultTitle.textContent = "🏆 فوق‌العاده بود!";
        resultMessage.textContent =
            "همه جواب‌ها درست بود! تو یک قهرمان واقعی هستی! 🌈";
    } else if (percentage >= 70) {
        resultTitle.textContent = "🎉 آفرین قهرمان!";
        resultMessage.textContent =
            "خیلی خوب بازی کردی! تو واقعاً باهوشی! ⭐";
    } else if (percentage >= 40) {
        resultTitle.textContent = "🌸 خیلی خوب بود!";
        resultMessage.textContent =
            "آفرین! با کمی تمرین می‌تونی حتی بهتر هم بشی! 💪";
    } else {
        resultTitle.textContent = "💖 آفرین کوچولو!";
        resultMessage.textContent =
            "مهم اینه که تلاش کردی! بیا دوباره امتحان کنیم! 😊";
    }
    createBigCelebration();
    playWinnerMusic();
}
/* =========================
   جشن پایان بازی
========================= */
function createBigCelebration() {
    createConfetti(70);
    createFlowers(25);
}
/* =========================
   ساخت Confetti
========================= */
function createConfetti(amount = 20) {
    if (!confettiContainer) {
        return;
    }
    const symbols = [
        "🎉",
        "✨",
        "⭐",
        "🌟",
        "🎊",
        "💖",
        "🌈"
    ];
    for (let i = 0; i < amount; i++) {
        const item = document.createElement("span");
        item.className = "generated-confetti";
        item.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];
        item.style.left = `${Math.random() * 100}%`;
        item.style.top = `${Math.random() * 20}%`;
        item.style.animationDelay =
            `${Math.random() * 0.8}s`;
        item.style.setProperty(
            "--fall-distance",
            `${80 + Math.random() * 80}vh`
        );
        confettiContainer.appendChild(item);
        setTimeout(() => {
            item.remove();
        }, 3500);
    }
}
/* =========================
   ساخت گل
========================= */
function createFlowers(amount = 15) {
    if (!flowerContainer) {
        return;
    }
    const flowers = [
        "🌸",
        "🌼",
        "🌺",
        "🌷",
        "🌻",
        "💐"
    ];
    for (let i = 0; i < amount; i++) {
        const flower = document.createElement("span");
        flower.className = "generated-flower";
        flower.textContent =
            flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.top = `${50 + Math.random() * 45}%`;
        flower.style.animationDelay =
            `${Math.random() * 1.5}s`;
        flowerContainer.appendChild(flower);
        setTimeout(() => {
            flower.remove();
        }, 4500);
    }
}
/* =========================
   سیستم صدا
   Web Audio API
========================= */
function initializeAudio() {
    if (!soundEnabled) {
        return;
    }
    try {
        if (!audioContext) {
            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;
            if (!AudioContext) {
                return;
            }
            audioContext = new AudioContext();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    } catch (error) {
        console.warn("Audio initialization failed:", error);
    }
}
/**
 * پخش یک نت ساده
 */
function playTone(
    frequency,
    duration = 0.15,
    type = "sine",
    volume = 0.08,
    delay = 0
) {
    if (!soundEnabled) {
        return;
    }
    initializeAudio();
    if (!audioContext) {
        return;
    }
    try {
        const oscillator =
            audioContext.createOscillator();
        const gainNode =
            audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            frequency,
            audioContext.currentTime + delay
        );
        gainNode.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime + delay
        );
        gainNode.gain.exponentialRampToValueAtTime(
            volume,
            audioContext.currentTime + delay + 0.02
        );
        gainNode.gain.exponential
