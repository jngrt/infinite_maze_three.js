/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("wallsView.js");
var maze = maze || {};
maze.views = maze.views || {};

maze.views.wallsView = (function namespace(){
    var my = {}
    , wallModel
    , wallBlocks = []
    , wallMaterial
    , wallGeometry
    , wallGroup
    , wallGroupPosition
    , playerModel
    , target = {x:0,y:0}
    , targetReached = false
    ;
    
    function makeWalls(startX,endX,startY,endY){
        var x, y, block;
        for (x=startX;x<endX;x++)
            for (y=startY;y<endY;y++)
                if (wallModel.data[x][y] && wallModel.data[x][y]>0) {
                    block = new THREE.Mesh(wallGeometry,wallMaterial);
                    block.position.set(x*maze.UNIT_SIZE,0,y*maze.UNIT_SIZE);
                    wallGroup.add(block);
                    wallBlocks[wallModel.data[x][y]] = block;
                }  
    }
   
    my.shiftWalls = function(list,dir){

        //remove blocks
        list.forEach(function(id){
            if(id > 0)
                wallGroup.remove((wallBlocks.splice(id,1,null))[0]);
        });
        
        //shift and add blocks
        switch(dir){
        case maze.NORTH:
            wallBlocks.forEach(function(block){
                if(block)block.position.z += 2*maze.UNIT_SIZE;
            });
            makeWalls(0,maze.MAZE_SIZE,0,2);
            wallGroup.position.z -= 2*maze.UNIT_SIZE;
            break;
        case maze.EAST:
            wallBlocks.forEach(function(block){
                if(block)block.position.x -= 2*maze.UNIT_SIZE;
            });
            makeWalls(maze.MAZE_SIZE-2,maze.MAZE_SIZE,0,maze.MAZE_SIZE);
            wallGroup.position.x += 2*maze.UNIT_SIZE;
            break;
        case maze.SOUTH:
            wallBlocks.forEach(function(block){
                if(block)block.position.z -= 2*maze.UNIT_SIZE;
            });
            makeWalls(0,maze.MAZE_SIZE,maze.MAZE_SIZE-2,maze.MAZE_SIZE);
            wallGroup.position.z += 2*maze.UNIT_SIZE;
            break;
        case maze.WEST:
            wallBlocks.forEach(function(block){
                if(block)block.position.x += 2*maze.UNIT_SIZE;
            });
            makeWalls(0,2,0,maze.MAZE_SIZE);
            wallGroup.position.x -= 2*maze.UNIT_SIZE;
            break;
            
        }
    };
    
    my.changeWireFrame = function(bool){
        var ret = wallMaterial.wireframe;
        wallMaterial.wireframe = (bool!=null)?bool:!wallMaterial.wireframe;
        //wallBlocks.forEach(function(mesh){ 
        ///    if(mesh)
        //        mesh.material.wireframe = !mesh.material.wireframe;
        //});
        return ret;
    };
    my.playerMove = function(){
        my.targetReached = false;
    };
   
    my.doAnim = function(){
        //called each frame for animation
        var targetX = -playerModel.x * maze.UNIT_SIZE;
        var targetZ = -playerModel.y * maze.UNIT_SIZE;
        
        //check if we reached our target
        my.targetReached = (Math.abs( wallGroup.position.x-targetX) < maze.SPEED
                             && Math.abs(wallGroup.position.z-targetZ) < maze.SPEED);
        if(my.targetReached){
            wallGroup.position.x = targetX;
            wallGroup.position.z = targetZ;
            return;
        }
        
        //otherwise animate
        if(wallGroup.position.x > targetX){
            wallGroup.position.x -= maze.SPEED;
        }else if(wallGroup.position.x < targetX){
            wallGroup.position.x += maze.SPEED;
        }
        if(wallGroup.position.z > targetZ){
            wallGroup.position.z -= maze.SPEED;
        }else if(wallGroup.position.z < targetZ){
            wallGroup.position.z += maze.SPEED;
        }
      
    };
    
    my.init = function(scene){
        wallModel = maze.models.walls;
        playerModel = maze.models.player;
        
        //wallMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
        //wallMaterial = new THREE.MeshNormalMaterial({color:0x0000ff});
        wallMaterial = new THREE.MeshLambertMaterial( 
            { color: 0x4444ff, shading: THREE.FlatShading, overdraw: true, wireframeLinewidth:4 });
        wallGeometry = new THREE.CubeGeometry(maze.UNIT_SIZE,maze.UNIT_SIZE,maze.UNIT_SIZE,1,1,1);
        wallGroup = new THREE.Object3D();
        my.wallGroupPosition = wallGroup.position;
        
        scene.add(wallGroup);

        makeWalls(0,maze.MAZE_SIZE,0,maze.MAZE_SIZE);

        wallGroup.position.x = -playerModel.x * maze.UNIT_SIZE;
        wallGroup.position.z = -playerModel.y * maze.UNIT_SIZE;
    };
    return my;
}());