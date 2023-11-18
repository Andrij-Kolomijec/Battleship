const Ship = require("../ship");

test("Tests hits to the ship.", () => {
  const ship = new Ship(7);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.hits).toBe(3);
});
