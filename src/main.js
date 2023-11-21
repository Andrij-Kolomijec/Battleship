// function sum(a, b) {
//   return a + b;
// }
// module.exports = sum;
// const { Ship } = require("./ship");
// const { Gameboard } = require("./gameboard");

import "./style.css";
import Battleship from "./battleship.jpg";
import Ship from "./ship";
import Gameboard from "./gameboard";

const enemyBoard = document.querySelector("#gameboard-enemy");
const playerBoard = document.querySelector("#gameboard-player");
const buttonPlaceFleet = document.querySelector("#place-fleet");
const buttonStart = document.querySelector("#start");
const textField = document.querySelector("#text");

let boardPlayer = new Gameboard(10, 10);
let boardEnemy = new Gameboard(10, 10);

let ships = {};
let shipsEnemy = {};

const initializeShips = () => {
  ships = {
    submarine1: new Ship(1),
    submarine2: new Ship(1),
    destroyer1: new Ship(2),
    destroyer2: new Ship(2),
    cruiser: new Ship(3),
    battleship: new Ship(4),
    carrier: new Ship(5),
  };
  shipsEnemy = {
    submarine1Enemy: new Ship(1),
    submarine2Enemy: new Ship(1),
    destroyer1Enemy: new Ship(2),
    destroyer2Enemy: new Ship(2),
    cruiserEnemy: new Ship(3),
    battleshipEnemy: new Ship(4),
    carrierEnemy: new Ship(5),
  };
};

initializeShips();

const createPlayerBoard = (() => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", `${row}-${col}`);
      playerBoard.appendChild(cell);
    }
  }
})();

const createEnemyBoard = (() => {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell-enemy");
      cell.setAttribute("id", `${row}-${col}-enemy`);
      enemyBoard.appendChild(cell);
    }
  }
})();

const cells = document.querySelectorAll(".cell");
const cellsEnemy = document.querySelectorAll(".cell-enemy");

function displayShips(board, enemy = false) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (board.grid[row][col] && !enemy) {
        const cell = document.getElementById(`${row}-${col}`);
        cell.classList.add("ship");
      } else if (board.grid[row][col] && enemy) {
        const cell = document.getElementById(`${row}-${col}-enemy`);
        cell.classList.add("ship-enemy");
      }
    }
  }
}

function randomPlacement(board, fleet) {
  for (const ship in fleet) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let orientation = ["vertical", "horizontal"][Math.random() < 0.5 ? 0 : 1];
    while (!board.isValidPlacement(fleet[ship], row, col, orientation)) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      orientation = ["vertical", "horizontal"][Math.random() < 0.5 ? 0 : 1];
    }
    board.placeShip(fleet[ship], row, col, orientation);
  }
}

function wipeBoards() {
  const hitCells = document.querySelectorAll(".hit, .ship, .ship-enemy");
  hitCells.forEach((cell) => {
    cell.classList.remove("ship");
    cell.classList.remove("hit");
    cell.classList.remove("ship-enemy");
  });
  boardPlayer = new Gameboard(10, 10);
  boardEnemy = new Gameboard(10, 10);
  cellsEnemy.forEach((i) => i.removeEventListener("click", handlePlayerClick));
  initializeShips();
}

function showSunkFleet(fleet, enemy = false) {
  for (const ship in fleet) {
    if (fleet[ship].isSunk() && !enemy) {
      const shownSunkShip = document.querySelector(`.${ship}-player`);
      const childDivs = shownSunkShip.querySelectorAll("div");
      childDivs.forEach((child) => {
        child.classList.add("hit");
        child.classList.add("ship");
      });
    } else if (fleet[ship].isSunk() && enemy) {
      const shownSunkShip = document.querySelector(
        `.${ship.slice(0, -5)}-enemy`,
      );
      const childDivs = shownSunkShip.querySelectorAll("div");
      childDivs.forEach((child) => {
        child.classList.add("hit");
        child.classList.add("ship");
      });
    }
  }
}

randomPlacement(boardPlayer, ships);
displayShips(boardPlayer);

randomPlacement(boardEnemy, shipsEnemy);
displayShips(boardEnemy, true);

buttonPlaceFleet.addEventListener("click", () => {
  textField.innerText = "Place your fleet!";
  wipeBoards();
  randomPlacement(boardPlayer, ships);
  randomPlacement(boardEnemy, shipsEnemy);
  displayShips(boardPlayer);
  displayShips(boardEnemy, true);
  window.ships = shipsEnemy;
  window.board = boardPlayer;
  window.board2 = boardEnemy;
});

function playerAttack(e) {
  e.target.classList.add("hit");
  boardEnemy.receiveAttack(e.target.id[0], e.target.id[2]);
  showSunkFleet(shipsEnemy, true);
}

function computerAttack() {
  let row = Math.floor(Math.random() * 10);
  let col = Math.floor(Math.random() * 10);
  while (boardPlayer.attackedCells.includes(`${row}-${col}`)) {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
  }
  const target = document.getElementById(`${row}-${col}`);
  target.classList.add("hit");
  boardPlayer.receiveAttack(row, col);
  showSunkFleet(ships);
}

function handlePlayerClick(e) {
  if (
    !boardEnemy.attackedCells.includes(`${e.target.id[0]}-${e.target.id[2]}`)
  ) {
    playerAttack(e);
    computerAttack();
  }
}

function gameplay() {
  textField.innerText = "Game has started!";
  function setupPlayerTurn() {
    cellsEnemy.forEach((cell) =>
      cell.addEventListener("click", handlePlayerClick),
    );
  }
  setupPlayerTurn();
}

buttonStart.addEventListener("click", gameplay);

window.ships = shipsEnemy;
window.board = boardPlayer;
window.board2 = boardEnemy;
