class AStar {
  
    constructor(start, end) {
      this.start = start;
      this.end = end;
      this.openSet = [];
      this.closedSet = [];
  
      this.f = Array(cols * rows);
      this.g = Array(cols * rows).fill(0);
      this.h = Array(cols * rows).fill(0);
  
      this.path = [];
      this.curr = null;
      this.openSet.push(start);
    }

    SetEnds(start, end){
        this.start = start;
        this.end = end;
        this.openSet = [];
        this.closedSet = [];
    
        this.f = Array(cols * rows);
        this.g = Array(cols * rows).fill(0);
        this.h = Array(cols * rows).fill(0);
    
        this.path = [];
        this.curr = null;
        this.openSet.push(start);
      }

  
    Calculate(grid) {
      if (this.openSet.length > 0) {
        let W = 0;
        for (var i = 0; i < this.f.length; i++) {
          if (this.f[i] < this.f[W]) {
            W = i;
          }
        }
  
        let current = this.openSet[W];
        if (convert(current, grid) === convert(this.end, grid)) {
          // Find path
          this.path = [];
          var temp = current;
          this.path.push(temp);
          while (temp.prev) {
            this.path.push(temp.prev);
            temp = temp.prev;
          }
          console.log("Done!");
          return { p: this.path, o: this.openSet, c: this.closedSet, done: true };
        }
  
        removeFromArray(this.openSet, current);
        this.closedSet.push(current);
  
        let neighbors = getNeighbors(current, grid);
  
        for (var k = 0; k < neighbors.length; k++) {
          var neighbor = neighbors[k];
  
          if (!this.closedSet.includes(neighbor) && neighbor.state != 3) {
            var tempG = this.g[convert(current, grid)] + 1;
            var newPath = false;
            if (this.openSet.includes(neighbor)) {
              if (tempG < this.g[convert(neighbor, grid)]) {
                this.g[convert(neighbor, grid)] = tempG;
                newPath = true;
              }
            } else {
              this.g[convert(neighbor, grid)] = tempG;
              newPath = true;
              this.openSet.push(neighbor);
            }
            if (newPath) {
              //educated guess kind of...
              this.h[convert(neighbor, grid)] = heuristic(neighbor, this.end);
              this.f[convert(neighbor, grid)] =
                this.g[convert(neighbor, grid)] + this.f[convert(neighbor, grid)];
  
              neighbor.prev = current;
            }
          }
        }
        this.curr = current;
      } else {
        //No solution
        console.log("No Solution");
        return { p: this.path, o: this.openSet, c: this.closedSet, done: true };
      }
  
      return { p: this.path, o: this.openSet, c: this.closedSet, done: false };
    }
  }
  