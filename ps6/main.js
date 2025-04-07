// In completing this project, I have started with the starter code I downloaded from L18 folder, which was recommended in the Assignment Description. Using that template as a starting point, I made numerous changes to the original code to get to my final output. Throughout the process, I had a lot of extra functionalities that I wanted to add onto my project on top of the requirements list from the assignment description. When incorporating these extra features, I have used genAI to figure out where in my main.js file to integrate those functions to make the whole thing run properly. Also, as I struggled at first with the localStorage requirement, I got a few suggestions from genAI that helped me get to the result I desired. 

// The following is a list of extra features that I intended to add to my project
// 1. Dark Mode Toggle 
// 2. Pause and Resume Timer Button
// 3. Audio Notification on Session End
// 4. Use of FontAwesome Lemon Icons 
// 5. Displyaing "Break Over🎉" message at the end of break sessions
// 6. Allowing Users to Stop the Work Session
// 7. Allowing Users to Stop the Break Session
// 8. Improved UI with Modern Style and Smoother Transitions



import "./style.css";

// Assignment Requirement 1 - Ability to add new tasks and enter custom task descriptions
const TASK_PLACEHOLDER = "Task Description";
const addTaskButton = document.querySelector("button#add-task");
const taskList = document.querySelector("ul#tasks");
// EXTRA FEATURE - PAUSE BUTTON
const pauseButtonGlobal = document.getElementById("pause-btn"); // Global Pause Button

// EXTRA FEATURE - DARK MODE TOGGLE
const darkModeToggle = document.createElement("button");
darkModeToggle.textContent = "🌙 Toggle Dark Mode";
darkModeToggle.className = "dark-mode-btn";
document.body.prepend(darkModeToggle);

// Toggle dark mode class on body
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Initialize empty tasks array
let tasks = [];
let intervalId = null;
let isPaused = false;
let timeLeft = 0;

