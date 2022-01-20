import Grid from '../pathfinding-core/Grid';

interface FinderOptions {
  allowDiagonal : boolean;
  dontCrossCorners: boolean;
}
interface Finder {
  findPath(startX: number, startY: number, endX: number, endY: number, matrix: Grid): number[][];
}
interface SimpleFinder extends Finder {
  new (): SimpleFinder;
  new (opt: FinderOptions): SimpleFinder;
}
export var SimpleFinder: SimpleFinder;