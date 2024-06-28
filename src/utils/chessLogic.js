const PIECE_TYPE = {
  GENERAL: 'general', // 将
  ADVISOR: 'advisor', // 士
  ELEPHANT: 'elephant', // 象
  HORSE: 'horse', // 马
  CHARIOT: 'chariot', // 车
  CANNON: 'cannon', // 炮
  SOLDIER: 'soldier'  // 兵
};


const BOARD_SIZE = {
  rows: 10,
  cols: 9
};

function isInBounds(pos) {
  return pos.row >= 0 && pos.row < BOARD_SIZE.rows && pos.col >= 0 && pos.col < BOARD_SIZE.cols;
}


function isValidGeneralMove(from, to) {
  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);
  // 将的移动范围仅限于9宫格
  return dRow + dCol === 1 && to.row >= 7 && to.row <= 9 && to.col >= 3 && to.col <= 5;
}

function isValidAdvisorMove(from, to) {
  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);
  // 士的移动范围仅限于9宫格
  return dRow === 1 && dCol === 1 && to.row >= 7 && to.row <= 9 && to.col >= 3 && to.col <= 5;
}

function isValidElephantMove(from, to) {
  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);
  // 象的移动范围
  return dRow === 2 && dCol === 2 && to.row <= 4 && isInBounds(to);
}

function isValidHorseMove(from, to, board) {
  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);
  // 马的移动范围
  if (dRow === 2 && dCol === 1) {
    return board[(from.row + to.row) / 2][from.col] === null; // 马脚
  } else if (dRow === 1 && dCol === 2) {
    return board[from.row][(from.col + to.col) / 2] === null; // 马脚
  }
  return false;
}

function isValidChariotMove(from, to, board) {
  // 车的移动范围
  if (from.row === to.row) {
    for (let col = Math.min(from.col, to.col) + 1; col < Math.max(from.col, to.col); col++) {
      if (board[from.row][col] !== null) return false;
    }
    return true;
  } else if (from.col === to.col) {
    for (let row = Math.min(from.row, to.row) + 1; row < Math.max(from.row, to.row); row++) {
      if (board[row][from.col] !== null) return false;
    }
    return true;
  }
  return false;
}

function isValidCannonMove(from, to, board) {
  // 炮的移动范围
  if(board[to.row][to.col] !== null){
    if (from.row === to.row) {
      let pieceCount = 0;
      for (let col = Math.min(from.col, to.col) + 1; col < Math.max(from.col, to.col); col++) {
        if (board[from.row][col] !== null) pieceCount++;
      }
      return pieceCount === 1;
    } else if (from.col === to.col) {
      let pieceCount = 0;
      for (let row = Math.min(from.row, to.row) + 1; row < Math.max(from.row, to.row); row++) {
        if (board[row][from.col] !== null) pieceCount++;
      }
      return pieceCount === 1;
    }
    return false;
  }
  else{
    if (from.row === to.row) {
      let pieceCount = 0;
      for (let col = Math.min(from.col, to.col) + 1; col < Math.max(from.col, to.col); col++) {
        if (board[from.row][col] !== null) pieceCount++;
      }
      return pieceCount === 0;
    } else if (from.col === to.col) {
      let pieceCount = 0;
      for (let row = Math.min(from.row, to.row) + 1; row < Math.max(from.row, to.row); row++) {
        if (board[row][from.col] !== null) pieceCount++;
      }
      return pieceCount === 0;
    }
    return false;
  }
}

function isValidSoldierMove(from, to, color) {
  const dRow = Math.abs(to.row - from.row);
  const dCol = Math.abs(to.col - from.col);

  if (color === 'red'){
    // 兵的移动范围
    if (from.row <= 4) { // 在己方区域
      return dRow === 1 && dCol === 0 && to.row > from.row;
    } else { // 过河
      return (dRow === 1 && dCol === 0 && to.row > from.row) || (dRow === 0 && dCol === 1);
    }
  }
  else{
    if (from.row >= 4) { // 在己方区域
      return dRow === 1 && dCol === 0 && to.row < from.row;
    } else { // 过河
      return (dRow === 1 && dCol === 0 && to.row < from.row) || (dRow === 0 && dCol === 1);
    }
  }

}

// 根据棋子类型检查移动是否合法
function isValidMove(piece, from, to, board) {
  if (!isInBounds(from) || !isInBounds(to)) return false;
  if(board[to.row][to.col] !== null){
    if (piece.color == board[to.row][to.col].color) return false;
  }

  switch (piece.type) {
    case PIECE_TYPE.GENERAL:
      return isValidGeneralMove(from, to);
    case PIECE_TYPE.ADVISOR:
      return isValidAdvisorMove(from, to);
    case PIECE_TYPE.ELEPHANT:
      return isValidElephantMove(from, to);
    case PIECE_TYPE.HORSE:
      return isValidHorseMove(from, to, board);
    case PIECE_TYPE.CHARIOT:
      return isValidChariotMove(from, to, board);
    case PIECE_TYPE.CANNON:
      return isValidCannonMove(from, to, board);
    case PIECE_TYPE.SOLDIER:
      return isValidSoldierMove(from, to, piece.color);
    default:
      return false;
  }
}

// 检查目标位置是否有棋子可以被吃掉
function isCaptureMove(piece, from, to, board) {
  return board[to.row][to.col] !== null && board[to.row][to.col].color !== piece.color;
}

// 移动棋子并更新棋盘状态
function movePiece(from, to, board) {
  const newBoard = board.map(row => row.slice());
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
}

module.exports = {
  isValidMove,
  isCaptureMove,
  movePiece,
};