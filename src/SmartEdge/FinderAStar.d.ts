import {Finder} from './Finder'

namespace Heuristic {
  function manhattan(dx: number, dy: number): number;
  function euclidean(dx: number, dy: number): number;
  function octile(dx: number, dy: number): number;
  function chebyshev(dx: number, dy: number): number;
}

interface Heuristic {
  heuristic?: ((dx: number, dy: number) => number) | undefined;
}

interface FinderOptions extends Heuristic {
  weight?: number | undefined;
}

interface FinderAStar extends Finder {
  new (): FinderAStar;
  new (opt: AStarFinderOptions): FinderAStar;
}

export var FinderAStar: FinderAStar;