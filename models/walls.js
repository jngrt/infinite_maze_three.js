/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("walls.js");

var maze = maze || {};
maze.models = maze.models || {};

maze.models.walls = (function namespace(){
    console.log("walls namespace()");
   
    var wallCount = 0
    , cookieCount = 0
    , callbacks = {}
    , blocksToRemove = []
    , my = {
        totalShift:{x:0,y:0}
        , data:[]
    };

    //maze.helpers.addCallbackFunctions(my);
    
    function addblock(x,y){
        my.data[x][y] = ++wallCount;
        my.data[x+1][y+1] = --cookieCount;
        var rnd = Math.random();
        if(rnd<0.3){
            my.data[x+1][y] = ++wallCount;
            my.data[x][y+1] = --cookieCount;
        }else if(rnd<0.6){
            my.data[x][y+1] = ++wallCount;
            my.data[x+1][y] = --cookieCount;
        }else{
            my.data[x][y+1] = --cookieCount;
            my.data[x+1][y] = --cookieCount;
        }
    }
    function fill(){
        var i,x,y;
        for (my.data=[[],[]];my.data.length<maze.MAZE_SIZE;my.data.push([],[]))
            for (i = 0;i<maze.MAZE_SIZE;i+=2)
                if( !(Math.abs(maze.MAZE_SIZE / 2 - my.data.length) < 3
                    && Math.abs(maze.MAZE_SIZE / 2 - i) < 3))
                    addblock(my.data.length-2,i);
    }


    function northSouthFilter(ar,start){
        blocksToRemove = blocksToRemove.concat( 
            ar.splice(start,2).filter(function(el){
                return (el && el!=null && typeof(el)!="undefined");
            }));}
    function eastWestFilter(ar ,start){
        blocksToRemove = blocksToRemove.concat(
            ar.splice(start,2).reduce(function(prev,cur){
                return prev.concat(cur);
            },[]).filter(function(el){
                return (el && el!=null && typeof(el)!="undefined");
            }));}
    
    my.init = function(){
        console.log("models.walls.init");
        fill();
    };
    my.checkAndRemoveCookie = function(x,y){
        if(my.data[x][y] && my.data[x][y] < 0 ){
            var ret = my.data[x][y];
            my.data[x][y] = null;
            return ret;
//            maze.notify(maze.ON_COOKIE,my.data[x][y]);
//            my.data[x][y] = null;
//            return true;
        }
        return 0;
    };
    my.positionFree = function(x,y){
        var el = my.data[x][y];
        return !( el != null && typeof(el)!="undefined"  && el > 0 );
    };
    my.checkShift = function(dir){
        switch(dir){
            case maze.NORTH:my.totalShift.y--;break;
            case maze.SOUTH:my.totalShift.y++;break;
            case maze.EAST:my.totalShift.x++;break;
            case maze.WEST:my.totalShift.x--;break;
        }
        if(Math.abs(my.totalShift.x) > 1 || Math.abs(my.totalShift.y) > 1) 
            my.shift(dir);
    };
    my.shift = function(dir){
        var i;
        blocksToRemove = [];

        switch(dir){
        case maze.NORTH:
            my.totalShift.y+=2;
            my.data.forEach(function(el){
                northSouthFilter(el,maze.MAZE_SIZE-2);
                el.unshift(null,null);
            });
            for(i=0;i<maze.MAZE_SIZE;i+=2)
                addblock(i,0);
            break;
        case maze.EAST:
            my.totalShift.x-=2;
            eastWestFilter(my.data,0);
            my.data.push([],[]);
            for(i=0;i<maze.MAZE_SIZE;i+=2)
                addblock(maze.MAZE_SIZE-2,i);
            break;
        case maze.SOUTH:
            my.totalShift.y-=2;
            my.data.forEach(function(el){
                northSouthFilter(el,0);
                el.push(null,null);
            });
            for(i=0;i<maze.MAZE_SIZE;i+=2)
                addblock(i,maze.MAZE_SIZE-2);
            break;
        case maze.WEST:
            my.totalShift.x+=2;
            eastWestFilter(my.data,maze.MAZE_SIZE-2);
            my.data.unshift([],[]);
            for(i=0;i<maze.MAZE_SIZE;i+=2)
                addblock(0,i);
            break;
        }

        maze.notify(maze.ON_SHIFT,blocksToRemove,dir);

    };

    my.toString = function(){
        var x,y,ret = "-----------\n";
        for(y=0;y<maze.MAZE_SIZE;y++){
            for(x=0;x<maze.MAZE_SIZE;x++)
                ret += (my.data[x][y])?"x":".";
            ret += "\n";
        }
        return ret;
    };


    
    return my;
}());