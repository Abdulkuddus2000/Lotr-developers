const questions = [
    {
        question: "You shall not pass!",
        answers: [
            { img: "character_gandalf.png", correct: true },
            { img: "character_saruman.png", correct: false },
            { img: "character_boromir.png", correct: false }
        ]
    },
    {
        question: "A Wizard is never late MR Baggins",
        answers: [
            { img: "character_gandalf.png", correct: true },
            { img: "character_faramir.png", correct: false },
            { img: "character_legolas.png", correct: false }
        ]
    },
    {
        question: "They are taking the Hobbits to Isengard",
        answers: [
            { img: "character_saruman.png", correct: true },
            { img: "character_gollum.png", correct: false },
            { img: "character_aragorn.png", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let favorites = [];
let blacklist = [];

// Start de quiz
function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    
    document.getElementById("question-text").textContent = questionData.question;
    
    const shuffledAnswers = questionData.answers.sort(() => Math.random() - 0.5);
    
    document.querySelectorAll(".quiz-option").forEach((img, index) => {
        img.src = `assets/images/${shuffledAnswers[index].img}`; // Pad naar afbeeldingen
        img.dataset.answer = shuffledAnswers[index].correct ? "correct" : "wrong";
    });
}

// Sla antwoord op
document.querySelectorAll(".quiz-option").forEach(img => {
    img.addEventListener("click", (event) => {
        const selectedAnswer = event.target.dataset.answer;
        userAnswers.push(selectedAnswer);
    });
});

// Volgende vraag
document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showResults();
    }
});

// FAV button
document.getElementById("fav-btn").addEventListener("click", () => {
    favorites.push(questions[currentQuestionIndex]);
    alert("Vraag toegevoegd aan favorieten");
});

// Blacklist button
document.getElementById("blacklist-btn").addEventListener("click", () => {
    blacklist.push(questions[currentQuestionIndex]);
    alert("Vraag toegevoegd aan blacklist");
});

// Toon resultaten
function showResults() {
    let correctAnswers = userAnswers.filter(ans => ans === "correct").length;
    alert(`Quiz is over, uw score is: ${correctAnswers} / ${questions.length}`);
}

// Start de quiz
loadQuestion();

// Popup scherm
function openPopup() {
    document.getElementById('popup').style.display = 'block';
}
  
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
  
function submitReason() {
    const reason = document.getElementById('reason').value;
  
    if (reason) {
        console.log('Reden:', reason);
        closePopup();
    } else {
        alert('Typ een reden');
    }
}
