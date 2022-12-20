class Closest{
  
    constructor(start,end){
      this.start = start;
      this.end = end;
      this.path = [];
      
      this.curr = this.start;
    }

    SetEnds(start, end){
        this.start = start;
        this.end = end;
        this.path = [];
        
        this.curr = this.start;
    }

    
    Calculate(grid){
       let neighbors = getNeighbors(this.curr,grid);
       let maxDist = this.dist(this.curr,this.end);
       let next = null;
      
       for(var neigh of neighbors){
           if(neigh.state != 3){
             let d = this.dist(neigh,this.end);
             if(d<maxDist){
               maxDist = d;
               next = neigh;
               next.prev = this.curr;
             }
             if(next == this.end){
                return { p: [], o: [], c: [], done: true};
             }
           }
       }
       this.curr = next;
        
      if(this.curr == this.end){
        return { p: [], o: [], c: [], done: true};
      }
      
      return { p: [], o: [], c: [], done: false};
      
    }
    
    dist(a,b){
      return Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2));
    }
  }