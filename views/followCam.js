/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("followCam.js");

var maze = maze || {};
maze.views = maze.views || {};

maze.views.followCam = (function namespace(){
    var playerView
    , curDeg = 0
    , curRad = 0
    , targetDeg = 0
    , playerDir = 0
    , dir = 1
    , target
    , debugMesh
    , my = {
        targetReached:false
        , camera:null
    };

    function getDifferenceBetweenAngles(a,b){
        var dif = a-b;
        while(dif<-180)dif+=360;
        while(dif>180)dif-=360;
        return dif;
    }
    my.updateCamera = function(pdir){
        if(playerDir == pdir)return;
        playerDir = pdir;
        targetDeg = ((playerDir) * 90) % 360;
        my.targetReached = false;
    };

    my.doAnim = function(){
        var difAngle = getDifferenceBetweenAngles(curDeg,targetDeg);
        if(Math.abs(difAngle)<2){
            my.targetReached = true;
            return;
        }

        curDeg = (curDeg - difAngle * 0.05) % 360;
        curRad = curDeg * Math.PI/180;

        my.camera.position.z = maze.CAM_DIST*Math.sin(curRad);
        my.camera.position.x = maze.CAM_DIST*Math.cos(curRad);

        my.camera.lookAt(my.camera.target);
        debugMesh.position.copy(my.camera.position);
        debugMesh.position.y += 10;
        debugMesh.lookAt(my.camera.target);
    };
    my.toggleDebug = function(){
        debugMesh.material.opacity = (debugMesh.material.opacity>0)?0:100;
    };
    my.init = function(_scene,_playerView){
        console.log("followCam.init");
        playerView = _playerView;

        my.camera = new THREE.PerspectiveCamera(
            45
            , maze.VIEW_WIDTH/maze.VIEW_HEIGHT
            , 1
            , 1000 );
        _scene.add(my.camera);
        my.camera.position.set(0,maze.CAM_HEIGHT,maze.CAM_DIST);

        curDeg = 90;
        targetDeg = 90;
        my.camera.target = new THREE.Vector3(0,0,0);
        my.camera.lookAt(my.camera.target);

        var geom = new THREE.CylinderGeometry(0,5,10,3);
        geom.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(Math.PI/2,Math.PI/2,0,'XYZ')));

        debugMesh = new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color:0xff00ff,wireframe:true,opacity:0}));
        _scene.add(debugMesh);
        debugMesh.position.copy(my.camera.position);
        debugMesh.position.y += 10;
        debugMesh.lookAt(my.camera.target);

    };

    return my;
}());
