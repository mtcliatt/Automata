'use strict';

const RULE = 30;

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const CELL_COLOR_ALIVE = 'green';
const CELL_COLOR_DEAD = 'black';
const NUM_CELLS_WIDE = 500;
const NUM_CELLS_HIGH = 500;
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

  const getNeighborStatesSum = (column, row) => {
    const left = column - 1 < 0 ? 0 : world[column - 1][row] ? 4 : 0;
    const middle = world[column][row] ? 2 : 0;
    const right = column + 1 > NUM_CELLS_WIDE - 1 ? 0 : world[column + 1][row] ? 1 : 0;

    return left + middle + right
  }

  // Returns the next state of the cell.
  const calculateCellState = (column, row) => {
    return ((RULE & 1 << getNeighborStatesSum(column, row)) != 0);
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
