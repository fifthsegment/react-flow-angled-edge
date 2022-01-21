import {FinderAStar} from './FinderAStar';
import type { Grid } from '../pathfinding-core/Grid';
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



export const generatePath = (
  grid: Grid,
  start: XYPosition,
  end: XYPosition,
  lessCorners: boolean
) => {
  /*const finderOptions = {  
    allowDiagonal: lessCorners ? true : false,
    dontCrossCorners: true
  };*/
  lessCorners ? 0: 0;

  const finderOptions = {  
    weight: 8
  };
  const finder = new FinderAStar(finderOptions);

  let fullPath: number[][] = [];

  try {
    fullPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
    //smoothedPath = Util.smoothenPath(grid, fullPath);
    //_ = Util;
  } catch {
    // No path was found. This can happen if the end point is "surrounded"
    // by other nodes, or if the starting and ending nodes are on top of
    // each other.
  }

  return { fullPath };
};
