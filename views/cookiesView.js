/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("cookiesView.js");
var maze = maze || {};
maze.views = maze.views || {};

maze.views.cookiesView = (function namespace(){
    var my = {}
    , wallModel
    , wallPos
    , cookieMeshes = []
    , cookieMaterial
    , cookieGeometry
    , cookieGroup
    , playerModel
    , target = {x:0,y:0}
    , targetReached = false
    ;

    function makeCookies(startX,endX,startY,endY){
        var x, y, block;
        for (x=startX;x<endX;x++)
            for (y=startY;y<endY;y++)
                if (wallModel.data[x][y] && wallModel.data[x][y]<0) {
                    block = new THREE.Mesh(cookieGeometry,cookieMaterial);
                    block.position.set(x*maze.UNIT_SIZE,0,y*maze.UNIT_SIZE);
                    cookieGroup.add(block);
                    cookieMeshes[-1 * wallModel.data[x][y]] = block;
                }  
    }
    my.removeCookie = function(id){
        if( cookieMeshes[-1*id] )
            cookieGroup.remove((cookieMeshes.splice(-1*id,1,null))[0]);
    };
    my.shiftCookies = function(list,dir){

        //remove blocks
        list.forEach(function(id){
            if(id < 0)
                cookieGroup.remove((cookieMeshes.splice(-1*id,1,null))[0]);
        });
        
        //shift and add blocks
        switch(dir){
        case maze.NORTH:
            cookieMeshes.forEach(function(block){
                if(block)block.position.z += 2*maze.UNIT_SIZE;
            });
            makeCookies(0,maze.MAZE_SIZE,0,2);
            break;
        case maze.EAST:
            cookieMeshes.forEach(function(block){
                if(block)block.position.x -= 2*maze.UNIT_SIZE;
            });
            makeCookies(maze.MAZE_SIZE-2,maze.MAZE_SIZE,0,maze.MAZE_SIZE);
            break;
        case maze.SOUTH:
            cookieMeshes.forEach(function(block){
                if(block)block.position.z -= 2*maze.UNIT_SIZE;
            });
            makeCookies(0,maze.MAZE_SIZE,maze.MAZE_SIZE-2,maze.MAZE_SIZE);
            break;
        case maze.WEST:
            cookieMeshes.forEach(function(block){
                if(block)block.position.x += 2*maze.UNIT_SIZE;
            });
            makeCookies(0,2,0,maze.MAZE_SIZE);
            break;
            
        }
        my.followWalls();
    };
    my.followWalls = function(){
       cookieGroup.position.x = wallPos.x;
       cookieGroup.position.z = wallPos.z;
    };
    my.changeWireFrame = function(bool){
        var old = cookieMaterial.wireframe;
        cookieMaterial.wireframe = (bool!=null)?bool:!cookieMaterial.wireframe;
        return old;
        //cookieMeshes.forEach(function(mesh){ if(mesh) mesh.material.wireframe = !mesh.material.wireframe;});
    };

    
    my.doAnim = function(){
        //called each frame for animation
        var targetX = -playerModel.x * maze.UNIT_SIZE;
        var targetZ = -playerModel.y * maze.UNIT_SIZE;
        
        //check if we reached our target
        my.targetReached = (Math.abs( cookieGroup.position.x-targetX) < maze.SPEED
                             && Math.abs(cookieGroup.position.z-targetZ) < maze.SPEED);
        if(my.targetReached){
            cookieGroup.position.x = targetX;
            cookieGroup.position.z = targetZ;
            return;
        }

        
        //otherwise animate
        if(cookieGroup.position.x > targetX){
            cookieGroup.position.x -= maze.SPEED;
        }else if(cookieGroup.position.x < targetX){
            cookieGroup.position.x += maze.SPEED;
        }
        if(cookieGroup.position.z > targetZ){
            cookieGroup.position.z -= maze.SPEED;
        }else if(cookieGroup.position.z < targetZ){
            cookieGroup.position.z += maze.SPEED;
        }
      
    };
   
    
    my.init = function(scene,_wallPos){
        console.log(' cookiesview.init ' +_wallPos.x);
        wallModel = maze.models.walls;
        playerModel = maze.models.player;
        wallPos = _wallPos;
        
        cookieMaterial = new THREE.MeshLambertMaterial( 
            { color: 0xffff44, wireframeLinewidth:2, shading: maze.webgl?THREE.SmoothShading:THREE.FlatShading, overdraw: true });
        //cookieMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        //cookieGeometry = new THREE.CubeGeometry(maze.UNIT_SIZE/2,maze.UNIT_SIZE/2,maze.UNIT_SIZE/2,1,1,1);
        cookieGeometry = new THREE.SphereGeometry(1,3,3);
        cookieGroup = new THREE.Object3D();
        scene.add(cookieGroup);

        makeCookies(0,maze.MAZE_SIZE,0,maze.MAZE_SIZE);

        cookieGroup.position.x = -playerModel.x * maze.UNIT_SIZE;
        cookieGroup.position.z = -playerModel.y * maze.UNIT_SIZE;
    };

    return my;
}());