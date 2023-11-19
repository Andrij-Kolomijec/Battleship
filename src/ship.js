export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = Array(length).fill(false);
  }

  hit() {
    const firstUnhitIndex = this.hits.indexOf(false);
    if (firstUnhitIndex !== -1) {
      this.hits[firstUnhitIndex] = true;
    }
  }

  isSunk() {
    return this.hits.every((hit) => hit);
  }
}

// module.exports = { Ship };
