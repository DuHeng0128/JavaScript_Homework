import React, { useState, useEffect } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
const { isValidMove, isCaptureMove, movePiece, hasValidMove } = require('../utils/chessLogic');
const { getValidMoves } = require('../utils/aiLogic');

function ChessBoard({ board, onPieceMove, playerColor }) {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        alert(`游戏结束，${winner}方胜出`);
        navigate('/');
      }, 100);
    }
  }, [gameOver, winner, navigate]);

  function handleCellClick(row, col) {
    if (gameOver) return;

    const piece = board[row][col];
    if (selectedPiece) {
      const from = selectedPosition;
      const to = { row, col };
      if (isValidMove(selectedPiece, from, to, board)) {
        let newBoard;
        if (isCaptureMove(selectedPiece, from, to, board)) {
          newBoard = capturePiece(from, to, board);
        } else {
          newBoard = movePiece(from, to, board);
        }
        setSelectedPiece(null);
        setSelectedPosition(null);
        animateMove(from, to);
        onPieceMove(from, to, newBoard);
        checkGameState(newBoard);
      } else {
        setSelectedPiece(null);
        setSelectedPosition(null);
      }
    } else if (piece) {
      setSelectedPiece(piece);
      setSelectedPosition({ row, col });
    }
  }

  function capturePiece(from, to, board) {
    const newBoard = board.map(row => row.slice());
    newBoard[to.row][to.col] = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    return newBoard;
  }

  function animateMove(from, to) {
    // 示例：
    const pieceElement = document.getElementById(`piece-${from.row}-${from.col}`);
    if (pieceElement) {
      pieceElement.classList.add('moving');
      setTimeout(() => {
        pieceElement.classList.remove('moving');
      }, 500); // 500 毫秒为示例，可以根据实际需求调整
    }
  }

  function checkGameState(board) {
    const redGeneralAlive = board.some(row => row.some(piece => piece && piece.type === 'general' && piece.color === 'red'));
    const blackGeneralAlive = board.some(row => row.some(piece => piece && piece.type === 'general' && piece.color === 'black'));

    if (!redGeneralAlive || !blackGeneralAlive) {
      setWinner(redGeneralAlive ? '红' : '黑');
      setGameOver(true);
      return;
    }

    const redHasnoMoves = (getValidMoves(board, 'red').length === 0);

    const blackHasnoMoves = (getValidMoves(board, 'black').length === 0);

    if (redHasnoMoves || blackHasnoMoves) {
      setWinner(redHasnoMoves ? '黑' : '红');
      setGameOver(true);
    }
  }

  const cellSize = 58; // 每个格子的尺寸
  const pieceOffset = (cellSize - 50) / 2; // 调整棋子在格子中的位置

  return (
    <div className="chess-container">
      <Link to="/" className="back-to-menu">
        Back to Menu
      </Link>
      <div className="chess-board">
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          // 根据 playerColor 决定棋子的位置和显示
          let adjustedRow = rowIndex;
          let adjustedCol = colIndex;

          if (playerColor === 'red') {
            // 如果玩家是红棋，调整棋子的位置
            adjustedRow = 7 - rowIndex;
            adjustedCol = 7 - colIndex;
          }

          return (
            <div
              className={`board-cell ${selectedPosition && selectedPosition.row === rowIndex && selectedPosition.col === colIndex ? 'selected' : ''}`}
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                top: adjustedRow * cellSize + 10,
                left: adjustedCol * cellSize + 20,
                width: cellSize,
                height: cellSize,
              }}
            >
              {cell ? (
                <Piece key={`piece-${rowIndex}-${colIndex}`} id={`piece-${rowIndex}-${colIndex}`} piece={cell} style={{ top: pieceOffset, left: pieceOffset }} />
              ) : null}
            </div>
          );
        })
      ))}
      </div> 
    </div>
  );
}

function Piece({ piece, style }) {
  return (
    <div className={`piece ${piece.color}`} style={style}>
      <img src={piece.image} alt={`${piece.color} ${piece.type}`} />
    </div>
  );
}

