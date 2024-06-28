let rooms = {};

function createRoom(roomNumber, playerId) {
  rooms[roomNumber] = {
    players: [playerId],
    currentPlayer: 1, // 默认第一个进入的玩家执红子
  };
}

function joinRoom(roomNumber, playerId) {
  if (rooms[roomNumber]) {
    if (rooms[roomNumber].players.length < 2) {
      rooms[roomNumber].players.push(playerId);
      return true;
    } else {
      return false; // 房间已满
    }
  } else {
    return false; // 房间不存在
  }
}

function getRoom(roomNumber) {
  return rooms[roomNumber];
}

module.exports = { createRoom, joinRoom, getRoom };
