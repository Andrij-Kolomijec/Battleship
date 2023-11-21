export default class Gameboard {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
    this.attackedCells = [];
    this.sunkenShips = 0;
  }

  createEmptyGrid() {
    return Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
  }

  isValidPlacement(ship, row, col, orientation) {
    for (let i = 0; i < ship.length; i++) {
      if (orientation === "horizontal") {
        /* checks if the row exists (is not 
          undefined) - is within the board */
        if (this.grid[row] && this.grid[row][col + i] !== null) {
          return false;
        }
      } else if (!this.grid[row + i] || this.grid[row + i][col] !== null) {
        return false;
      }
    }
    return true;
  }

  placeShip(ship, row, col, orientation) {
    const isValidPlacement = this.isValidPlacement(ship, row, col, orientation);
    if (isValidPlacement) {
      for (let i = 0; i < ship.length; i++) {
        if (orientation === "horizontal") {
          this.grid[row][col + i] = ship;
        } else {
          this.grid[row + i][col] = ship;
        }
      }
    } else {
      console.log("Invalid ship placement!");
    }
  }

  receiveAttack(row, col) {
    const cellCoordinates = `${row}-${col}`;
    if (this.attackedCells.includes(cellCoordinates)) {
      console.log("Already attacked this cell!");
      return false;
    }
    if (this.grid[row] && this.grid[row][col] !== null) {
      const ship = this.grid[row][col];
      ship.hit();
      this.attackedCells.push(cellCoordinates);
      // this.checkVictory(ship);
      if (ship.isSunk()) {
        this.sunkenShips += 1;
      }
      return true;
    }
    this.attackedCells.push(cellCoordinates);
    return false;
  }

  checkVictory() {
    return this.sunkenShips >= 7;
    // if (ship.isSunk()) {
    //   this.sunkenShips += 1;
    // }
    // if (this.sunkenShips >= 7) {
    //   console.log("Fleet destroyed!");
    // }
  }

  display() {
    // Display column number on the top edge
    console.log(
      `   ${Array.from({ length: this.cols }, (_, index) => index).join(" ")}`,
    );
    for (let row = 0; row < this.rows; row++) {
      // Display row number on the left edge
      const rowNumber = row < 10 ? ` ${row}` : row;
      console.log(
        `${rowNumber} ${this.grid[row]
          .map((cell) => (cell ? "X" : "-"))
          .join(" ")}`,
      );
    }
  }
}

// module.exports = { Gameboard };
