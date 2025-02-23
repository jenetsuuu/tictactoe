import { useState, useEffect } from "react";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerXWins, setPlayerXWins] = useState(0);
  const [playerOWins, setPlayerOWins] = useState(0);
  const [gameMode, setGameMode] = useState(null);

  function checkWinner(board) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : "Draw";
  }

  const winner = checkWinner(board);

  function handleClick(index) {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }

  function handleGameMode(mode) {
    setGameMode(mode);
    resetGame();
  }

  useEffect(() => {
    if (winner === "X") {
      setPlayerXWins((prev) => prev + 1);
    } else if (winner === "O") {
      setPlayerOWins((prev) => prev + 1);
    }
  }, [winner]);

  // Computer move logic
  useEffect(() => {
    if (gameMode === "computer" && !isXNext && !winner) {
      const timer = setTimeout(() => {
        const emptyCells = board.map((cell, index) =>
          (cell === null ? index : null)).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        if (randomIndex !== undefined) {
          const newBoard = board.slice();
          newBoard[randomIndex] = "O";
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isXNext, gameMode, board, winner]);

  return (
    <div>
      <h1>Tic-Tac-Toe</h1>
      {!gameMode ? (
        <div className="menu-container">
          <button id="friend" onClick={() => handleGameMode("friends")}>Play with a Friend</button>
          <button id="computer" onClick={() => handleGameMode("computer")}>Play with a Bot</button>
        </div>
      ) : (
        <>
          <div className="grid">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
              >
                {cell}
              </button>
            ))}
          </div>
          <p>
            {winner ? (winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`) : `Player ${isXNext ? "X" : "O"}'s Turn`}
          </p>
          <p>Scoreboard | X: {playerXWins} | O: {playerOWins} |</p>
          <div className="button-container">
          <button id="reset"
            onClick={resetGame}
          >
            Reset
          </button>
          <button id="menu"
            onClick={() => setGameMode(null)}
          >
            Back to Menu
          </button>
          </div>
        </>
      )}
    </div>
  );
}