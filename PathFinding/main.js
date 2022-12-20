// Canvas Setup 
const canvas = document.getElementById('cnv');
const wallOption = document.getElementById("drawWalls");
const resolutionOption = document.getElementById("resolution");
canvas.width = (window.innerWidth*0.5);
canvas.height = (window.innerHeight*0.75);
const ctx = canvas.getContext('2d');


let mousePos;
let mouseDown = false;
let movement = [false,0];
let rows = 10;
let cols = 10;
let mode = 3;
let running = false;
let DoneFlag = false;

canvas.width = 800;
canvas.height = 500;

let RectWidth = canvas.width / cols;
let RectHeight = canvas.height / rows;


let table = genTable(rows,cols);
table[0][0].state = 1;
table[rows-1][cols-1].state = 2;
let priority = [table[0][0],table[rows-1][cols-1]];


const A = new BFS(priority[0], priority[1]);
const B = new BFS(priority[0], priority[1]);
const C = new Closest(priority[0], priority[1]);

Render_Scene(
            { p: [], 
               o: [], 
               c: [], 
               done: false
            },
             table,
             []
    )

function resetScreen(){
    table = genTable(rows,cols);
    table[0][0].state = 1;
    table[rows-1][cols-1].state = 2;
    priority = [table[0][0],table[rows-1][cols-1]];
    DoneFlag = false;
    A.SetEnds(priority[0],priority[1]);
    B.SetEnds(priority[0],priority[1]);
    C.SetEnds(priority[0],priority[1]);
    Render_Scene(
        { p: [], 
           o: [], 
           c: [], 
           done: false
        },
         table,
         []
    )
}

function resetPath(){
    DoneFlag = false;
    A.SetEnds(priority[0],priority[1]);
    B.SetEnds(priority[0],priority[1]);
    C.SetEnds(priority[0],priority[1]);
    Render_Scene(
        { p: [], 
           o: [], 
           c: [], 
           done: false
        },
         table,
         []
    )
}

resolutionOption.onchange = (e) => { 
    if(!running){
        if(resolutionOption.value>=10 && resolutionOption.value <= 55){
            rows = resolutionOption.value;
            cols = resolutionOption.value;
            RectWidth = canvas.width / cols;
            RectHeight = canvas.height / rows;
            resetScreen();
        }
    }
};


canvas.addEventListener('mousedown', (event) => {
    mouseDown = true;
    const x = Math.floor(mousePos.x/RectWidth);
    const y = Math.floor(mousePos.y/RectHeight);
    if(table[y][x].state == 1 || table[y][x].state == 2 ){
        movement = [true,table[y][x],table[y][x].state];
    }
});

canvas.addEventListener('mouseup', (event) => {
    mouseDown = false;
    if(movement[0]){
        if(movement[2] == 1){
            priority[0] = movement[1];
        }else{
            priority[1] = movement[1];
        }
        priority[0].prev = null;
        DoneFlag = false;
        A.SetEnds(priority[0],priority[1]);
        B.SetEnds(priority[0],priority[1]);
        C.SetEnds(priority[0],priority[1]);
    }
    movement = [false,0];
});

let curr=0,prev=-1;
function update(){
    requestAnimationFrame(update);
    if(mouseDown){
        let x = Math.floor(mousePos.x / RectWidth);
        let y = Math.floor(mousePos.y / RectHeight);
        // Means we are moving a start or end node 
        if(movement[0] && (table[y][x].state != 2 && table[y][x].state != 3 && table[y][x].state != 1)){
            let temp = movement[1];
            table[y][x].state = temp.state;
            movement[1].state = 0;
            let col = `rgb(0,255,0)`;
            if(movement[2] == 2){
                col = `rgb(255,0,0)`;
            }
            ShowNode(movement[1], `rgb(255,255,255)`);
            ShowNode(table[y][x], col);
            movement[1] = table[y][x];
        }else if(!movement[0] && table[y][x].state != 1 && table[y][x].state != 2){
            if(wallOption.checked){
                table[y][x].state = 3;
                ShowNode(table[y][x], `rgb(0,0,0)`);
            }else if(table[y][x].state == 3){
                table[y][x].state = 0;
                ShowNode(table[y][x], `rgb(255,255,255)`);
            }
        }
        
    }

    if(running){
        Step();
    }

}
update();

function Run(){
    if(running){
        running = false;
        document.getElementById("run-btn").style.color = "";
    }else{
        running = true;
        const btn = document.getElementById("run-btn").style.color = "red";
    }
}

function Step(){
    const algo = document.getElementById("algo").value;
    let temp;
    let result; 
    let loopcount = 0;
    if(!DoneFlag){
        if(algo == "Closest"){
            result = C.Calculate(table);
            temp = C.curr;
        }else if(algo == "BFS"){
            result = B.Calculate(table);
            temp = B.curr;
        }else if(algo == "Star"){
            result = A.Calculate(table);
            temp = A.curr;
        }
    }

    let path = [];
    path.push(temp);
    while (temp.prev && loopcount<cols*rows) {
        path.push(temp.prev);
        temp = temp.prev;
        loopcount++;
    }
    Render_Scene(result, table, path);
    if(result.done){
        DoneFlag = true;
    }
}

function Step2(fromClick){
    if(!running){

        const algo = document.getElementById("algo").value;
        let temp;
        let result; 
        let loopcount = 0;

        if(!DoneFlag){
            if(algo == "Closest"){
                result = C.Calculate(table);
                temp = C.curr;
            }else if(algo == "BFS"){
                result = B.Calculate(table);
                temp = B.curr;
            }else if(algo == "Star"){
                result = A.Calculate(table);
                temp = A.curr;
            }
        }

        let path = [];
        path.push(temp);
        while (temp.prev && loopcount<cols*rows) {
            path.push(temp.prev);
            temp = temp.prev;
            loopcount++;
        }
        Render_Scene(result, table, path);
        if(result.done){
            DoneFlag = true;
        }
    }   
}




function Render_Scene(res, grid, path) {
    for (var e = 0; e < grid.length; e++) {
      for (var j = 0; j < grid[0].length; j++) {
        if(grid[e][j].state == 3) {
          ShowNode(grid[e][j], `rgb(0,0,0)`);
        } else if(grid[e][j].state == 1){
          ShowNode(grid[e][j], `rgb(0,255,0)`);
        }else if(grid[e][j].state == 2){
         ShowNode(grid[e][j], `rgb(255,0,0)`);
        }else{
            ShowNode(grid[e][j], `rgb(255,255,255)`);
        }
  
        if (res.c.includes(grid[e][j])) {
          ShowNode(grid[e][j], "#adaaaa");
        }
  
        if (res.o.includes(grid[e][j])) {
          ShowNode(grid[e][j], "#e6eb54");
        }

        if (path.includes(grid[e][j])) {
          ShowNode(grid[e][j], "#d858f5");
        }
        if(grid[e][j].state == 1){
            ShowNode(grid[e][j], `rgb(0,255,0)`);
        }
      }
    }
  }



  function ShowNode(node, col) {
    fill(ctx,col);
    rect(ctx, node.x * RectWidth, node.y * RectHeight, RectWidth, RectHeight);
  }
  


 