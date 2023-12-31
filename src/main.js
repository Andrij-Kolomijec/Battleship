import "./style.css";
import Battleship from "./battleship.jpg";
import Github from "./github.svg";
import favicon from "./favicon.svg";
import Ship from "./ship";
import Gameboard from "./gameboard";

document.querySelector('link[rel="icon"]').href = favicon;
document.querySelector("img.icon").src = Github;

const enemyBoard = document.querySelector("#gameboard-enemy");
const playerBoard = document.querySelector("#gameboard-player");
const buttonPlaceFleet = document.querySelector("#place-fleet");
const buttonStart = document.querySelector("#start");
const textField = document.querySelector("#text");

let boardPlayer = new Gameboard(10, 10);
let boardEnemy = new Gameboard(10, 10);

let ships = {};
let shipsEnemy = {};

function initializeShips() {
  ships = {
    submarine1: new Ship(1, "submarine1"),
    submarine2: new Ship(1, "submarine2"),
    destroyer1: new Ship(2, "destroyer1"),
    destroyer2: new Ship(2, "destroyer2"),
    cruiser: new Ship(3, "cruiser"),
    battleship: new Ship(4, "battleship"),
    carrier: new Ship(5, "carrier"),
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
}

function createPlayerBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", `${row}-${col}`);
      playerBoard.appendChild(cell);
    }
  }
}

function createEnemyBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell-enemy");
      cell.setAttribute("id", `${row}-${col}-enemy`);
      enemyBoard.appendChild(cell);
    }
  }
}
initializeShips();
createPlayerBoard();
createEnemyBoard();
const cellsEnemy = document.querySelectorAll(".cell-enemy");

/* displays ships on the visible board according
to the board object */
function displayShips(board, enemy = false) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (board.grid[row][col] && !enemy) {
        const cell = document.getElementById(`${row}-${col}`);
        cell.classList.add("ship");
        cell.draggable = true;
      } else if (board.grid[row][col] && enemy) {
        const cell = document.getElementById(`${row}-${col}-enemy`);
        cell.classList.add("ship-enemy");
      }
    }
  }
}

/* places ships on random on the board */
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

/* wipes added classes and overwrites existing boards with
empty ones, removes event listeners from enemy board */
function wipeBoards() {
  const usedCells = document.querySelectorAll(".hit, .ship, .ship-enemy");
  usedCells.forEach((cell) => {
    cell.classList.remove("ship");
    cell.classList.remove("hit");
    cell.classList.remove("ship-enemy");
  });
  boardPlayer = new Gameboard(10, 10);
  boardEnemy = new Gameboard(10, 10);
  // eslint-disable-next-line no-use-before-define
  cellsEnemy.forEach((i) => i.removeEventListener("click", handlePlayerClick));
}

/* for every ship in the fleet checks if the ship 
is sunk and colors the center ship red if it is */
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
  document.querySelector("#tooltip").style.display = "block";
  buttonPlaceFleet.innerText = "Random placement";
  wipeBoards();
  initializeShips();
  randomPlacement(boardPlayer, ships);
  randomPlacement(boardEnemy, shipsEnemy);
  displayShips(boardPlayer);
  displayShips(boardEnemy, true);
  board.addEventListener("dragstart", dragStart);
  board.addEventListener("dragover", dragOver);
  board.addEventListener("dragenter", dragEnter);
  board.addEventListener("dragleave", dragLeave);
  board.addEventListener("drop", dragDrop);
  board.addEventListener("dragend", dragEnd);
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
    if (boardEnemy.checkVictory()) {
      textField.innerText = "You win!";
      cellsEnemy.forEach((i) =>
        i.removeEventListener("click", handlePlayerClick),
      );
      return;
    }
    computerAttack();
    if (boardPlayer.checkVictory()) {
      textField.innerText = "You loose!";
      cellsEnemy.forEach((i) =>
        i.removeEventListener("click", handlePlayerClick),
      );
    }
  }
}

function setupPlayerTurn() {
  cellsEnemy.forEach((cell) =>
    cell.addEventListener("click", handlePlayerClick),
  );
}

function gameplay() {
  textField.innerText = "Game has started!";
  buttonPlaceFleet.innerText = "New game";
  document.querySelector("#tooltip").style.display = "none";
  setupPlayerTurn();
}

const board = document.querySelector("#gameboard-player");
let orientation;
const temp = { length: null };
let possibleCells = [];

buttonStart.addEventListener("click", () => {
  gameplay();
  board.removeEventListener("dragstart", dragStart);
  board.removeEventListener("dragover", dragOver);
  board.addEventListener("dragenter", dragEnter);
  board.addEventListener("dragleave", dragLeave);
  board.removeEventListener("drop", dragDrop);
  board.removeEventListener("dragend", dragEnd);
});

function dragStart(e) {
  if (e.target.classList.contains("ship")) {
    const row = e.target.id[0];
    const col = e.target.id[2];
    e.dataTransfer.effectAllowed = "move";
    const img = new Image();
    img.src = "";
    // Set empty image as the drag image
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify(boardPlayer.grid[row][col]),
    );
    temp.length = boardPlayer.grid[row][col].length;
    orientation = boardPlayer.grid[row][col].orientation;
  } else {
    e.preventDefault();
  }
}

