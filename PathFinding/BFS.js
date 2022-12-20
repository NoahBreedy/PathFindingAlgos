class BFS{
    constructor(start,end){
      this.start = start;
      this.end = end;
      this.openSet = [];
      this.closedSet = [];
      this.visited = Array(cols*rows).fill(false);
      this.path = [];
      
      this.openSet.push(start);
      this.visited[0] = true;
      this.curr = null;
    
    }

    SetEnds(start, end){
      this.start = start;
      this.end = end;
      this.openSet = [];
      this.closedSet = [];
      this.visited = Array(cols*rows).fill(false);
      this.path = [];
      
      this.openSet.push(start);
      this.visited[0] = true;
      this.curr = null;
    }
    
    Calculate(grid){
       if(this.openSet.length > 0){
         
          let current = this.openSet[0];
          removeFromArray(this.openSet, current);
          let neighbors = getNeighbors(current,grid);
         
         for(var neigh of neighbors){
           if(neigh.state != 3){
             
            if(convert(neigh,grid) == convert(this.end,grid)){
               //neigh.prev = current;
               var temp = current;
               this.path.push(temp);
               while (temp.prev) {
                this.path.push(temp.prev);
                temp = temp.prev;
              }
              return { p: this.path, o: this.openSet, c: this.closedSet, done: true};
            }
           if(!this.visited[convert(neigh,grid)]){
               neigh.prev = current;
               if(neigh.state == 1){
                    neigh.prev = null;
               }
               this.path.push(neigh);
               this.openSet.push(neigh);
               this.visited[convert(neigh,grid)] = true;
               this.closedSet.push(neigh);
           }
           this.curr = current;
         } 
         }
      }else{
         //No solution
         console.log("No Solution");
         return { p: this.path, o: this.openSet, c: this.closedSet, done: true};
      }
      
      return { p: this.path, o: this.openSet, c: this.closedSet, done: false};
      
    }
  }
  