export function initializeBoard() {
  const board = Array(10).fill(null).map(() => Array(9).fill(null));
  
  const pieceImages = {
    red: {
      chariot: require('../assets/red-chariot.png'),
      horse: require('../assets/red-horse.png'),
      elephant: require('../assets/red-elephant.png'),
      advisor: require('../assets/red-advisor.png'),
      general: require('../assets/red-general.png'),
      cannon: require('../assets/red-cannon.png'),
      soldier: require('../assets/red-soldier.png')
    },
    black: {
      chariot: require('../assets/black-chariot.png'),
      horse: require('../assets/black-horse.png'),
      elephant: require('../assets/black-elephant.png'),
      advisor: require('../assets/black-advisor.png'),
      general: require('../assets/black-general.png'),
      cannon: require('../assets/black-cannon.png'),
      soldier: require('../assets/black-soldier.png')
    }
  };  
  
  // 初始化红方棋子
  board[0][0] = { type: 'chariot', color: 'red', image: pieceImages.red.chariot };
  board[0][1] = { type: 'horse', color: 'red', image: pieceImages.red.horse };
  board[0][2] = { type: 'elephant', color: 'red', image: pieceImages.red.elephant };
  board[0][3] = { type: 'advisor', color: 'red', image: pieceImages.red.advisor };
  board[0][4] = { type: 'general', color: 'red', image: pieceImages.red.general };
  board[0][5] = { type: 'advisor', color: 'red', image: pieceImages.red.advisor };
  board[0][6] = { type: 'elephant', color: 'red', image: pieceImages.red.elephant };
  board[0][7] = { type: 'horse', color: 'red', image: pieceImages.red.horse };
  board[0][8] = { type: 'chariot', color: 'red', image: pieceImages.red.chariot };
  board[2][1] = { type: 'cannon', color: 'red', image: pieceImages.red.cannon };
  board[2][7] = { type: 'cannon', color: 'red', image: pieceImages.red.cannon };
  board[3][0] = { type: 'soldier', color: 'red', image: pieceImages.red.soldier };
  board[3][2] = { type: 'soldier', color: 'red', image: pieceImages.red.soldier };
  board[3][4] = { type: 'soldier', color: 'red', image: pieceImages.red.soldier };
  board[3][6] = { type: 'soldier', color: 'red', image: pieceImages.red.soldier };
  board[3][8] = { type: 'soldier', color: 'red', image: pieceImages.red.soldier };

  // 初始化黑方棋子
  board[9][0] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
  board[9][1] = { type: 'horse', color: 'black', image: pieceImages.black.horse };
  board[9][2] = { type: 'elephant', color: 'black', image: pieceImages.black.elephant };
  board[9][3] = { type: 'advisor', color: 'black', image: pieceImages.black.advisor };
  board[9][4] = { type: 'general', color: 'black', image: pieceImages.black.general };
  board[9][5] = { type: 'advisor', color: 'black', image: pieceImages.black.advisor };
  board[9][6] = { type: 'elephant', color: 'black', image: pieceImages.black.elephant };
  board[9][7] = { type: 'horse', color: 'black', image: pieceImages.black.horse };
  board[9][8] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
  board[7][1] = { type: 'cannon', color: 'black', image: pieceImages.black.cannon };
  board[7][7] = { type: 'cannon', color: 'black', image: pieceImages.black.cannon };
  board[6][0] = { type: 'soldier', color: 'black', image: pieceImages.black.soldier };
  board[6][2] = { type: 'soldier', color: 'black', image: pieceImages.black.soldier };
  board[6][4] = { type: 'soldier', color: 'black', image: pieceImages.black.soldier };
  board[6][6] = { type: 'soldier', color: 'black', image: pieceImages.black.soldier };
  board[6][8] = { type: 'soldier', color: 'black', image: pieceImages.black.soldier };

  return board;
}

export default ChessBoard;
