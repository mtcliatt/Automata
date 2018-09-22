'use strict';

const CELL_COLOR_ALIVE = 'green';
const CELL_COLOR_DEAD = 'black';
const NUM_CELLS_WIDE = 500;
const NUM_CELLS_HIGH = 500;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const CELL_WIDTH = CANVAS_WIDTH / NUM_CELLS_WIDE;
const CELL_HEIGHT = CANVAS_HEIGHT / NUM_CELLS_HIGH;

(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const world = [];
  for (let i = 0; i < NUM_CELLS_WIDE; i++) {
    world.push([]);
    for (let j = 0; j < NUM_CELLS_HIGH; j++) {
      world[i].push(false);
    }
  }

  // Converts the column, row coordinates to pixel coordinates on the canvas.
  const cellCoordinateToCanvasCoordinate = (column, row) => {
    return {
      x: column * CELL_WIDTH,
      y: CANVAS_HEIGHT - row * CELL_HEIGHT,
    };
  }

  // Paints the cell at the specified location with the color for its state.
  const paintCell = (column, row) => {
    const {x, y} = cellCoordinateToCanvasCoordinate(column, row);
    ctx.fillStyle = getCellColor(column, row);
    ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  }

  // Wrapper to call paintCell on each cell.
  const paintAllCells = () => {
    for (let i = 0; i < NUM_CELLS_WIDE; i++) {
      for (let j = 0; j < NUM_CELLS_HIGH; j++) {
        paintCell(i, j);
      }
    }
  }

  // Sets the state of the cell at the specified location.
  const setCellState = (column, row, state) => {
    world[column][row] = state;
  }

  // Gets the appropriate color for the cell based on that cell's state.
  const getCellColor = (column, row) => {
    return world[column][row] ? CELL_COLOR_ALIVE : CELL_COLOR_DEAD;
  }

  const getNeighborStates = (column, row) => {
    const left = column - 1 < 0 ? false : world[column - 1][row];
    const middle = world[column][row];
    const right = column + 1 > NUM_CELLS_WIDE - 1 ? false : world[column + 1][row];

    return {left, middle, right};
  }

  // Returns the next state of the cell, according to rule 30.
  const calculateCellState = (column, row) => {
    const neighborStates = getNeighborStates(column, row);

    let count = 0;
    if (neighborStates.left) {
      count++;
    }
    if (neighborStates.middle) {
      count++;
    }
    if (neighborStates.right) {
      count++;
    }

    return (neighborStates.middle && neighborStates.right && !neighborStates.left)
        || count == 1;
  }

  // Start off with one alive cell, front and center.
  setCellState(Math.floor(NUM_CELLS_WIDE / 2), NUM_CELLS_HIGH - 1, true);

  // Calculate the state each of cell, one row/iteration at a time.
  for (let r = 1; r < NUM_CELLS_HIGH; r++) {
    for (let c = 0; c < NUM_CELLS_WIDE; c++) {
      const row = (NUM_CELLS_HIGH - 1) - r;
      setCellState(c, row, calculateCellState(c, row + 1));
    }
  }

  paintAllCells();
})();
