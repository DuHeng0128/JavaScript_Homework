const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // 引入cors中间件
const { isValidMove } = require('../src/utils/chessLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000"], // 允许的前端地址
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// 使用cors中间件
app.use(cors());

const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', () => {
    const roomNumber = generateRoomNumber();
    rooms[roomNumber] = { players: [{ id: socket.id, color: 'black' }], currentPlayer: 1, readyStatus: [false, false]}; 
    socket.join(roomNumber);
    socket.emit('roomCreated', roomNumber);
    console.log(`Room ${roomNumber} created by ${socket.id}`);
  });

  socket.on('joinRoom', (roomNumber) => {
    const room = rooms[roomNumber];
    if (room && room.players.length < 2) {
      const playerColor = room.players.length === 1 ? 'red' : 'black';
      room.players.push({ id: socket.id, color: playerColor });
      socket.join(roomNumber);
      socket.emit('roomJoined', { roomNumber, playerColor});
      io.to(roomNumber).emit('playerJoined');
      console.log(`${socket.id} joined Room ${roomNumber}`);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('playerReady', (roomNumber) => {
    const room = rooms[roomNumber];
    if (room) {
      const playerIndex = room.players.findIndex(player => player.id === socket.id);
      const playerColor = playerIndex === 0 ? 'black' : 'red';
      console.log(playerIndex);
      if (playerIndex !== -1) {
        room.readyStatus[playerIndex] = true;
        console.log(playerColor);
        io.to(roomNumber).emit('playerReady', playerColor);
        if (room.readyStatus.every(status => status === true)) {
          // 发送游戏开始事件，包含跳转路径信息
          io.to(roomNumber).emit('gameStart', '/twoplayer?room=' + roomNumber);
          console.log(`Game started in Room ${roomNumber}`);
        }
      }
    }
  });

  socket.on('movePiece', (data) => {
    const { roomNumber, piece, from, to, board} = data; // 解构出 piece 对象
    if (isValidMove(piece, from, to, board)) {
      console.log(roomNumber);
      io.to(roomNumber).emit('pieceMoved', { from, to });
    } else {
      socket.emit('invalidMove', 'Invalid move');
    }
  });

  socket.on('disconnect', () => {
    for (const roomNumber in rooms) {
      const room = rooms[roomNumber];
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        room.readyStatus.splice(playerIndex, 1);
        if (room.players.length === 0) {
          delete rooms[roomNumber];
          console.log(`Room ${roomNumber} deleted`);
        } else {
          io.to(roomNumber).emit('playerLeft', playerIndex + 1);
        }
        break;
      }
    }
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function generateRoomNumber() {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}