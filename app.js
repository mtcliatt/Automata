'use strict';

const CELL_COLOR_ALIVE = 'green';
const CELL_COLOR_DEAD = 'black';
const NUM_RECTANGLES_WIDE = 1000;
const NUM_RECTANGLES_HIGH = 1000;
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;
const RECTANGLE_WIDTH = CANVAS_WIDTH / NUM_RECTANGLES_WIDE;
const RECTANGLE_HEIGHT = CANVAS_HEIGHT / NUM_RECTANGLES_HIGH;

document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 2D array of all of the cells in this simulation.
    const world = [];

    // Set each cell state to dead (false).
    for (let i = 0; i < NUM_RECTANGLES_WIDE; i++) {
      world.push([]);
      for (let j = 0; j < NUM_RECTANGLES_HIGH; j++) {
        world[i].push(false);
      }
    }

    // Start off with one alive cell, front and center.
    setCellState(Math.floor(NUM_RECTANGLES_WIDE / 2), NUM_RECTANGLES_HIGH - 1, true);

    // Calculate the state each of cell, one row/iteration at a time.
    for (let r = 1; r < NUM_RECTANGLES_HIGH; r++) {
      for (let c = 0; c < NUM_RECTANGLES_WIDE; c++) {
        const row = (NUM_RECTANGLES_HIGH - 1) - r;
        setCellState(c, row, calculateCellState(c, row + 1));
      }
    }

    paintAllCells();

    function calculateCellState(x, y) {
     const left = x - 1 < 0 ? false : world[x - 1][y];
     const middle = world[x][y];
     const right = x + 1 > NUM_RECTANGLES_WIDE - 1 ? false : world[x + 1][y]

     let count = 0;
     if (left) {
       count++;
     }
     if (middle) {
       count++;
     }
     if (right) {
       count++;
     }

      return (middle && right && !left) || count == 1;
    }

    // Returns coord's of the bottom left corner of the rectangle at (column, row)
    function cellCoordinateToCanvasCoordinate(column, row) {
      return {
        x: column * RECTANGLE_WIDTH,
        y: CANVAS_HEIGHT - row * RECTANGLE_HEIGHT,
      };
    }

    // Sets the state of the cell at the specified location.
    function setCellState(column, row, newState) {
      world[column][row] = newState;
    }

    // Wrapper to call paintCell on every cell.
    function paintAllCells() {
      for (let i = 0; i < NUM_RECTANGLES_WIDE; i++) {
        for (let j = 0; j < NUM_RECTANGLES_HIGH; j++) {
          paintCell(i, j);
        }
      }
    }

    // Paints the cell at the specified location with the color for its state.
    function paintCell(column, row) {
      const {x, y} = cellCoordinateToCanvasCoordinate(column, row);
      let color = world[column][row] ? CELL_COLOR_ALIVE : CELL_COLOR_DEAD;

      ctx.clearRect(x, y, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);
    }
  })();

});
