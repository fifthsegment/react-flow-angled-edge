import React, { memo, useContext, useState } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import {
  BezierEdge,
  StraightEdge,
  getMarkerEnd,
  useStoreState,
  EdgeText,
} from 'react-flow-renderer';
import { createGrid, PointInfo } from './createGrid';
import { drawSmoothLinePath, drawStraightLinePath } from './drawSvgPath';
import { generatePath } from './generatePathSimple';

import { getBoundingBoxes } from './getBoundingBoxes';
import { gridToGraphPoint } from './pointConversion';
import type { EdgeProps, Node } from 'react-flow-renderer';
import { SmartEdgeContext, SmartEdgeProvider, useSmartEdge } from './context';

interface PathFindingEdgeProps<T = any> extends EdgeProps<T> {
  storeNodes: Node<T>[];
}

declare global {
  interface Window { PathStore: any; }
}


function isOverlapping(x:Number, y:Number) {
  for (let key in window.PathStore) {
    const paths = window.PathStore[key].paths;
    for (let index = 0; index < paths.length; index++) {
      const element = paths[index];
      if (x == element[0] && y == element[1]) {
        return true;
      }
    }
  }
  return false;
}

/*function getPathStoreOverlap(edge:string) {
  for (let key in window.PathStore) {
    //if (window.PathStore[key] == edge) {
      if (key == edge && window.PathStore[key].overlapping) { 
        return 10
      }
    //}
  }
  return 0
}*/

const PathFindingEdge = memo((props: PathFindingEdgeProps) => {
  const {
    id,
    data,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    arrowHeadType,
    markerEndId,
    style,
    storeNodes,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
  } = props;
  const { gridRatio, nodePadding, lineType, lessCorners } = useSmartEdge();
  const roundCoordinatesTo = gridRatio;

  // We use the node's information to generate bounding boxes for them
  // and the graph
  const { graph, nodes } = getBoundingBoxes(
    storeNodes,
    nodePadding,
    roundCoordinatesTo
  );

  const source: PointInfo = {
    x: sourceX + (data.offsetXsource || 0),
    y: sourceY + (data.offsetYsource || 0),
    position: sourcePosition,
  };
  
  const target: PointInfo = {
    x: targetX + (data.offsetXtarget || 0) - 3,
    y: targetY + (data.offsetYtarget || 0) + Math.round(10), //getPathStoreOverlap(id),
    position: targetPosition,
  };
  console.log("target", target);

  // With this information, we can create a 2D grid representation of
  // our graph, that tells us where in the graph there is a "free" space or not
  let { grid, start, end } = createGrid(
    graph,
    nodes,
    source,
    target,
    gridRatio
  );
  //console.log("nodes", nodes);
  
  // We then can use the grid representation to do pathfinding
  let fullPath = generatePath(
    grid,
    start,
    end,
    lessCorners
  );
  //let overlap = false;
  //let overlapX = false;
  //let overlapY = false;
  //let xAtOverlap = 0;
  //let yAtOverlap = 0;
  let overlappingPoints = 0;
  for (let index = 0; index < fullPath.length; index++) {
    const element = fullPath[index];
    const x = element[0];
    const y = element[1];
    if (isOverlapping(x, y) ) {
      /*if (xAtOverlap != 0) {
        xAtOverlap = x;
        yAtOverlap = y;
      } else {
        if (xAtOverlap + 1  == x) {
          xAtOverlap = x;
          fullPath[index] = [x-3, y]
        }
        if (yAtOverlap + 1  == y) {
          yAtOverlap = y;
          fullPath[index] = [x, y-3]
        }
      }*/
      overlappingPoints++;
      
      //fullPath[index] = [element[0] - 5, element[1] - 5 ]
      //grid.setWalkableAt(element[0], element[1], false)
      //overlap = true;
    }
  }

  console.log("Overlapping points", overlappingPoints);

  if (overlappingPoints > 50) {
    /*for (let index = 0; index < fullPath.length; index++) {
      const element = fullPath[index];
      fullPath[index] = [element[0]-5, element[1] - 5 ]
    }*/
    /*
    let t = {
      x: target.x,
      y: target.y+5,
      position: target.position,
    };
    //console.log(t)
    fullPath = generatePath(
      grid,
      start,
      t,
      lessCorners
    );
    */
    if (!window.PathStore) {
      window.PathStore = {}
    } else {
      window.PathStore[id] = {
        "paths": fullPath,
        "overlapping" : true,
      }
    }
  } else {
    if (!window.PathStore) {
      window.PathStore = {}
    } else {
      window.PathStore[id] = {
        "paths": fullPath
      }
    }
  }



  /*
    Fallback to BezierEdge if no path was found.
    length = 0: no path was found
    length = 1: starting and ending points are the same
    length = 2: a single straight line from point A to point B
  */
  if (fullPath.length <= 2) {
    if (lineType === 'curve') {
      return <BezierEdge {...props} />;
    }
    return <StraightEdge {...props} />;
  }

  // Here we convert the grid path to a sequence of graph coordinates.
  const graphPath = fullPath.map((gridPoint) => {
    const [x, y] = gridPoint;
    const graphPoint = gridToGraphPoint(
      { x, y },
      graph.xMin,
      graph.yMin,
      gridRatio
    );
    return [graphPoint.x, graphPoint.y];
  });

  // Finally, we can use the graph path to draw the edge
  const svgPathString =
    lineType === 'curve'
      ? drawSmoothLinePath(source, target, graphPath)
      : drawStraightLinePath(source, target, graphPath);

  // The Label, if any, should be placed in the middle of the path
  const [middleX, middleY] = fullPath[Math.floor(fullPath.length / 2)];
  const { x: labelX, y: labelY } = gridToGraphPoint(
    { x: middleX, y: middleY },
    graph.xMin,
    graph.yMin,
    gridRatio
  );

  const text = label ? (
    <EdgeText
      x={labelX}
      y={labelY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
    />
  ) : null;

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path
        style={style}
        className="react-flow__edge-path"
        d={svgPathString}
        markerEnd={markerEnd}
      />
      {text}
    </>
  );
});

const DebouncedPathFindingEdge = memo((props: EdgeProps) => {
  const storeNodes = useStoreState((state) => {
    return state.nodes
  } );
  const { debounceTime } = useSmartEdge();
  const [debouncedProps, setDebouncedProps] = useState({
    storeNodes,
    ...props,
  });

  useDebounce(
    () => {
      setDebouncedProps({
        storeNodes,
        ...props,
      });
    },
    debounceTime,
    [props, storeNodes]
  );

  return <PathFindingEdge {...debouncedProps} />;
});

const RegularPathFindingEdge = memo((props: EdgeProps) => {
  const storeNodes = useStoreState((state) => state.nodes);
  return <PathFindingEdge storeNodes={storeNodes} {...props} />;
});

export const SmartEdge = memo((props: EdgeProps) => {
  const context = useContext(SmartEdgeContext);

  if (!context) {
    return (
      <SmartEdgeProvider>
        <DebouncedPathFindingEdge {...props} />;
      </SmartEdgeProvider>
    );
  }

  if (context.debounceTime === 0) {
    return <RegularPathFindingEdge {...props} />;
  }

  return <DebouncedPathFindingEdge {...props} />;
});
