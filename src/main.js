// function sum(a, b) {
//   return a + b;
// }
// module.exports = sum;
// const { Ship } = require("./ship");
// const { Gameboard } = require("./gameboard");

import "./style.css";
import Ship from "./ship";
import Gameboard from "./gameboard";

const enemyBoard = document.querySelector("#gameboard-enemy");
const playerBoard = document.querySelector("#gameboard-player");
const buttonPlaceFleet = document.querySelector("#place-fleet");

const boardPlayer = new Gameboard(10, 10);
const boardEnemy = new Gameboard(10, 10);

const submarine1 = new Ship(1);
const submarine2 = new Ship(1);
const destroyer1 = new Ship(2);
const destroyer2 = new Ship(2);
const cruiser = new Ship(3);
const battleship = new Ship(4);
const carrier = new Ship(5);

const submarine1Enemy = new Ship(1);
const submarine2Enemy = new Ship(1);
const destroyer1Enemy = new Ship(2);
const destroyer2Enemy = new Ship(2);
const cruiserEnemy = new Ship(3);
const battleshipEnemy = new Ship(4);
const carrierEnemy = new Ship(5);

const ships = [
  submarine1,
  submarine2,
  destroyer1,
  destroyer2,
  cruiser,
  battleship,
  carrier,
];

const shipsEnemy = [
  submarine1Enemy,
  submarine2Enemy,
  destroyer1Enemy,
  destroyer2Enemy,
  cruiserEnemy,
  battleshipEnemy,
  carrierEnemy,
];

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

function randomPlacement(gameboard, fleet) {
  for (const ship of fleet) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let orientation = ["vertical", "horizontal"][Math.random() < 0.5 ? 0 : 1];
    while (!gameboard.isValidPlacement(ship, row, col, orientation)) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      orientation = ["vertical", "horizontal"][Math.random() < 0.5 ? 0 : 1];
    }
    gameboard.placeShip(ship, row, col, orientation);
  }
}

function wipeBoard(gameboard) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.getElementById(`${row}-${col}`);
      cell.classList.remove("ship");
      gameboard.grid[row][col] = null;
    }
  }
}

function showFleet(gameboard) {}

randomPlacement(boardPlayer, ships);
displayShips(boardPlayer);

randomPlacement(boardEnemy, shipsEnemy);
displayShips(boardEnemy, true);

buttonPlaceFleet.addEventListener("click", () => {
  wipeBoard(boardPlayer);
  randomPlacement(boardPlayer, ships);
  displayShips(boardPlayer);
});

cells.forEach((cell) =>
  cell.addEventListener("click", (e) => {
    e.target.classList.add("hit");
    boardPlayer.receiveAttack(e.target.id[0], e.target.id[2]);
  }),
);

cellsEnemy.forEach((cell) =>
  cell.addEventListener("click", (e) => {
    e.target.classList.add("hit");
    boardEnemy.receiveAttack(e.target.id[0], e.target.id[2]);
  }),
);

window.ships = ships;
window.board = boardPlayer;
window.board2 = boardEnemy;
