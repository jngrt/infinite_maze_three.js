/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("player.js");

var maze = maze || {};
maze.models = maze.models || {};
maze.models.player = (function namespace(){
    
    var my = {
        STOPPED:"stopped"
        , MOVING:"moving"
        , REACHED_NODE:"reachedNode"
        , INIT:"init" 
        , LEFT:1
        , FORWARD:2
        , RIGHT:3
        , BACKWARD:4 
        , keyDir:0
        , dir:1
        , x:0
        , y:0
        , score:0
    }
    , callbacks = {};
    my.state = my.INIT;
    
    function dirFree(dirToCheck){
        if(!dirToCheck || dirToCheck === 0)return false;

        var newPos = getNeighbor(my.x,my.y,dirToCheck);
        if (newPos.x < 0 
            || newPos.x >= maze.MAZE_SIZE 
            || newPos.y < 0 
            || newPos.y >= maze.MAZE_SIZE) 
            return false;
        
        return maze.models.walls.positionFree(newPos.x,newPos.y);
    }
    function getNeighbor(x,y,dir){
        var ret = {x:x,y:y};
        switch (dir) {
        case maze.NORTH:
            ret.y--;
            break;
        case maze.EAST:
            ret.x++;
            break;
        case maze.SOUTH:
            ret.y++;
            break;
        case maze.WEST:
            ret.x--;
            break;
        } 
        return ret;
    }

    function relativeDir(dirToTranslate) {
        switch (dirToTranslate) {
        case my.LEFT:
            return 1 + (my.dir + 2) % 4;
        case my.RIGHT:
            return 1 + my.dir % 4;
        case my.BACKWARD:
            return 1 + (my.dir + 1) % 4;
        }
    }
    
    my.moveDone = function(){
        my.state = my.REACHED_NODE;
        var cookie = maze.models.walls.checkAndRemoveCookie(my.x,my.y);
        if( cookie < 0){
            my.score++;
            maze.notify(maze.ON_COOKIE,cookie);
        }
        my.move();
    };

    my.move = function(){

        var newDir,x,y
        , relDir = relativeDir(my.keyDir)
        , relDirFree = dirFree(relDir)
        , myDirFree = dirFree(my.dir);
        
        if (my.state === my.INIT) {
            newDir = my.dir;
        }else if (my.state === my.STOPPED && relDir && relDirFree) {
            newDir = relDir;
        }else if (my.state === my.REACHED_NODE) {
            if (relDir && relDirFree) newDir = relDir;
            else if (my.dir && myDirFree) newDir = my.dir;
            else{
                my.state = my.STOPPED;
                my.keyDir = null;
            }
        }

        if (newDir) {
            
            if (newDir === relDir) {
                //reset key because the keypress has been taken in account 
                my.keyDir = null;
            }

            my.dir = newDir;
            var newPos = getNeighbor(my.x,my.y,my.dir);
            my.x = newPos.x;
            my.y = newPos.y;

            my.state = my.MOVING;
            
            //callback
            maze.notify(maze.ON_MOVE,my.dir);
        }
    };

    my.shift = function(data,dir){
        switch(dir){
        case maze.NORTH:my.y+=2;break;
        case maze.EAST:my.x-=2;break;
        case maze.SOUTH:my.y-=2;break;
        case maze.WEST:my.x+=2;break;
        }
    };
    
    my.init = function(){
        my.x = my.y = Math.floor(maze.MAZE_SIZE/2);
    };
    
    return my;
}());