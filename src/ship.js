class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  isSunk() {
    if (this.hits >= this.length) {
      this.sunk = true;
      console.log("This ship is sunk!");
    }
  }

  hit() {
    this.hits += 1;
    this.isSunk();
  }
}

module.exports = Ship;
