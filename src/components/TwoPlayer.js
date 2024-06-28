import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
const ChessBoard = require('./ChessBoard').default;
const initializeBoard = require('./ChessBoard').initializeBoard;
const movePiece = require('../utils/chessLogic').movePiece;

const socket = io('http://localhost:5000'); // 确保此处与后端CORS配置一致

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function TwoPlayer(roomNumber) {
  const [board, setBoard] = useState(initializeBoard());
  const [playerColor, setPlayerColor] = useState(null);


  const handlePieceMove = (from, to) => {
    const piece = board[from.row][from.col]; 
    socket.emit('movePiece', { roomNumber, piece, from, to, board}); 
  };

  useEffect(() => {
    socket.on('roomJoined', ({ Number, playerColor }) => {
      setPlayerColor(playerColor);
    });

    return () => {
      socket.off('roomJoined');
      socket.off('roomCreated');
    };
  }, []);

  useEffect(() => {
    const handlePieceMoved = ({ from, to }) => {
      const newBoard = [...board];
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      setBoard(newBoard);
    };

    const handleInvalidMove = (message) => {
      alert(message);
    };

    socket.on('pieceMoved', ({ from, to }) => {
      const newBoard = [...board];
      newBoard[to.row][to.col] = newBoard[from.row][from.col];
      newBoard[from.row][from.col] = null;
      setBoard(newBoard);
    });
    socket.on('invalidMove', handleInvalidMove);

    return () => {
      socket.off('pieceMoved', handlePieceMoved);
      socket.off('invalidMove', handleInvalidMove);
    };
  }, [board]);

  return (
    <div>
      <h2>Two Player Game</h2>
      <ChessBoard board={board} onPieceMove={handlePieceMove} playerColor={playerColor} />
    </div>
  );
}

export default TwoPlayer;
