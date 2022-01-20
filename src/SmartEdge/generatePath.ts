import { TraceFinder, Heuristic } from 'pathfinding';
import type { Grid } from 'pathfinding';
import type { XYPosition } from 'react-flow-renderer';

//BestFirstFinder
//AStarFinder
//DiagonalMovement
// https://www.npmjs.com/package/pathfinding#advanced-usage
declare module 'pathfinding' {
  interface FinderOptions extends Heuristic {
    diagonalMovement?: DiagonalMovement;
    weight?: number;
    allowDiagonal?: boolean;
    dontCrossCorners?: boolean;
  }
}

/*const withDiagonalMovement = {
  allowDiagonal: true,
  dontCrossCorners: true,
  diagonalMovement: DiagonalMovement.Always,
};*/

const withDiagonalMovement = {
  allowDiagonal: true,
  dontCrossCorners: true
}

const withStraightMovement = {
  allowDiagonal: false,
};

export const generatePath = (
  grid: Grid,
  start: XYPosition,
  end: XYPosition,
  lessCorners: boolean
) => {
  const defaultOptions = {
    heuristic: Heuristic.octile,
    weight: 2,
  };
  const finderOptions = Object.assign(lessCorners
    ? withStraightMovement
    : withDiagonalMovement, defaultOptions);


  const finder = new TraceFinder(finderOptions);

  let fullPath: number[][] = [];
  let smoothedPath: number[][] = [];

  try {
    fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
    //smoothedPath = Util.smoothenPath(grid, fullPath);
    //_ = Util;
    smoothedPath = fullPath;
  } catch {
    // No path was found. This can happen if the end point is "surrounded"
    // by other nodes, or if the starting and ending nodes are on top of
    // each other.
  }

  return { fullPath, smoothedPath };
};
