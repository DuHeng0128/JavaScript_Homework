import React, { useState } from 'react';
const ChessBoard = require('./ChessBoard').default;
const initializeBoard = require('./ChessBoard').initializeBoard;
const movePiece = require('../utils/chessLogic').movePiece;
const makeAIMove = require('../utils/aiLogic').makeAIMove;

function SinglePlayer() {
  const [board, setBoard] = useState(() => single_initializeBoard());

  function handlePieceMove(from, to, newBoard) {
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
    <div className="single-player">
      <ChessBoard board={board} onPieceMove={handlePieceMove} playerColor={'black'}/>
    </div>
  );
}

function single_initializeBoard() {
  return initializeBoard()
}

export default SinglePlayer;
