import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./components/winning-combinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns) {

  let currentPlayer = 'X';
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const[players,setPlayers]=useState({
    X :'player 1',
    O :'player 2'
  })

  const activePlayer = deriveActivePlayer(gameTurns);

  // Create a copy of the game board and fill it with current moves
  const gameBoard = initialGameBoard.map(array => [...array]);
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }

  // Determine winner
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
      break;
    }
  } 
  const hasDraw =gameTurns.length==9 && !winner; 
  function handleRestrat(){
    setGameTurns([]);
  }

  function handleSelectSquare(rowIndex, colIndex) {
    // Prevent selecting a filled square or playing after game ends
    if (gameBoard[rowIndex][colIndex] !== null || winner) return;

    setGameTurns(prev => {
      const activePlayer = deriveActivePlayer(prev);
      const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: activePlayer }, ...prev];
      return updatedTurns;
    });
  }
  function handlePlayerNameChange(symbol,newName){
    setPlayers(prevPlayers =>{
      return{
        ...prevPlayers,
        [symbol] :newName
      }
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player-1" symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange} />
          <Player initialName="Player-2" symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner}  onSelect={handleRestrat}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
