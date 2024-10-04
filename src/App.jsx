import React, { useState, useEffect } from "react";

const App = () => {
  const [number, setNumber] = useState(null);
  const [repeatNumber, setRepeatNumber] = useState(false); // Toggle for repeating the number
  const [delay, setDelay] = useState(2000); // Delay between number generation in milliseconds
  const [prevNumber, setPrevNumber] = useState(null); // To track previous number for repeat logic
  const [isRunning, setIsRunning] = useState(true); // Control for start/stop
  const [generatedNumbers, setGeneratedNumbers] = useState([]); // List of generated numbers

  // Generate random number
  const generateRandomNumber = () => {
    let newNumber = Math.floor(Math.random() * 100); // Random number between 0 and 100

    // If repeatNumber is false, ensure the new number is not equal to the previous one
    if (!repeatNumber && newNumber === prevNumber) {
      newNumber = Math.floor(Math.random() * 100);
    }

    setPrevNumber(newNumber);
    setNumber(newNumber);

    // Store the generated number in the list
    setGeneratedNumbers((prev) => [...prev, newNumber]);

    // Speak the number
    speakNumber(newNumber);
  };

  // Speak the generated number using the SpeechSynthesis API
  const speakNumber = (num) => {
    const utterance = new SpeechSynthesisUtterance(num.toString());
    window.speechSynthesis.speak(utterance);
  };

  // useEffect to generate numbers at regular intervals when running
  useEffect(() => {
    if (isRunning) {
      const interval = setTimeout(() => {
        generateRandomNumber();
      }, delay);

      return () => clearTimeout(interval); // Cleanup on unmount or delay change
    }
  }, [isRunning, number, repeatNumber, delay]);

  // Handle Stop button
  const handleStop = () => {
    setIsRunning(false); // Stop number generation
    window.speechSynthesis.cancel(); // Stop ongoing speech
  };

  // Handle Restart button
  const handleRestart = () => {
    setIsRunning(true); // Start number generation
    setGeneratedNumbers([]); // Clear the previous number list
    setNumber(null); // Clear the current number
    setPrevNumber(null); // Reset previous number
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-2xl font-bold mb-4">Random Number Generator</h1>
      <div className="text-3xl mb-4">Generated Number: {number}</div>

      {/* Toggle for repeating the number */}
      <div className="flex items-center mb-4">
        <label className="mr-2">Repeat Number:</label>
        <input
          type="checkbox"
          checked={repeatNumber}
          onChange={() => setRepeatNumber(!repeatNumber)}
        />
      </div>

      {/* Input for delay */}
      <div className="flex items-center mb-4">
        <label className="mr-2">Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="border border-gray-400 px-2 py-1 rounded"
        />
      </div>

      {/* Stop and Restart Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
        <button
          onClick={handleRestart}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Restart
        </button>
      </div>

      {/* Show generated numbers list when stopped */}
      {!isRunning && (
        <div>
          <h2 className="text-xl font-bold mb-2">Generated Numbers:</h2>
          <ul className="list-disc list-inside " style={{display : 'flex', gap: '10px'}}>
            {generatedNumbers.map((num, index) => (
              <b key={index} className="text-lg  mr-5">
                {num}
              </b>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
