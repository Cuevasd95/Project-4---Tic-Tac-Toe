/*=================================
Module Pattern wrapping the JS code
=================================*/
const ticTacToe = (function () {

/*=================================
Variables
=================================*/
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const square = document.getElementsByClassName("boxes")[0];
const squares = document.getElementsByClassName("box");
const boardScreen = document.getElementById('board');
const wins = [7, 56, 448, 73, 146, 292, 273, 84];
const div = document.createElement('div');
const header = document.createElement('header');
const h1 = document.createElement('h1');
const button = document.createElement('a');
const button2 = document.createElement('a');
const buttonLevel = document.createElement('button');
const p = document.createElement('p');
const form = document.createElement('form');
const radio1 = document.createElement('input');
const label1 = document.createElement('label');
const radio2 = document.createElement('input');
const label2 = document.createElement('label');
const radio3 = document.createElement('input');
const label3 = document.createElement('label');
const radio4 = document.createElement('input');
const label4 = document.createElement('label');
const player1Span = document.createElement('span');
const player2Span = document.createElement('span');
let player1Score = 0;
let player2Score = 0;
let squaresFilled = 0;
let win = false;
let remainingSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let outsideSquares = [0, 2, 4, 6, 8];
let player1Active = true;
let player2Play = false;
let computerPlay = false;
let randomNum;
let player1Name;
let player2Name;
let gameLevel;
let boxClaimed = false;
/*=================================
Value for each box
=================================*/
// |  1 |   2 |   4 |
// |  8 |  16 |  32 |
// | 64 | 128 | 256 |
let squaresValue = [1, 2, 4, 8, 16, 32, 64, 128, 256];

let boxWinOptions = [
  [6, 72, 272],
  [144, 5],
  [3, 80, 288],
  [65, 48],
  [257, 68, 40, 130],
  [24, 260],
  [9, 20, 384],
  [18, 320],
  [36, 17, 192]
];

let boxWins = ['boxWin1', 'boxWin1', 'boxWin2', 'boxWin3', 'boxWin4', 'boxWin5', 'boxWin6', 'boxWin7', 'boxWin8'];

/*=================================
Simple fuctions
=================================*/
function getRandom(num) {
  return Math.floor(Math.random() * num);
}

function removeClass(from, className) {
  from.classList.remove(className);
}

function addClass(from, className) {
  from.classList.add(className);
}

/*=================================
Player functions
=================================*/
function getPlayer1Name() {
  if (!player1Name) {
      player1Name = prompt('whats player1\'s name');
  }
  if (player1Name === null || player1Name.length === 0) {
      player1Name = 'Player 1';
  }
  addName(player1, player1Span, player1Name);
}

/*=================================
Setting Screens
=================================*/
function setScreen() {
  div.remove();
  boardScreen.style.display = 'block';
  resetSquares();
  gameLevels();
  addClass(player1, 'active');
  removeClass(player2, 'active');
}

function createButton(button, buttonClass, text, type = null) {
  if (type !== null) {
      button.setAttribute('type', type);
  }
  button.setAttribute('class', buttonClass);
  button.setAttribute('href', '#');
  button.textContent = text;
}

function createRadioButtons(radio, label, level, text) {
  createButton(buttonLevel, 'button', 'Go', 'submit');
  radio.type = 'radio';
  radio.setAttribute('class', 'radio');
  radio.setAttribute('name', 'level');
  radio.setAttribute('required', 'required');
  radio.id = 'level';
  radio.value = level;
  label.setAttribute('for', 'level');
  label.textContent = text;
}

function getRadioCheckedValue() {
  let levels = document.getElementsByName('level');
  for (let i = 0; i < levels.length; i++) {
      if (levels[i].checked) {
          return levels[i].value;
      }
  }
}

function createScreen() {
  div.className = 'screen screen-win ';
  h1.textContent = 'Tic Tac Toe';
  button.setAttribute('href', '#');
  button.setAttribute('class', 'button');
  p.setAttribute('class', 'message');
  document.body.appendChild(div);
  div.appendChild(header);
  header.appendChild(h1);
  header.appendChild(p);
  header.appendChild(button);
  header.appendChild(button2);
  createButton(button2, 'button button2', 'Play against Computer');
  createRadioButtons(radio1, label1, 'easy', 'Easy');
  createRadioButtons(radio2, label2, 'medium', 'Medium');
  createRadioButtons(radio3, label3, 'difficult', 'Difficult');
  createRadioButtons(radio4, label4, 'impossible', 'Impossible');
  header.appendChild(form);
  form.style.visibility = 'hidden';
  form.appendChild(label1);
  form.appendChild(radio1);
  form.appendChild(label2);
  form.appendChild(radio2);
  form.appendChild(label3);
  form.appendChild(radio3);
  form.appendChild(label4);
  form.appendChild(radio4);
  form.appendChild(buttonLevel);
}

/*=================================
Gameplay functions
=================================*/
const startGame = () => {
  createScreen();
  p.remove();
  div.className = 'screen screen-start';
  div.setAttribute('id', 'start');
  button.textContent = 'Play against opponent';
  chooseOpponent()
};

function turn(className) {
  if (player1Active) {
      removeClass(player1, className);
      addClass(player2, className);
      player1Active = false;
  } else {
      addClass(player1, className);
      removeClass(player2, className);
      player1Active = true;
  }
}

function chooseOpponent() {
  button.addEventListener('click', () => {
      playAgain();
  });
  button2.addEventListener('click', () => {
      form.style.visibility = 'visible';
  });
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      gameLevel = getRadioCheckedValue();
      playAgainComputer();
  });
}

