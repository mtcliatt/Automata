'use strict';

const RULE = 30;
const RULES = [30];
const WRAP_ENABLED = true;
const NUM_ITERATIONS_TO_ANIMATE = 100000;

// TODO(matt): NEED to use a 1d array to save memory.

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const CELL_COLOR_ALIVE = 'green';
const CELL_COLOR_DEAD = 'black';
const NUM_CELLS_WIDE = 400;
const NUM_CELLS_HIGH = 400;
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

  // Wrapper to call paintCell on each cell.
  const paintCellRow = (row) => {
    for (let i = 0; i < NUM_CELLS_WIDE; i++) {
      paintCell(i, row);
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
    let left, middle, right;

    if (WRAP_ENABLED) {
      if (row >= NUM_CELLS_HIGH) {
        row = 0;
      }

      if (column - 1 < 0) {
        left = world[world.length - 1][row] ? 4 : 0; 
      } else {
        left = world[column - 1][row] ? 4 : 0;
      }

      middle = world[column][row] ? 2 : 0;

      if (column + 1 > NUM_CELLS_WIDE - 1) {
        right = world[0][row] ? 1 : 0;
      } else {
        right = world[column + 1][row] ? 1 : 0;
      }
    } else {
      left = column - 1 < 0 ? 0 : world[column - 1][row] ? 4 : 0;
      middle = world[column][row] ? 2 : 0;
      right = column + 1 > NUM_CELLS_WIDE - 1 ? 0 : world[column + 1][row] ? 1 : 0;
    }

    return left + middle + right;
  }

  // Returns the next state of the cell.
  const calculateCellState = (column, row) => {
    return ((RULES[row % RULES.length] & 1 << getNeighborStatesSum(column, row)) != 0);
  }

  const iterateOnRow = row => {
    for (let c = 0; c < NUM_CELLS_WIDE; c++) {
      const rowIndex = NUM_CELLS_HIGH - 1 - row;
      setCellState(c, rowIndex, calculateCellState(c, rowIndex + 1));
    }

    paintCellRow(NUM_CELLS_HIGH - row);
  }

  // Start off with one alive cell, front and center.
  setCellState(Math.floor(NUM_CELLS_WIDE / 2), NUM_CELLS_HIGH - 1, true);

  const animate = (step) => {
    if (step == NUM_ITERATIONS_TO_ANIMATE) {
      return;
    }

    iterateOnRow(step % NUM_CELLS_HIGH)
    setTimeout(animate, 10, step + 1);
    
  }

  animate(1);

})();
