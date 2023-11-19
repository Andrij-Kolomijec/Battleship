// function sum(a, b) {
//   return a + b;
// }

// module.exports = sum;

// const { Ship } = require("./ship");
// const { Gameboard } = require("./gameboard");

import "./style.css";
import Ship from "./ship";
import Gameboard from "./gameboard";

const playerBoards = document.querySelectorAll(".gameboard");

playerBoards.forEach((board) => {
  // const board = new Gameboard(10, 10);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
});

const ship1 = new Ship(1);
const ship2 = new Ship(1);
const ship3 = new Ship(2);
const ship4 = new Ship(2);
const ship5 = new Ship(3);
const ship6 = new Ship(4);
const ship7 = new Ship(5);

const board = new Gameboard(10, 10);

board.placeShip(ship1, 1, 1, "horizontal");
board.placeShip(ship2, 0, 8, "vertical");
board.placeShip(ship3, 4, 3, "horizontal");
board.placeShip(ship4, 6, 5, "vertical");
board.placeShip(ship5, 6, 0, "horizontal");
board.placeShip(ship6, 3, 9, "vertical");
board.placeShip(ship7, 9, 2, "horizontal");

board.receiveAttack(2, 3);
board.receiveAttack(2, 4);
board.receiveAttack(2, 5);
board.receiveAttack(5, 5);
board.display();

window.ship1 = ship1;
window.ship2 = ship2;
window.board = board;
