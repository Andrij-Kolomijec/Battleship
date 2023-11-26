export default class Ship {
  constructor(length, name) {
    this.length = length;
    this.name = name;
    this.hits = Array(length).fill(false);
    this.coordinates = [];
    this.orientation = null;
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
