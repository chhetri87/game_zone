const cells = document.querySelectorAll('.cell');
const titleHeader = document.querySelector('#titleHeader');
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');
const restartBtn = document.querySelector('#restartBtn');
const exitBtn = document.querySelector('#exitBtn');
const xScoreDisplay = document.querySelector('#xScore');
const oScoreDisplay = document.querySelector('#oScore');

let player = 'X';
let isPauseGame = false;
let isGameStart = false;
let gameOver = false;

let xWins = 0;
let oWins = 0;

const inputCells = Array(9).fill('');

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => tapCell(cell, index));
});

function tapCell(cell, index) {
  if (cell.textContent === '' && !isPauseGame && !gameOver) {
    isGameStart = true;
    updateCell(cell, index);

    if (!checkWinner()) {
      changePlayer();
    }
  }
}

function updateCell(cell, index) {
  cell.textContent = player;
  inputCells[index] = player;
  cell.style.color = player === 'X' ? '#1892EA' : '#A737FF';
}

function changePlayer() {
  player = player === 'X' ? 'O' : 'X';
  updatePlayerIndicator();
}

function updatePlayerIndicator() {
  if (player === 'X') {
    xPlayerDisplay.classList.add('player-active');
    oPlayerDisplay.classList.remove('player-active');
  } else {
    oPlayerDisplay.classList.add('player-active');
    xPlayerDisplay.classList.remove('player-active');
  }
}

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (inputCells[a] === player && inputCells[b] === player && inputCells[c] === player) {
      declareWinner([a, b, c]);
      return true;
    }
  }

  if (inputCells.every(cell => cell !== '')) {
    declareDraw();
    return true;
  }
  return false;
}

function declareWinner(winningIndices) {
  titleHeader.textContent = `${player} WINS!`;
  titleHeader.style.fontSize = '38px';

  winningIndices.forEach(index => {
    cells[index].style.background = '#2A2343';
  });

  if (player === 'X') {
    xWins++;
    xScoreDisplay.textContent = xWins;
  } else {
    oWins++;
    oScoreDisplay.textContent = oWins;
  }

  isPauseGame = true;
  restartBtn.style.visibility = 'visible';
}

function declareDraw() {
  titleHeader.textContent = 'DRAW!';
  titleHeader.style.fontSize = '28px';
  isPauseGame = true;
  restartBtn.style.visibility = 'visible';
}

function choosePlayer(selectedPlayer) {
  if (!isGameStart && !gameOver) {
    player = selectedPlayer;
    updatePlayerIndicator();
  }
}

restartBtn.addEventListener('click', () => {
  inputCells.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.background = '';
  });

  isPauseGame = false;
  isGameStart = false;
  titleHeader.textContent = 'Choose';
  titleHeader.style.fontSize = '28px';
  restartBtn.style.visibility = 'hidden';
});

exitBtn.addEventListener('click', () => {
  gameOver = true;
  titleHeader.textContent = 'Game Ended';
  titleHeader.style.fontSize = '30px';
  cells.forEach(cell => {
    cell.removeEventListener('click', () => {});
    cell.style.cursor = 'not-allowed';
  });
  exitBtn.disabled = true;
  restartBtn.style.visibility = 'hidden';
});

