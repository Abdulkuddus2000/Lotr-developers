const questions = [
    {
        question: "You shall not pass!",
        answers: [
            { img: "../assets/images/character_aragorn.png", correct: true },
            { img: "", correct: false },
            { img: "", correct: false }
        ]
    },
    {
        question: "A Wizard is never late MR Baggins",
        answers: [
            { img: "", correct: true },
            { img: "", correct: false },
            { img: "", correct: false }
        ]
    },
    {
        question: "They are taking the Hobbits to İsnengard",
        answers: [
            { img: "",correct: true },
            { img: "", correct: false },
            { img: "", correct: false }
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

// FAV button
document.getElementById("fav-btn").addEventListener("click", () => {
    favorites.push(questions[currentQuestionIndex]);
    alert("QOUTE toegevoegd aan favorieten");
});

//  Blacklist button
document.getElementById("blacklist-btn").addEventListener("click", () => {
    blacklist.push(questions[currentQuestionIndex]);
alert("QOUTE oegevoegd aan Blacklisten");
});

// SHowresults
function showResults() {
    let correctAnswers = userAnswers.filter(ans => ans === "correct").length;
    alert(`Quiz is over uw score is: ${correctAnswers} / ${questions.length}`);
}

// start van quiz
loadQuestion();

//Popup screen//
function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function submitReason() {
    const reason = document.getElementById('reason').value;
  
    if (reason) {
      // Sebebi işlem yapmak için al (örneğin, backend'e gönder veya yerel bir listede sakla)
      console.log('Reden:', reason); // Burada sebebi console'a yazdırıyoruz, ihtiyaca göre başka bir işlem yapılabilir.
    
      closePopup();
    } else {
      alert('Type een reden');
    }
  }