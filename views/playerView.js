/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("playerView.js");
var maze = maze || {};
maze.views = maze.views || {};

maze.views.playerView = (function namespace(){
    var my = {}
    , model
    , playerMesh;
    

    my.rotate = function(dir){
        switch(dir){
            case maze.NORTH:playerMesh.rotation.y = 0; break;
            case maze.EAST:playerMesh.rotation.y = 270*Math.PI/180;break;
            case maze.SOUTH:playerMesh.rotation.y = 180*Math.PI/180;break;
            case maze.WEST:playerMesh.rotation.y = 90*Math.PI/180;break;
        }
    };
    my.changeWireFrame = function(bool){
        var old = playerMesh.material.wireframe;
        playerMesh.material.wireframe = (bool!=null)?bool:!playerMesh.material.wireframe;
        return old;
    };
    my.init = function(scene){
        console.log("playerView.init");
        model = maze.models.player;
        
        //var geom = new THREE.CylinderGeometry(0,
        //                                      Math.floor(maze.UNIT_SIZE/2),
        //                                      maze.UNIT_SIZE,
        //                                      Math.floor(maze.UNIT_SIZE/3));
        //geom.applyMatrix(new THREE.Matrix4().setRotationFromEuler(
            ////new THREE.Vector3(Math.PI/2,Math.PI,0)));
            //new THREE.Vector3(Math.PI/2,0,Math.PI)));
        //playerMesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({color:0x00ffff}));
        playerMesh = new THREE.Mesh(new THREE.SphereGeometry(maze.UNIT_SIZE/2,10,10),
                                    //new THREE.MeshBasicMaterial({color:0xffff00}));
                                    new THREE.MeshLambertMaterial(
                                        { color: 0xffff22, 
                                          shading: maze.webgl?THREE.SmoothShading:THREE.FlatShading, 
                                          overdraw: true }));
        playerMesh.position.set(0,0,0);
        scene.add(playerMesh);
    };
    
    return my;
}());