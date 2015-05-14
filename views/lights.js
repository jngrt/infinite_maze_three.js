/*jshint boss:true, laxbreak:true, laxcomma:true, funcscope:true */
console.log("lights.js");

var maze = maze || {};
maze.views = maze.views || {};



maze.views.lights = (function namespace(){
    var light1, light2, light3, dirLight, my = {};

    my.bright = function(bool){
        //dirLight.visible = bool;
        //dirLight.position.y = bool?40:-40;
        //dirLight.color = bool?0xffffff:0x004499;
    };
    my.init = function(scene){

        scene.add( new THREE.AmbientLight( 0x00020 ) );

        var lightDist = 5*maze.UNIT_SIZE;

		  //light1 = new THREE.PointLight( 0x880040, 1, 120 );
        //light1.position.set(lightDist,lightDist,lightDist);
		  //scene.add( light1 );

		  light2 = new THREE.PointLight( 0x008888, 1, 120 );
        light2.position.set(-lightDist,lightDist,-lightDist);
		  scene.add( light2 );

		  light3 = new THREE.PointLight( 0x80ff80, 1, 180 );
        light3.position.set(20,30,0);
		  scene.add( light3 );

        //directional light to make topview look better
        if(maze.webgl){
            dirLight = new THREE.DirectionalLight(0x6622ff,1,400);
            dirLight.position.set(0,100,0);
            scene.add(dirLight);
        }

    };

    return my;
}());
