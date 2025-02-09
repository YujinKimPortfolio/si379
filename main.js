let score = 0;
// added scoreDisplay
const scoreDisplay = document.getElementById('score');
let gameInterval;

// Write code that *every second*, picks a random unwhacked hole (use getRandomUnwhackedHoleId)
// and adds the "needs-whack" class
const interval = setInterval(() => {
    console.log('TODO: Add the "needs-whack" class to a random hole');
}, 1000);

// added spawnMole() function for spawning mole in a random empty hole
function spawnMole() {
    if (score >= 45) {
        clearInterval(gameInterval); // Stop spawning moles if score is 45 or more
        console.log("game over. stopping mole spawns")
        return;
    }
    const holeId = getRandomUnwhackedHoleId();
    if (holeId) {
        const hole = document.getElementById(holeId); 
        // adding mole
        console.log(`spawning mole at hole: ${holeId}`);
        hole.classList.add("needs-whack"); 
        hole.style.backgroundImage = "url('happy_brutus.png')";
        hole.style.backgroundColor = "#BA0C2F";
    }
    else {
        console.log('No more empty holes available');
        clearInterval(interval); // Stop spawning moles if no empty holes are available
        alert("Game over. No more empty holes available.");
        return;
    }
}

// added whack function to handle clicking on a mole
function whack(event) {
    const hole = event.target;

    if(!hole.classList.contains('needs-whack')) {
        return;
    }

    hole.classList.remove('needs-whack');
    hole.classList.add('animating-whack');
    hole.style.backgroundImage = "url('sad_brutus.png')";
    hole.style.backgroundColor = "#A7B1B7"

    setTimeout(() => {
        hole.classList.remove('animating-whack');
        hole.style.backgroundImage = "";
        hole.style.backgroundColor ="#FFCB05";
    }, 500);

    score++ ;
    scoreDisplay.textContent = `Score: ${score}`;

    if (score >= 45) {
        alert("Congratulations! You won!");
    }
}

for(const id of getAllHoleIds()) {
    // Write code that adds a "click" listener to the element with this id
    //     When the user clicks on it, *if* the element has class "needs-whack" then:
    document.getElementById(id).addEventListener("click", whack);
    //          1. Remove the "needs-whack" class
    //          2. Add the "animating-whack" class *for 500 milliseconds*
    //          3. Increment the score by 1 (and update the score display)
    //          4. If the score is 45 or higher, stop the game (by clearing the interval)
    console.log(`TODO: Add a click listener for #${id} here`);
}

gameInterval = setInterval(spawnMole, 1000);

/**
 * @returns a random ID of a hole that is "idle" (doesn't currently contain a mole/buckeye). If there are none, returns null
 */
function getRandomUnwhackedHoleId() {
    const inactiveHoles = document.querySelectorAll('.hole:not(.needs-whack)');  // Selects elements that have class "hole" but **not** "needs-whack"

    if(inactiveHoles.length === 0) {
        return null;
    } else {
        const randomIndex = Math.floor(Math.random() * inactiveHoles.length);
        return inactiveHoles[randomIndex].getAttribute('id');
    }
}

/**
 * @returns a list of IDs (as strings) for each hole DOM element
 */
function getAllHoleIds() {
    const allHoles = document.querySelectorAll('.hole'); 
    const ids = [];
    for(const hole of allHoles) {
        ids.push(hole.getAttribute('id'));
    }
    return ids;
}