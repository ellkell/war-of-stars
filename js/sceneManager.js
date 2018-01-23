

///sceneManager///
function SceneManager(canvas){
	var clock = new THREE.Clock();
    
    var screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
	
	var scene = buildScene();
	var renderer = buildRenderer();
	var camera = buildCamera();
	var sceneSubjects = createSceneSubjects(scene);

	function buildScene(){
		sceneObj = new THREE.Scene();
		sceneObj.background = new THREE.Color("#000");

		return sceneObj;
	}

	function buildRenderer(){
		rendererObj = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });;
		//rendererObj.setPixelRatio( window.devicePixelRatio );///caused html offset on pixel dense screens
		rendererObj.setSize( window.innerWidth, window.innerHeight );
		rendererObj.sortObjects = false;

		return rendererObj;
	}

	function buildCamera(){
		cameraObj = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1e7 );
		cameraObj.position.z = 30;
		//cameraAdjust = new THREE.Object3D;

		return cameraObj;
	}

	function createSceneSubjects(scene) {
        var sceneSubjects = [
            //new SceneSubject(scene),
			new StarEnv(scene)
        ];

        return sceneSubjects;
    }

    this.update = function() {
        for(let i=0; i<sceneSubjects.length; i++)
        	sceneSubjects[i].update(clock.getElapsedTime());

        renderer.render(scene, camera);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

}