function addTask(description, sessionCount = 0) {
    let taskDescription = description;

    const newTask = document.createElement("li");
    const descriptionSpan = document.createElement("span");
    const descriptionInput = document.createElement("input");
    const startButton = document.createElement("button");
    const removeButton = document.createElement("button");
    const sessionCounterSpan = document.createElement("span");
    sessionCounterSpan.className = "session-counter";
    sessionCounterSpan.innerHTML = ""; // Clear first
    for (let i = 0; i < sessionCount; i++) {
        const lemonIcon = document.createElement("i");
        lemonIcon.className = "fas fa-lemon"; // FontAwesome lemon
        lemonIcon.style.color = "#FFD700"; // Gold color
        sessionCounterSpan.appendChild(lemonIcon);
    }
    sessionCounterSpan.dataset.count = sessionCount;

    startButton.textContent = "▶️ start";
    startButton.className = "start-btn";
    startButton.addEventListener("click", () => startWorkSession(newTask));

    removeButton.innerHTML = "🗑️";
    removeButton.className = "remove-btn";
    removeButton.addEventListener("click", removeTask);

    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", TASK_PLACEHOLDER);

    newTask.append(descriptionSpan, sessionCounterSpan, startButton, removeButton);
    taskList.append(newTask);

    descriptionSpan.addEventListener("click", editTask);

    tasks.push({ description: taskDescription, sessionCount: sessionCount });
    saveTasksToLocalStorage();
    setTaskDescription(taskDescription);

    function getTaskIndex() {
        return Array.from(taskList.children).indexOf(newTask);
    }
    // Assignment Requirement 2 - Users must be able to remove tasks
    function removeTask() {
        newTask.remove();
        const taskIndex = getTaskIndex();
        tasks.splice(taskIndex, 1);
        saveTasksToLocalStorage();
    }
    // Assignment Requirement 3 - Users must be able to change tasks' descriptions
    function editTask() {
        descriptionInput.value = taskDescription;
        descriptionSpan.replaceWith(descriptionInput);
        descriptionInput.focus();

        descriptionInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                setTaskDescription(descriptionInput.value);
            } else if (e.key === "Escape") {
                setTaskDescription(taskDescription);
            }
        });

        descriptionInput.addEventListener("blur", () => {
            setTaskDescription(descriptionInput.value);
        });
    }

    function setTaskDescription(val) {
        taskDescription = val;
        if (taskDescription === "") {
            descriptionSpan.textContent = TASK_PLACEHOLDER;
            descriptionSpan.classList.add("placeholder");
        } else {
            descriptionSpan.textContent = taskDescription;
            descriptionSpan.classList.remove("placeholder");
        }
        descriptionInput.replaceWith(descriptionSpan);

        const taskIndex = getTaskIndex();
        tasks[taskIndex].description = taskDescription;
        saveTasksToLocalStorage();
    }

    function startWorkSession(currentTaskLi) {
        const timerScreen = document.getElementById("timer-screen");
        const currentTask = document.getElementById("current-task");
        const timer = document.getElementById("timer");

        timerScreen.style.display = "flex";
        taskList.style.display = "none";
        addTaskButton.style.display = "none";
        document.querySelector(".interval-settings").style.display = "none";

        currentTask.textContent = taskDescription;
        // ALLOW USERS TO CHANGE INTERVAL TIMES
        const workMinutes = document.querySelector("#work-interval").value || 25;
        timeLeft = workMinutes * 60;
        isPaused = false;

        pauseButtonGlobal.style.display = "inline-block";
        pauseButtonGlobal.textContent = "⏸️ pause";

        pauseButtonGlobal.onclick = function () {
            isPaused = !isPaused;
            pauseButtonGlobal.textContent = isPaused ? "▶️ resume" : "⏸️ pause";
        };

        // ONLY ONE TIMER RUNNING AT A TIME
        clearInterval(intervalId);

        intervalId = setInterval(() => {
            if (!isPaused) {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                timeLeft--;

                if (timeLeft < 0) {
                    clearInterval(intervalId);
                    playSound();
                    pauseButtonGlobal.style.display = "none";

                    const counter = currentTaskLi.querySelector(".session-counter");
                    if (counter) {
                        const currentCount = parseInt(counter.dataset.count) || 0;
                        const newCount = currentCount + 1;
                        counter.dataset.count = newCount;

                        // Clear existing lemons
                        counter.innerHTML = "";

                        // EXTRA FEATURE - INTEGRATING FONTAWESOME to display lemon icons
                        for (let i = 0; i < newCount; i++) {
                            const lemonIcon = document.createElement("i");
                            lemonIcon.className = "fas fa-lemon"; // Use FontAwesome lemon icon
                            lemonIcon.style.color = "#FFD700"; // Gold/Yellow color
                            counter.appendChild(lemonIcon);
                        }

                        const taskIndex = Array.from(taskList.children).indexOf(currentTaskLi);
                        tasks[taskIndex].sessionCount = newCount;
                        saveTasksToLocalStorage();
                    }

                    // AUTO START BREAK SESSION AFTER WORK ENDS
                    startBreakSession();
                }
            }
        }, 1000);

        // ALLOW CANCEL/RESET COUNTDOWN TIMER
        document.getElementById("stop-btn").onclick = function () {
            clearInterval(intervalId);
            pauseButtonGlobal.style.display = "none";
            timerScreen.style.display = "none";
            taskList.style.display = "block";
            addTaskButton.style.display = "block";
            document.querySelector(".interval-settings").style.display = "flex";
        };
    }

    function startBreakSession() {
        const timerScreen = document.getElementById("timer-screen");
        const currentTask = document.getElementById("current-task");
        const timer = document.getElementById("timer");

        currentTask.textContent = "Break time! 💥";
        const breakMinutes = document.querySelector("#break-interval").value || 5;
        let breakTimeLeft = breakMinutes * 60;

        clearInterval(intervalId);
        intervalId = setInterval(() => {
            const minutes = Math.floor(breakTimeLeft / 60);
            const seconds = breakTimeLeft % 60;
            timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            breakTimeLeft--;

            if (breakTimeLeft < 0) {
                clearInterval(intervalId);
                timer.textContent = "Break over! 🎉";
                playSound();

                setTimeout(() => {
                    timerScreen.style.display = "none";
                    taskList.style.display = "block";
                    addTaskButton.style.display = "block";
                    document.querySelector(".interval-settings").style.display = "flex";
                }, 2000);
            }
        }, 1000);

        document.getElementById("stop-btn").onclick = function () {
            clearInterval(intervalId);
            timerScreen.style.display = "none";
            taskList.style.display = "block";
            addTaskButton.style.display = "block";
            document.querySelector(".interval-settings").style.display = "flex";
        };
    }
}

// EXTRA FEATURE 2 - USING Audio API to play a tone indicaing a session is done
function playSound() {
    const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    beep.play().catch((error) => console.log("Sound play blocked:", error));
}
// PERSIST TASKS/SESSIONS ACROSS REFRESH (localStorage)
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
}

addTaskButton.addEventListener("click", () => addTask(""));

window.addEventListener("DOMContentLoaded", () => {
    const savedTasks = loadTasksFromLocalStorage();
    for (const task of savedTasks) {
        addTask(task.description, task.sessionCount || 0);
    }
});