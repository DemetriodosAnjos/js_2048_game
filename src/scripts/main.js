'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// Elementos da interface do usuário
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const messageLoseElement = document.querySelector('.message-lose');
const messageWinElement = document.querySelector('.message-win');
const messageStartElement = document.querySelector('.message-start');

// Atualiza a exibição do tabuleiro e da pontuação na interface
function updateUI() {
  const boardState = game.getState();
  const score = game.getScore();

  // Atualiza a pontuação
  scoreElement.textContent = score;

  // Encontra todas as células do tabuleiro
  const cells = document.querySelectorAll('.game-field .field-cell');

  // Itera sobre as células e atualiza o conteúdo com base no estado do jogo
  cells.forEach((cell, index) => {
    // Calcula a linha e coluna com base no índice
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    const cellValue = boardState[rowIndex][colIndex];

    // Remove classes de tile anteriores para garantir a limpeza
    cell.className = 'field-cell';

    if (cellValue > 0) {
      // Adiciona a classe e o valor se a célula não estiver vazia
      cell.classList.add(`field-cell--${cellValue}`);
      cell.textContent = cellValue;
    } else {
      // Limpa o conteúdo se a célula estiver vazia
      cell.textContent = '';
    }
  });

  // Mostra ou esconde as mensagens de status do jogo
  const gameStatus = game.getStatus();

  if (gameStatus === 'lose') {
    messageLoseElement.classList.remove('hidden');
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWinElement.classList.remove('hidden');
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
  } else {
    messageLoseElement.classList.add('hidden');
    messageWinElement.classList.add('hidden');
  }
}

// Lida com o pressionar de teclas do usuário
function handleKeyDown(e) {
  // Ignora o movimento se o jogo não estiver no status 'playing'
  if (game.getStatus() !== 'playing') {
    return;
  }

  // Mapeia as teclas para os métodos de movimento
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  // Atualiza a interface após cada movimento
  updateUI();
}

// Lida com o clique no botão de "Start"
function handleStartGame() {
  game.start();
  messageStartElement.classList.add('hidden');
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  updateUI();
}

// Lida com o clique para reiniciar o jogo
function handleRestart() {
  game.restart();
  messageStartElement.classList.add('hidden');
  messageLoseElement.classList.add('hidden');
  messageWinElement.classList.add('hidden');
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  updateUI();
}

// Adiciona os event listeners
document.addEventListener('keydown', handleKeyDown);
startButton.addEventListener('click', handleStartGame);
restartButton.addEventListener('click', handleRestart);

// A função init() não é mais necessária, pois o jogo
// agora espera o clique no botão de Start
// para iniciar.
