/**
     * ChatGPT Usage Documentation
     * 
     * User Experience Improvements:
     * - Implemented a timer system for each question.
     * - Ensured randomized answer order to prevent predictability.
     * - Restricted users from answering multiple times.
     * - helped implement a progress bar for the entire game
     * - helped implement a dark mode for the entire game
     * 
     * Debugging & Refinements:
     * - Identified and fixed redundant function definitions.
     * - Suggested improvements for clearer code readability and organization.
     */

    /**
     * Cache a fetch() request in localStorage and return the cached data if it's not expired.
     * Useful if you are doing live editing refreshes and don't want to query the API every time.
     * 
     * @param {string} url The URL to fetch
     * @param {*} options The options to pass to fetch()
     * @param {number} cacheDuration The maximum age to use for cached data, in milliseconds
     * @returns A Promise that resolves to a Response object
     */


    document.addEventListener("DOMContentLoaded", async function () {
        const API_URL = "https://opentdb.com/api.php?amount=10&type=multiple";
        const quizContainer = document.getElementById("quiz-container");
        const scoreContainer = document.getElementById("score");
        const timerContainer = document.getElementById("timer");
        const progressBar = document.getElementById("progress-bar");
        const darkModeToggle = document.getElementById("dark-mode-toggle");
        const body = document.body;
    
        let score = 0;
        let attempted = 0;
        let currentQuestionIndex = 0;
        let questions = [];
        let timer;
    
        // Check and apply dark mode preference
        if (localStorage.getItem("darkMode") === "enabled") {
            body.classList.add("dark-mode");
        }
    
        darkModeToggle.addEventListener("click", function () {
            body.classList.toggle("dark-mode");
    
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("darkMode", "enabled");
            } else {
                localStorage.setItem("darkMode", "disabled");
            }
        });
    
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    
        async function fetchQuestions() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                questions = data.results.map(q => ({
                    question: q.question,
                    correctAnswer: q.correct_answer,
                    answers: shuffleArray([...q.incorrect_answers, q.correct_answer])
                }));
                loadQuestion();
            } catch (error) {
                quizContainer.innerHTML = "Failed to load questions. Please try again.";
            }
        }
    
        function startTimer() {
            let timeLeft = 15;
            timerContainer.textContent = `Time Left: ${timeLeft}s`;
            timer = setInterval(() => {
                timeLeft--;
                timerContainer.textContent = `Time Left: ${timeLeft}s`;
                if (timeLeft === 0) {
                    clearInterval(timer);
                    attempted++;
                    loadNextQuestion();
                }
            }, 1000);
        }
    
        function loadQuestion() {
            if (currentQuestionIndex >= questions.length) {
                quizContainer.innerHTML = `<h2>Quiz Complete!</h2><p>You answered ${score} out of ${attempted} correctly.</p>`;
                progressBar.style.width = "100%"; // Ensure full progress bar when quiz ends
                return;
            }
            
            clearInterval(timer);
            startTimer();
            updateProgressBar(); // Update progress bar on new question
    
            const q = questions[currentQuestionIndex];
            quizContainer.innerHTML = `<h3>Question ${currentQuestionIndex + 1}: ${q.question}</h3>`;
            q.answers.forEach(answer => {
                const btn = document.createElement("button");
                btn.textContent = answer;
                btn.classList.add("answer-btn");
                btn.onclick = () => handleAnswerClick(btn, q.correctAnswer);
                quizContainer.appendChild(btn);
            });
        }
    
        function handleAnswerClick(button, correctAnswer) {
            clearInterval(timer);
            attempted++;
            const buttons = document.querySelectorAll(".answer-btn");
            buttons.forEach(btn => btn.disabled = true);
            
            const icon = document.createElement("span");
            icon.style.marginLeft = "10px";
    
            if (button.textContent === correctAnswer) {
                score++;
                button.style.backgroundColor = "#28a745";
                button.style.color = "white";
                button.style.fontWeight = "bold";
                icon.textContent = "✔️";
            } else {
                button.style.backgroundColor = "#dc3545";
                button.style.color = "white";
                button.style.fontWeight = "bold";
                icon.textContent = "✖️";
                buttons.forEach(btn => {
                    if (btn.textContent === correctAnswer) {
                        btn.style.backgroundColor = "green";
                        const correctIcon = document.createElement("span");
                        correctIcon.textContent = "✔️";
                        btn.appendChild(correctIcon);
                    }
                });
            }
            button.appendChild(icon);
            scoreContainer.textContent = `Score: ${score}/${attempted}`;
            setTimeout(loadNextQuestion, 2000);
        }
    
        function loadNextQuestion() {
            currentQuestionIndex++;
            updateProgressBar(); // Update progress before moving to the next question
            loadQuestion();
        }
    // progress bar implementation
        function updateProgressBar() {
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    
        fetchQuestions();
    });
    