interface Grid {
  new (width: number, height: number): Grid;
  new (matrix: number[][]): Grid;

  setWalkableAt(x: number, y: number, walkable: boolean): void;

  clone(): Grid;

  getNodeAt(x: number, y: number): Pathfinding.Node;
  getNeighbors(node: Pathfinding.Node, diagonalMovement: DiagonalMovement): Pathfinding.Node[];
  isWalkableAt(x: number, y: number): boolean;
  isInside(x: number, y: number): boolean;

  width: number;
  height: number;
}
export var Grid: Grid;