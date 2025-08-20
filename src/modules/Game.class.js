'use strict';

class Game {
  constructor(size = 4) {
    this._size = size;
    this._score = 0;
    this._board = this._createEmptyBoard();
    this._status = 'idle';
  }

  start() {
    this._board = this._createEmptyBoard();
    this._score = 0;
    this._status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  getState() {
    // Retorna uma cópia profunda do tabuleiro
    return this._board.map((row) => [...row]);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  restart() {
    this.start();
  }

  _createEmptyBoard() {
    return Array.from({ length: this._size }, () => Array(this._size).fill(0));
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this._board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _checkWinOrLose() {
    if (this._board.some((row) => row.some((cell) => cell === 2048))) {
      this._status = 'win';

      return;
    }

    if (this._isGameOver()) {
      this._status = 'lose';
    }
  }

  _isGameOver() {
    // Verifica se há células vazias
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          return false;
        }
      }
    }

    // Verifica se há movimentos possíveis
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        const current = this._board[r][c];

        if (c < this._size - 1 && current === this._board[r][c + 1]) {
          return false;
        }

        if (r < this._size - 1 && current === this._board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  // Métodos de movimento público
  moveLeft() {
    if (this._status !== 'playing') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    this._board.forEach((row, rowIndex) => {
      this._board[rowIndex] = this._moveAndMergeLeft(row);
    });

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  moveRight() {
    if (this._status !== 'playing') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    this._board = this._rotateClockwise(this._board);
    this._board = this._rotateClockwise(this._board);

    this._board.forEach((row, rowIndex) => {
      this._board[rowIndex] = this._moveAndMergeLeft(row);
    });
    this._board = this._rotateClockwise(this._board);
    this._board = this._rotateClockwise(this._board);

    if (this._didBoardChange(oldBoard)) {
      // E é usado aqui
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // moveUp
  moveUp() {
    if (this._status !== 'playing') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    // Transpõe a matriz para que as colunas se tornem linhas
    const transposedBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        transposedBoard[r][c] = this._board[c][r];
      }
    }

    // Aplica o movimento para a esquerda nas novas "linhas"
    transposedBoard.forEach((row, rowIndex) => {
      transposedBoard[rowIndex] = this._moveAndMergeLeft(row);
    });

    // Transpõe a matriz de volta
    const newBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        newBoard[r][c] = transposedBoard[c][r];
      }
    }
    this._board = newBoard;

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // moveDown
  moveDown() {
    if (this._status !== 'playing') {
      return;
    }

    const oldBoard = this._board.map((row) => [...row]);

    // Transpõe a matriz
    const transposedBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        transposedBoard[r][c] = this._board[c][r];
      }
    }

    // Inverte as linhas para simular o movimento para baixo
    transposedBoard.forEach((row, rowIndex) => {
      transposedBoard[rowIndex] = this._moveAndMergeLeft(
        row.reverse(),
      ).reverse();
    });

    // Transpõe a matriz de volta
    const newBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        newBoard[r][c] = transposedBoard[c][r];
      }
    }
    this._board = newBoard;

    if (this._didBoardChange(oldBoard)) {
      this._addRandomTile();
      this._checkWinOrLose();
    }
  }

  // Métodos auxiliares privados
  _didBoardChange(oldBoard) {
    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (oldBoard[r][c] !== this._board[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _moveAndMergeLeft(row) {
    const newRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this._score += newRow[i];
        newRow.splice(i + 1, 1);
        newRow.push(0);
      }
    }

    while (newRow.length < this._size) {
      newRow.push(0);
    }

    return newRow;
  }

  _rotateClockwise(board) {
    const newBoard = this._createEmptyBoard();

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        newBoard[c][this._size - 1 - r] = board[r][c];
      }
    }

    return newBoard;
  }
}

module.exports = Game;
