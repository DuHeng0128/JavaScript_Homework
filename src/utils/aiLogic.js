const { isValidMove, movePiece, } = require('./chessLogic');

function getValidMoves(board, color) {
  const validMoves = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < board.length; toRow++) {
          for (let toCol = 0; toCol < board[toRow].length; toCol++) {
            const to = { row: toRow, col: toCol };
            if (isValidMove(piece, { row, col }, to, board)) {
              validMoves.push({ from: { row, col }, to });
            }
          }
        }
      }
    }
  }
  return validMoves;
}

function makeAIMove(board) {
  const validMoves = getValidMoves(board, 'red'); // 假设AI使用黑棋
  if (validMoves.length === 0) return null;
  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  return randomMove;
}

module.exports = {
  makeAIMove,
  getValidMoves
};