function addName(player, span, name) {
  player.appendChild(span);
  span.setAttribute('class', 'name');
  span.textContent = name;
}

function calculateScore() {
  for (let i = 0; i < squares.length; i++) {
      squares[i].value = (Math.pow(2, i));
  }
}

function squareClaimed(e, boxClass) {
  addClass(e.target, boxClass);
  calculateScore();
  squaresFilled += 1;

}

function removeSquare(square) {
  let index = remainingSquares.indexOf(square);
  remainingSquares.splice(index, 1);
}

const isSquareEmpty = () => {
  function isEmpty(box) {
      if (!box.classList.contains('box-filled-1') && !box.classList.contains('box-filled-2')) {
          return true;
      }
  }

square.addEventListener('click', function (e) {
  if (isEmpty(e.target)) {
      if (player1Active) {
          squareClaimed(e, 'box-filled-1');
          player1Score += e.target.value;
          checkIfWinner();
          removeSquare(squaresValue.indexOf(e.target.value)); //find out the index of the square clicked
          turn('active');
          if (computerPlay) {
              boxClaimed = false;
              gameLevels();
              computersTurn();
              turn('active');
          }
      } else if (player2Play) {
          squareClaimed(e, 'box-filled-2');
          player2Score += e.target.value;
          checkIfWinner();
          turn('active');
      }
  }

});
square.addEventListener('mouseover', function (e) {
  if (isEmpty(e.target)) {
      if (player1Active) {
          e.target.style.backgroundImage = "url(img/o.svg)";
      } else {
          e.target.style.backgroundImage = "url(img/x.svg)";
      }
  }
});
square.addEventListener('mouseout', function (e) {
  e.target.style.backgroundImage = "";
});
};

/*=================================
Replay functions
=================================*/
function playAgain() {
  setScreen();
  player2Play = true;
  computerPlay = false;
  player1Active = true;
  getPlayer1Name();
  if (!player2Name || player2Name === 'Super Computer') {
      player2Name = prompt('whats player2\'s name');
  }
  if (player2Name === null || player2Name.length === 0) {
      player2Name = 'Player 2';
  }
  addName(player2, player2Span, player2Name);
}

function playAgainComputer() {
  setScreen();
  getPlayer1Name();
  computerPlay = true;
  player2Name = 'Super Computer';
  addName(player2, player2Span, player2Name);
  gameLevels();
  computersTurn();
}

