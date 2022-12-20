/**
 * 
 * @param {HTMLCanvasElement} ctx 
 * @param {String|number} col 
 */
const fill = (ctx,col = 0) => {
    ctx.fillStyle = col;
}

/**
 * 
 * @param {HTMLCanvasElement} ctx 
 * @param {String|number} col 
 */
const stroke = (ctx,col ="#9c9c9c") => {
    ctx.strokeStyle = col;
}

/**
 * @description Draws rectangle to context
 * @param {HTMLCanvasElement} ctx - window context
 * @param {number} x - x location
 * @param {number} y - y location
 * @param {number} w - width
 * @param {number} h - height
 */
const rect = (ctx,x,y,w,h=w) => {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
}

const dist = (x1,y1,x2,y2) =>{
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
}

const dist2 = (a,b) => {
    return dist(a.x,a.y,b.x,b.y);
}

const getMousePos = (evt) => {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(evt.clientX - rect.left),
        y: Math.floor(evt.clientY - rect.top)
    };
}

function handleMouseMove(e){
    mousePos = getMousePos(e);
}

function genTable(rows,cols){
    let arr = Array(rows);
    for(var i = 0; i < rows; i++){
        arr[i] = Array(cols);
    }
    for(var y = 0; y < rows; y++){
        for(var x = 0; x < cols; x++){
            arr[y][x] = new Node(x,y,0);
        }
    }
    return arr;
}


/*
    States:
    0 - base
    1 - start
    2 - end
    3 - wall
    4 - looking@
    5 - looked@
    6 - inpath
*/
function Node(index_x,index_y,state,prev){
    this.x = index_x;
    this.y = index_y;
    this.state = state;
    this.prev = null;
}

function removeFromArray(arr, element){
    for(var i = arr.length - 1; i>=0; i--){
        if(arr[i] == element){
           arr.splice(i,1);
        }
    }
 }
 
 function heuristic(a,b){
   var d = Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
   return d;    
}

 function convert(node,grid){
    return (grid[0].length) * (node.y) + node.x;
}


function getNeighbors(node,grid){
    
    let neigh = [];
    var x = node.x;
    var y = node.y;
    
    const cols = grid[0].length;
    const rows = grid.length;
  
    if(x < cols-1){
      neigh.push(grid[y][x+1]);
    }
    
    if(x > 0){
     neigh.push(grid[y][x-1]);
    }
    
    if(y < rows-1){
     neigh.push(grid[y+1][x]);
    }
    
    if(y > 0){
     neigh.push(grid[y-1][x]);
    }
    if(x>0 && y>0){
      neigh.push(grid[y-1][x-1]);
    }
    if(x < cols-1 && y > 0){
      neigh.push(grid[y-1][x+1]);
    }
    if(x > 0 && y < rows-1){
      neigh.push(grid[y+1][x-1]);
    }
    if(x < cols-1 && y < rows-1){
      neigh.push(grid[y+1][x+1]);
    }
    
   return neigh;
}