function dragOver(e) {
  if (!e.target.classList.contains("ship")) e.preventDefault();
}

function dragEnter(e) {
  possibleCells = [];
  const row = parseInt(e.target.id[0], 10);
  const col = parseInt(e.target.id[2], 10);
  try {
    if (orientation === "vertical") {
      for (let i = 0; i < temp.length; i++) {
        possibleCells.push(`${row + i}-${col}`);
      }
    } else {
      for (let i = 0; i < temp.length; i++) {
        possibleCells.push(`${row}-${col + i}`);
      }
    }
    if (!boardPlayer.isValidPlacement(temp, row, col, orientation)) {
      for (const i of possibleCells) {
        const cell = document.getElementById(`${i[0]}-${i[2]}`);
        cell.classList.remove("invalid-drop");
        cell.classList.remove("valid-drop");
        cell.classList.add("invalid-drop");
      }
    } else {
      for (const i of possibleCells) {
        const cell = document.getElementById(`${i[0]}-${i[2]}`);
        cell.classList.remove("invalid-drop");
        cell.classList.remove("valid-drop");
        cell.classList.add("valid-drop");
      }
    }
  } catch (error) {
    console.log("Out of range: ", error);
  }
}

function dragLeave() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    if (!possibleCells.includes(cell.id)) {
      cell.classList.remove("invalid-drop");
      cell.classList.remove("valid-drop");
    }
  });
}

function dragDrop(e) {
  e.preventDefault();
  /* get the data from picked up cell */
  e.dataTransfer.dropEffect = "move";
  const data = JSON.parse(e.dataTransfer.getData("application/json"));
  const ship = new Ship(data.length, data.name);
  const { orientation } = data;
  const rowFrom = data.coordinates[0][0];
  const colFrom = data.coordinates[0][2];
  /* places the ship into the target cell */
  const row = parseInt(e.target.id[0], 10);
  const col = parseInt(e.target.id[2], 10);
  if (boardPlayer.isValidPlacement(ship, row, col, orientation)) {
    /* removes the ship visualy */
    for (const coordinate of boardPlayer.grid[rowFrom][colFrom].coordinates) {
      document
        .getElementById(`${coordinate[0]}-${coordinate[2]}`)
        .classList.remove("ship");
    }
    /* removes the ship from the board */
    boardPlayer.removeShip(boardPlayer.grid[rowFrom][colFrom]);
    /* places the ship in the new location */
    boardPlayer.placeShip(ship, row, col, orientation);
    /* update coordinates in ships object according to board */
    ships[ship.name].coordinates = boardPlayer.grid[row][col].coordinates;
    ships[ship.name].hits = boardPlayer.grid[row][col].hits;
  }
  const cells = document.querySelectorAll(".invalid-drop, .valid-drop");
  cells.forEach((cell) => {
    cell.classList.remove("invalid-drop");
    cell.classList.remove("valid-drop");
  });
}

function dragEnd() {
  const cells = document.querySelectorAll(".invalid-drop, .valid-drop");
  cells.forEach((cell) => {
    cell.classList.remove("invalid-drop");
    cell.classList.remove("valid-drop");
  });
  displayShips(boardPlayer);
}

board.addEventListener("dragstart", dragStart);
board.addEventListener("dragover", dragOver);
board.addEventListener("dragenter", dragEnter);
board.addEventListener("dragleave", dragLeave);
board.addEventListener("drop", dragDrop);
board.addEventListener("dragend", dragEnd);

function checkAvailableOrientation(ship) {
  /* if current orientation is this, check the other */
  if (ship.orientation === "horizontal") {
    const row = parseInt(ship.coordinates[0][0], 10);
    const col = parseInt(ship.coordinates[0][2], 10);
    for (let i = 1; i < ship.length; i++) {
      if (row + i > 9 || boardPlayer.grid[row + i][col]) {
        return false;
      }
    }
  } else {
    const row = parseInt(ship.coordinates[0][0], 10);
    const col = parseInt(ship.coordinates[0][2], 10);
    for (let i = 1; i < ship.length; i++) {
      if (col + i > 9 || boardPlayer.grid[row][col + i]) {
        return false;
      }
    }
  }
  return true;
}

function changeAxis(ship) {
  if (checkAvailableOrientation(ship)) {
    const row = parseInt(ship.coordinates[0][0], 10);
    const col = parseInt(ship.coordinates[0][2], 10);
    for (const coordinate of boardPlayer.grid[row][col].coordinates) {
      document
        .getElementById(`${coordinate[0]}-${coordinate[2]}`)
        .classList.remove("ship");
    }
    boardPlayer.removeShip(ship);
    if (ship.orientation === "horizontal") {
      boardPlayer.placeShip(ship, row, col, "vertical");
    } else {
      boardPlayer.placeShip(ship, row, col, "horizontal");
    }
    ships[ship.name].coordinates = boardPlayer.grid[row][col].coordinates;
    ships[ship.name].hits = boardPlayer.grid[row][col].hits;
  }
}

board.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("ship")) {
    const row = e.target.id[0];
    const col = e.target.id[2];
    const ship = boardPlayer.grid[row][col];
    changeAxis(ship);
    displayShips(boardPlayer);
  }
});
