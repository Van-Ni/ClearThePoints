import React, { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [n, setN] = useState(10);
  const [numbers, setNumbers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [positions, setPositions] = useState([]); 
  const [gameStatus, setGameStatus] = useState(null); // 'playing', 'gameOver', 'allCleared'

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => setTimer((prevTime) => prevTime + 1), 100);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const startGame = () => {
    if(n > 0){
      const shuffledNumbers = shuffleArray([...Array(n).keys()].map(i => i + 1));
      setNumbers(shuffledNumbers);
      setSelectedNumbers([]);
      setTimer(0);
      setIsPlaying(true);
      setGameStatus('playing');
      setPositions(generateRandomPositions(shuffledNumbers.length));
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setNumbers([]);
    setSelectedNumbers([]);
    setTimer(0);
    setPositions([]);
    setGameStatus(null);
  };

  const handleNumberClick = (number) => {
    if (number === selectedNumbers.length + 1) {
      setSelectedNumbers([...selectedNumbers, number]);
      if (number === n) {
        setIsPlaying(false);
        setGameStatus('allCleared');
      }
    } else {
      setIsPlaying(false);
      setGameStatus('gameOver');
    }
  };

  const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

  const generateRandomPositions = (length) => {
    return Array.from({ length }, () => ({
      left: `${Math.random() * 88}%`,
      top: `${Math.random() * 88}%`
    }));
  };

  return (
    <div className="App">
      <div className='game-container'>
        <h1 style={{ color: gameStatus === 'allCleared' ? 'green' : gameStatus === 'gameOver' ? 'red' : 'black' }}>
          {gameStatus === 'allCleared' ? 'ALL CLEARED!' : gameStatus === 'gameOver' ? 'Game Over!' : "LET'S PLAY"}
        </h1>
        <div>
          <label style={{ marginRight: "20px" }}>Points: </label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            min="1"
            max="100"
            disabled={isPlaying}
          />
        </div>
        <div>
          <div>
            <span style={{ marginRight: "34px" }}>Time</span>
            {(timer / 10).toFixed(2)} s
          </div>
        </div>
        <button onClick={isPlaying ? resetGame : startGame}>
          {isPlaying ? 'Restart' : 'Play'}
        </button>
        <div style={{ marginTop: '20px', position: 'relative', height: '300px', border: '1px solid #ddd' }}>
          {isPlaying && numbers.map((number, index) => (
            <span
              key={index}
              className={selectedNumbers.includes(number) ? 'fade-out' : ''}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: '5px',
                border: '1px solid black',
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                cursor: 'pointer',
                backgroundColor: selectedNumbers.includes(number) ? '#cb3d3dde' : 'white',
                opacity: selectedNumbers.includes(number) ? '0' : '1',
                position: 'absolute',
                left: positions[index]?.left,
                top: positions[index]?.top,
                zIndex: n - number
              }}
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
