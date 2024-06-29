import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from './socket';
const TwoPlayer = require('./TwoPlayer').default;


function RoomSelection() {
  const [roomNumber, setRoomNumber] = useState('');
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('roomCreated', (roomNumber) => {
      setRoomNumber(roomNumber);
      setInRoom(true);
      setPlayerColor('black');
    });

    socket.on('roomJoined', ({ roomNumber, playerColor }) => {
      setRoomNumber(roomNumber);
      setPlayerColor(playerColor);
      setInRoom(true);
    });

    socket.on('playerJoined', () => {
      console.log('A player joined the room');
    });

    socket.on('playerReady', (opponentColor) => {
      console.log(opponentColor);
      console.log(playerColor);
      if (opponentColor !== playerColor) {
        setOpponentReady(true);
      }
    });

    socket.on('gameStart', () => {
      //TwoPlayer(roomNumber);
      console.log(roomNumber);
      navigate('/twoplayer', { state: { roomNumber } });
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playerJoined');
      socket.off('playerReady');
      socket.off('gameStart');
    };
  }, [navigate, playerColor]);

  const handleCreateRoom = () => {
    socket.emit('createRoom');
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomNumber);
  };

  const handleLeaveRoom = () => {
    setInRoom(false);
    setRoomNumber('');
    setPlayerReady(false);
    setOpponentReady(false);
    socket.emit('leaveRoom', roomNumber);
  };

  const handleReady = () => {
    setPlayerReady(true);
    socket.emit('playerReady', roomNumber);
  };

  return (
    <div>
      <h2>Room Selection</h2>
      {!inRoom ? (
        <>
          <button onClick={handleCreateRoom}>Create Room</button>
          <input
            type="text"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="Enter room number"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </>
      ) : (
        <div>
          <p>Your room number is: {roomNumber}</p>
          <p>Your color is: {playerColor}</p> {/* 显示玩家的颜色 */}
          <button onClick={handleLeaveRoom}>Leave Room</button>
          <button onClick={handleReady} disabled={playerReady}>
            {playerReady ? 'Ready' : 'Not Ready'}
          </button>
          {playerReady && <p>Waiting for opponent to be ready...</p>}
          {opponentReady && <p>Opponent is ready!</p>}
        </div>
      )}
      <Link to="/">Back to Menu</Link>
    </div>
  );
}

export default RoomSelection;
