

function SimpleFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.weight = opt.weight || 10;
}

function calculateXPath(startY,startX, endX, grid) {
    let y = startY;
    let xPaths = [];
    let startingX = startX;
    for (let index = startingX; index < endX; index++) {
        let pathFound = false;
        do {
            let currentNode = grid.getNodeAt(index, y);
            if (currentNode.walkable) {
                pathFound = true;
                xPaths.push([index, y]);
            } else {
                xPaths = [];
                index = startingX;
                y--;
            }
        }
        while(pathFound == false)
    }
    return [y,xPaths];
}

function generateSimplePath(startX, startY, endX, endY, grid) {
    /*for (let key in window.PathStore) {
        const paths = window.PathStore[key].paths;
        for (let index = 0; index < paths.length; index++) {
            const element = paths[index];
            grid.setWalkableAt(element[0], element[1], false);
        }
    }*/
    //console.log("start", startX, startY, endX, endY, grid)
    let [y,xPaths] = calculateXPath(startY, startX, endX, grid);
    let startingY = y
    let x = endX;
    let yPaths = [];
    for (let index = startingY; index < endY; index++) {
        let pathFound = false;
        do {
            let currentNode = grid.getNodeAt(x, index);
            if (currentNode.walkable) {
                pathFound = true;
                yPaths.push([x, index]);
            } else {
                yPaths = [];
                
                let [newY, newXPaths] = calculateXPath(y, startX, x, grid);
                startingY = newY;
                xPaths = newXPaths;
                index = startingY;
                x--;
            }
        }
        while(pathFound == false)
    }
    return [...xPaths, ...yPaths];
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
 SimpleFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    
    return generateSimplePath(startX, startY, endX, endY, grid)

};

export {
  SimpleFinder
}
