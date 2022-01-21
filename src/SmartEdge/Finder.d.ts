import Grid from '../pathfinding-core/Grid';

interface SimpleFinderOptions {
  allowDiagonal : boolean;
  dontCrossCorners: boolean;
}

interface AStarFinderOptions {
  allowDiagonal : boolean;
  dontCrossCorners: boolean;
}

export interface Finder {
  findPath(startX: number, startY: number, endX: number, endY: number, matrix: Grid): number[][];
}
interface SimpleFinder extends Finder {
  new (): SimpleFinder;
  new (opt: SimpleFinderOptions): SimpleFinder;
}

export var SimpleFinder: SimpleFinder;
