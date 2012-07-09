/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */

var maze = {
    NORTH:1
    , EAST:2
    , SOUTH:3
    , WEST:4
    , MAZE_SIZE:30
    , UNIT_SIZE:10
    , CAM_DIST:80
    , CAM_HEIGHT:30
    , SPEED:1
    , ON_SHIFT:"onShift"
    , ON_ROTATE:"onRotate"
    , ON_MOVE:"onMove"
    , ON_MOVE_DONE:"onMoveDown"
    , ON_COOKIE:"onCookie"
    , VIEW_WIDTH:0
    , VIEW_HEIGHT:0 
    
};


window.onload = function(){
    console.log("window.onload");
    
    /*
     * INIT
     */

    maze.VIEW_WIDTH = window.innerWidth;
    maze.VIEW_HEIGHT = window.innerHeight;
    maze.webgl =  isWebGLSupported();
    if(!maze.webgl){
        //canvas
        maze.CAM_HEIGHT = 50;
        maze.CAM_DIST  = 60;
    }
    maze.touch = "ontouchstart"  in window;
    //maze.touch = true;
    
     var walls = maze.models.walls
    , player = maze.models.player
    , wallsView = maze.views.wallsView
    , mainView = maze.views.mainView
    , playerView = maze.views.playerView
    , cookiesView = maze.views.cookiesView
    , followCam = maze.views.followCam;
    
    //add pub/sub functionality
    maze.helpers.addCallbackFunctions(maze);
    
  	//haha
  
    walls.init();
    player.init();
    mainView.init(document.getElementById('container'));
    
    //add callbacks
    maze.addCallback(maze.ON_SHIFT,wallsView.shiftWalls);
    maze.addCallback(maze.ON_SHIFT,cookiesView.shiftCookies);
    maze.addCallback(maze.ON_SHIFT,player.shift);
    maze.addCallback(maze.ON_MOVE,walls.checkShift);
    maze.addCallback(maze.ON_MOVE,wallsView.playerMove);
    maze.addCallback(maze.ON_MOVE,followCam.updateCamera);
    maze.addCallback(maze.ON_MOVE,playerView.rotate);
    maze.addCallback(maze.ON_MOVE_DONE,player.moveDone);
    maze.addCallback(maze.ON_COOKIE,cookiesView.removeCookie);
    maze.addCallback(maze.ON_COOKIE,mainView.updateScore);

    
    /*
     * CONTROLLER
     */

    //add keyhandlers for moving player
    document.addEventListener('keydown',function (event) {
        switch (event.keyCode) {
        case 37: player.keyDir = player.LEFT; break;
        case 40: player.keyDir = player.BACKWARD; break;
        case 39: player.keyDir = player.RIGHT; break;
        case 38: break;
        default: return;
        }
        if( player.state == player.STOPPED || player.state == player.INIT)
            player.move();
        event.preventDefault();
    });
    document.addEventListener('keyup',function(event) {
        if( (event.keyCode === 37 && player.keyDir === player.LEFT)
            || (event.keyCode === 40 && player.keyDir === player.BACKWARD)
            || (event.keyCode === 39 && player.keyDir === player.RIGHT))
            player.keyDir = null;
    });

    //keyhandlers for debug
    document.addEventListener('keydown',function(event){
        switch(event.keyCode) {
        case 49: playerView.changeWireFrame();break;
        case 50: wallsView.changeWireFrame();break;
        case 51: cookiesView.changeWireFrame();break;
        case 52: followCam.toggleDebug(); break;
        case 53: mainView.toggleStats(); break;
        default: return;
        }
        mainView.render();
    });

    
    //buttons for mobile
    if(maze.touch){
        //display stats by default
        mainView.toggleStats();
        
        [{id:"right",left:maze.VIEW_WIDTH-60+"px",dir:player.RIGHT},
         {id:"down",left:maze.VIEW_WIDTH/2-30+"px",dir:player.BACKWARD},
         {id:"left",left:"10px",dir:player.LEFT}
        ].forEach(function(obj){
            var bt = document.getElementById(obj.id);
            bt.style.left = obj.left;
            bt.style.top = maze.VIEW_HEIGHT - 60+"px";
            bt.style.display = "block";
            bt.addEventListener('mousedown',function(event){
                player.keyDir = obj.dir;
                if( player.state == player.STOPPED || player.state == player.INIT)
                    player.move();
            });
            bt.addEventListener('mouseup',function(event){
                if(player.keyDir === obj.dir)player.keyDir = null;
            });
        });
    }
};

