// lijst van vragen en antwoords
const questions = [
    {
        question: "'You shall not pass!'",
        answers: [
            { img: "gandalf.jpg", correct: true },
            { img: "frodo.jpg", correct: false },
            { img: "aragorn.jpg", correct: false }
        ]
    },
    {
        question: "A Wizard is never late MR Baggins",
        answers: [
            { img: "assets/", correct: true },
            { img: "joker.jpg", correct: false },
            { img: "superman.jpg", correct: false }
        ]
    },
    {
        question: "Bu repliği kim söyledi? 'I am inevitable.'",
        answers: [
            { img: "thanos.jpg", correct: true },
            { img: "ironman.jpg", correct: false },
            { img: "captain.jpg", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let favorites = [];
let blacklist = [];

// star van quiz
function loadQuestion() {
    const questionData = questions[currentQuestionIndex];

    
    document.getElementById("question-text").textContent = questionData.question;

    
    const shuffledAnswers = questionData.answers.sort(() => Math.random() - 0.5);

    
    document.querySelectorAll(".quiz-option").forEach((img, index) => {
        img.src = `assets/images/${shuffledAnswers[index].img}`;
        img.dataset.answer = shuffledAnswers[index].correct ? "correct" : "wrong";
    });
}

// save antwoord
document.querySelectorAll(".quiz-option").forEach(img => {
    img.addEventListener("click", (event) => {
        const selectedAnswer = event.target.dataset.answer;
        userAnswers.push(selectedAnswer);
    });
});

// next
document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
});

// 📌 "Favorilere Ekle" butonu
document.getElementById("fav-btn").addEventListener("click", () => {
    favorites.push(questions[currentQuestionIndex]);
    alert("Soru favorilere eklendi!");
});

// 📌 "Blacklist'e Ekle" butonu
document.getElementById("blacklist-btn").addEventListener("click", () => {
    blacklist.push(questions[currentQuestionIndex]);
    alert("Soru blacklist'e eklendi!");
});

// 📌 Quiz bittiğinde sonucu göster
function showResults() {
    let correctAnswers = userAnswers.filter(ans => ans === "correct").length;
    alert(`Quiz bitti! Doğru sayısı: ${correctAnswers} / ${questions.length}`);
}

// 📌 Sayfa yüklendiğinde ilk soruyu başlat
loadQuestion();
