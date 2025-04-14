// App.js
import React from 'react';
import Slider from './Slider';
import './ColorPicker.css';


const MIN = 0;
const MAX = 255;

function App() {
  // Random Color Display (target color setting)
  const [targetRed, setTargetRed] = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [targetGreen, setTargetGreen] = React.useState(getRandomIntegerBetween(MIN, MAX));
  const [targetBlue, setTargetBlue] = React.useState(getRandomIntegerBetween(MIN, MAX));

  // User can input RGB values
  const [guessRed, setGuessRed] = React.useState(0);
  const [guessGreen, setGuessGreen] = React.useState(0);
  const [guessBlue, setGuessBlue] = React.useState(0);

  // Cheating mode toggle - Optional Cheat mode to show guess
  const [cheatingMode, setCheatingMode] = React.useState(false);

  // Feedback message - Show % closeness after guessing
  const [feedback, setFeedback] = React.useState("");


  // Handle when the user clicks "Guess!" button - Compare guess and target
  function handleGuess() {
    const distance = Math.sqrt(
      Math.pow(targetRed - guessRed, 2) +
      Math.pow(targetGreen - guessGreen, 2) +
      Math.pow(targetBlue - guessBlue, 2)
    );
    const maxDistance = Math.sqrt(3 * Math.pow(255, 2));
    const score = Math.round(100 - (distance / maxDistance) * 100);

    setFeedback(`You are ${score}% close!`);
  }

  // Toggle live preview cheating mode
  function toggleCheating() {
    setCheatingMode(prev => !prev);
  }

  return (
    
    <div className="App">
      <h1>Color Guesser</h1>

      {/* Target Color */}
      <div id="color-preview" style={{backgroundColor: `rgb(${targetRed}, ${targetGreen}, ${targetBlue})`}} />

      {/* Cheating mode checkbox */}
      <div style={{textAlign: "center", marginBottom: "10px"}}>
        <label>
          <input type="checkbox" checked={cheatingMode} onChange={toggleCheating} />
          Cheating Mode
        </label>
      </div>

      {/* User's Guess Preview (only if cheating mode is on) */}
      {cheatingMode && (
        <div id="color-preview" style={{backgroundColor: `rgb(${guessRed}, ${guessGreen}, ${guessBlue})`}} />
      )}

      
      {/* Sliders for Red, Green, Blue */}
      <div id="color-picker">
        <div className="row">
          <span className="component-color-preview">Red:</span>
          <Slider min={MIN} max={MAX} startingValue={guessRed} onChange={r => setGuessRed(r)} />
        </div>
        <div className="row">
          <span className="component-color-preview">Green:</span>
          <Slider min={MIN} max={MAX} startingValue={guessGreen} onChange={g => setGuessGreen(g)} />
        </div>
        <div className="row">
          <span className="component-color-preview">Blue:</span>
          <Slider min={MIN} max={MAX} startingValue={guessBlue} onChange={b => setGuessBlue(b)} />
        </div>
      </div>

      {/* Guess Button */}
      <div style={{textAlign: "center", marginTop: "10px"}}>
        <button onClick={handleGuess}>Guess!</button>
      </div>

      {/* Feedback */}
      <h2 style={{textAlign: "center"}}>{feedback}</h2>

    </div>
  );
}

export default App;


function getRandomIntegerBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
