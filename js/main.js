///main.js///
const canvas = document.getElementById("canvas");

const sceneManager = new SceneManager(canvas);
initLoaders();
function initLoaders(){
	AudioSFX.loadSound();
	onReady();
}

function onReady(){
	bindEventListeners();
	render();
}

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();	
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';
	
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
    
    sceneManager.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}