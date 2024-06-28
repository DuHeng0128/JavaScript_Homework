import React, { useState } from 'react';
const ChessBoard = require('./ChessBoard').default;
const initializeBoard = require('./ChessBoard').initializeBoard;
const movePiece = require('../utils/chessLogic').movePiece;
const makeAIMove = require('../utils/aiLogic').makeAIMove;

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

function SkillMode() {
  const [board, setBoard] = useState(() => this_initializeBoard());

  function handlePieceMove(from, to, newBoard) {
    newBoard[5][0] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][1] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][2] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][3] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][4] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][5] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][6] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][7] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    newBoard[5][8] = { type: 'chariot', color: 'black', image: pieceImages.black.chariot };
    setBoard(newBoard);
    setTimeout(() => {
      const aiMove = makeAIMove(newBoard);
      if (aiMove) {
        const { from: aiFrom, to: aiTo } = aiMove;
        const updatedBoard = movePiece(aiFrom, aiTo, newBoard);
        setBoard(updatedBoard);
      }
    }, 1000);
  }

  return (
    <div className="skill-mode">
      <ChessBoard board={board} onPieceMove={handlePieceMove} playerColor={'black'}/>
    </div>
  );
}

function this_initializeBoard() {
  return initializeBoard()
}

export default SkillMode;
