/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("mainView.js");

var maze = maze || {};
maze.views = maze.views || {};

maze.views.mainView = (function namespace(){
    console.log("mainView namespace()");

    var ORTH_DIST = 100
    , my = {}
    , container
    , wallModel
    , wallsView
    , cookiesView
    , playerView
    , score
    , stats
    //3d objects
    , renderer
    , camera
    , followCam
    , scene
    , player
    , lights;


    function init3d(){
        console.log("mainView.init3d");

        renderer = maze.webgl? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        camera = new THREE.OrthographicCamera(
                -ORTH_DIST
            , ORTH_DIST
            , ORTH_DIST
            , -ORTH_DIST
            , -2000
            , 1000 );
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000,1,maze.MAZE_SIZE*maze.UNIT_SIZE/2+maze.CAM_DIST);
        scene.add(camera);
        //camera.position.set(maze.MAZE_3D_SIZE/2, -30, maze.MAZE_3D_SIZE/2);

        camera.rotation.x = -90 * Math.PI/180;

        renderer.setSize(maze.VIEW_WIDTH,maze.VIEW_HEIGHT);
        renderer.autoClear = false;

        container.appendChild(renderer.domElement);

    }


    my.frameUpdate = function(){

        requestAnimationFrame(my.frameUpdate);

        stats.update();

        if(!wallsView.targetReached){
            wallsView.doAnim();
            cookiesView.followWalls();
            if(wallsView.targetReached) maze.notify(maze.ON_MOVE_DONE);
        }
        if(!followCam.targetReached)
            followCam.doAnim();
        if(!wallsView.targetReached || !followCam.targetReached)
            my.render();
    };

    function renderTopView(){
        var wallsWF = wallsView.changeWireFrame(false);
        var cookieWF = cookiesView.changeWireFrame(true);
        var plWF = playerView.changeWireFrame(false);

        renderer.setViewport(maze.VIEW_WIDTH-155,maze.VIEW_HEIGHT-155,150,150);
        renderer.render(scene, camera);

        cookiesView.changeWireFrame(cookieWF);
        wallsView.changeWireFrame(wallsWF);
        playerView.changeWireFrame(plWF);
        renderer.setViewport(0,0,maze.VIEW_WIDTH,maze.VIEW_HEIGHT);

    }

    my.render = function(){
        renderer.clear();
        if(maze.webgl)
            renderTopView();
        renderer.render(scene,followCam.camera);

    };
    my.toggleStats = function(){
        stats.domElement.style.display = (stats.domElement.style.display=="block")?"none":"block";
    };

    my.updateScore = function(){
        score.innerHTML = player.score.toString();
    };


    my.init = function(_container){
        console.log("views.mainView.init");

        container = _container;

        player = maze.models.player;

        init3d();

        var plane = new THREE.Mesh(
            // new THREE.PlaneGeometry( maze.MAZE_SIZE*maze.UNIT_SIZE,maze.MAZE_SIZE*maze.UNIT_SIZE),
            new THREE.PlaneBufferGeometry( maze.MAZE_SIZE*maze.UNIT_SIZE,maze.MAZE_SIZE*maze.UNIT_SIZE),
            //new THREE.MeshLambertMaterial({color:0x222222,shading:THREE.SmoothShading,overdraw:true}));
            new THREE.MeshBasicMaterial({color:0x111111}));
        plane.rotation.x = -90 * Math.PI/180;
        plane.position.y = -maze.UNIT_SIZE/2;
        scene.add(plane);

        wallsView = maze.views.wallsView;
        wallsView.init(scene);

        cookiesView = maze.views.cookiesView;
        cookiesView.init(scene,wallsView.wallGroupPosition);

        playerView = maze.views.playerView;
        playerView.init(scene);

        followCam = maze.views.followCam;
        followCam.init(scene,playerView);

        lights = maze.views.lights;
        lights.init(scene);


         //stats
        stats = new Stats();
        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = maze.VIEW_WIDTH - 110 - 74+'px';
        stats.domElement.style.top = '5px';
        stats.domElement.style.display = "none";
        _container.appendChild(stats.domElement);

        score = document.getElementById("score");

        //buttons
        var rbut,lbut,dbut;
        if(maze.touch){
            rbut = document.getElementById("right");
            lbut = document.getElementById("left");
            dbut = document.getElementById("down");
            rbut.style.left = maze.VIEW_WIDTH - 60+"px";
            dbut.style.left = maze.VIEW_WIDTH / 2 - 30+"px";
            dbut.style.top = lbut.style.top = rbut.style.top = maze.VIEW_HEIGHT - 50+"px";
            dbut.style.display = lbut.style.display = rbut.style.display = "block";



        }

        my.render();
        my.frameUpdate();
    };

    return my;
}());