function resetSquares() {
  player1Score = 0;
  player2Score = 0;
  squaresFilled = 0;
  win = false;
  remainingSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  randomNum = 10;
  boxWinOptions = [
      [6, 72, 272], [144, 5], [3, 80, 288], [65, 48], [257, 68, 40, 130], [24, 260], [9, 20, 384], [18, 320], [36, 17, 192]
  ];

  for (let i = 0; i < squares.length; i++) {
      removeClass(squares[i], 'box-filled-1');
      removeClass(squares[i], 'box-filled-2');
  }
}

/*=================================
Setting computer difficulty
=================================*/
function calculateMediumLevel() {
  boxWins[getRandom(9)] = [];
  boxWins[getRandom(9)] = [];
}

function calculateDifficultLevel() {
  boxWinOptions[getRandom(9)].splice(getRandom(2), 1);
  boxWinOptions[getRandom(9)].splice(getRandom(2), 1);
}

function gameLevels() {
  if (gameLevel === 'easy') {
      for (let i = 0; i < boxWins.length; i++) {
          boxWins[i] = [];
      }
  }
  else if (gameLevel === 'medium') {
      for (let i = 0; i < boxWins.length; i++) {
          boxWins[i] = boxWinOptions[i];
          calculateMediumLevel();
      }
  } else if (gameLevel === 'difficult') {

      for (let i = 0; i < boxWins.length; i++) {
          boxWins[i] = boxWinOptions[i];
          calculateDifficultLevel();
      }
  }
  else if (gameLevel === 'impossible') {
      for (let i = 0; i < boxWins.length; i++) {
          boxWins[i] = boxWinOptions[i];
      }
  }
}

/*=================================
AI functions
=================================*/
function winOrDefend(boxWinArray, box, player) {
  for (let i = 0; i < squares.length; i++) {
      if ((boxWinArray[i] & player) === boxWinArray[i]) {
          claimSquare(box);
      }
  }
}

function attack() {
  if (remainingSquares.includes(4)) {
      randomNum = 4;
  } else if (squaresFilled < 6) {
      randomNum = getRandom(outsideSquares.length);
      randomNum = outsideSquares[randomNum];
  } else {
      randomNum = getRandom(remainingSquares.length);
      randomNum = remainingSquares[randomNum];
  }
}

function claimSquare(box) {
  boxClaimed = true;
  addClass(squares[box], 'box-filled-2');
  calculateScore();
  squaresFilled += 1;
  player2Score += squares[box].value;
  removeSquare(box);
  checkIfWinner();
}

const computersTurn = () => {
  while (!boxClaimed) {

      for (let i = 0; i < boxWins.length; i++) {
          if (!boxClaimed && remainingSquares.includes(i)) {
              winOrDefend(boxWins[i], i, player2Score); //check to see if he can win
              winOrDefend(boxWins[i], i, player1Score); //check if he needs to defend

          }
      }
      attack();

      if (!boxClaimed && remainingSquares.includes(randomNum)) {
          claimSquare(randomNum);
          break;
      } else if (remainingSquares.length === 0) {
          checkIfWinner();
          break;
      }
  }
};

/*=================================
Ending game functions
=================================*/
const checkIfWinner = () => {

  for (let i = 0; i < squares.length; i++) {
      if ((wins[i] & player1Score) === wins[i]) {
          win = true;
          endGame('screen-win-one', 'Winner is ' + player1Name);
      } else if ((wins[i] & player2Score) === wins[i]) {
          win = true;
          endGame('screen-win-two', 'Winner is ' + player2Name);
      }
  }
  if (!win && squaresFilled === 9) {
      endGame('screen-win-tie', 'Tie')
  }
};
const endGame = (screenClass, text) => {
  resetSquares();
  createScreen();
  boardScreen.style.display = 'none';

  div.className += screenClass;
  div.setAttribute('id', 'finish');
  if (computerPlay) {
      button2.textContent = 'play again against computer';
      button.textContent = 'try a game against an opponent';
  } else {
      button.textContent = 'play again';
      button2.textContent = 'try beat the computer';
  }
  p.textContent = text;
  chooseOpponent()
};

boardScreen.style.display = 'none';
startGame();
isSquareEmpty();

}());
