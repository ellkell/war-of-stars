var camera, cameraAdjust, controls, transformControl, scene, scene2, renderer, renderer2, stats, readyTimer, loadingClip;
var mouse, draw, hud, isTap, tie, tl;
var clock = new THREE.Clock();
var radius = 30000;
var timer = null;
var enableLock = false;

/*var isMobile = navigator.userAgent.match(/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|Pixel/i);*/
var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)/i);;
var enemies = [];
var hitboxes = [];
var starsF=[];
var startPt = [];
var path1 = [];
var path2 = [];
var hotspots = [];
var radArray = [];

var endPt = {x:0,y:0,z:-1000};

var eCount = 0;

var hud, hudPos, hudSize;

var h = 0;
var threeProgress = 0;
var imgProgress = 0;
var imgArray = [];
var audioArray = [];
var audioOrder = [];

var explosionTexture;
var boomer = false;
var boomerTimer = false;

var bb8Super, bb8Head, bb8Body;

///INIT
function init() {

	window.addEventListener("devicemotion", function(event){
	    if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma){
	        isMobile = true;
		}
	});
    window.devicePixelRatio = 1;
	container = document.getElementById( 'container' );
	background = document.getElementById( 'background' );
	hotspotWrap = document.getElementById( 'hotspotWrap' );
	test = document.getElementById('test');
	stats = new Stats();
	//createTest(3,true);

	raycaster = new THREE.Raycaster();
	mouseVector = new THREE.Vector2();
	
	initScene();
	//addDistantStars();
	addStarfield();

	window.addEventListener( 'resize', onWindowResize, false );		

	TweenLite.ticker.addEventListener("tick", render);
	//tl = new TimelineLite();		
}

function initScene(){
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1e7 );
	camera.position.z = 30;
	cameraAdjust = new THREE.Object3D;
	
	scene = new THREE.Scene();
	//scene2 = new THREE.Scene();

	xwing = new THREE.Object3D();
	xwing.name = "xwing";
	planets = new THREE.Object3D();
	bb8Super = new THREE.Object3D();
	bb8Head = new THREE.Object3D();
	bb8Body = new THREE.Object3D();

	renderer = new THREE.WebGLRenderer();

	renderer.setPixelRatio( window.devicePixelRatio );///caused html offset on pixel dense screens
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;

	container.appendChild( renderer.domElement );

	if (isMobile) { 
		controls = new THREE.DeviceOrientationControls( camera ); 
	}else{ 
		controls = new THREE.OrbitControls( camera );
		controls.rotateSpeed = -.3;
	}
	controls.enabled = false;
	
	
	var manager = new THREE.LoadingManager();
	manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		

		console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

	};

	manager.onLoad = function ( ) {
		//console.table(imgArray);
		var sphere = new THREE.Mesh(
			new THREE.IcosahedronBufferGeometry(1000000, 3),
			new THREE.MeshBasicMaterial({
				visible: true,
				transparent: true,
				opacity: .6,
				wireframe: false,
				map: imgArray[4],
				side: THREE.DoubleSide
			})
		);
		//sphere.position.set(-300,40,-150);
		scene.add(sphere);

		makeSolarSystem();

		WeaponsFire.initLaser();
		BB.initBB();
		
	};

	manager.onProgress = function ( item, loaded, total ) {
			
		threeProgress = (loaded / total * 100);
		
	};

	manager.onError = function ( url ) {

		console.log( 'There was an error loading ' + url );

	};

	AudioSFX.loadSound();
	loadingScreen();
	var xloader = new THREE.ObjectLoader( manager );
		xloader.load("./models/xwing_scene.json", function ( obj ) {
			obj.position.set(0,-15,40);
			obj.scale.set(100,100,100);
			//obj.rotation.set(0,-Math.PI/2,0);
			obj.name = 'x-wing';
			xwing.add( obj );
		});

	var bbHeadLoader = new THREE.ObjectLoader( manager );
	bbHeadLoader.load( "./models/bb8-head.json", function( obj ) {
		
	   	//obj.position.set(0,0,0);
		obj.scale.set(1,1,1);
		obj.rotation.set(0,-Math.PI/2,0);
		obj.name = 'bb8Head';
		obj.castShadow = true;
		obj.receiveShadow = true;
		
		bb8Super.add( obj );
	});

	var bbBodyLoader = new THREE.ObjectLoader( manager );
	bbBodyLoader.load( "./models/bb8-body.json", function( obj ) {
		
	   	//obj.position.set(0,0,0);
		obj.scale.set(1,1,1);
		obj.rotation.set(0,-Math.PI/2,0);
		obj.name = 'bb8Body';
		obj.castShadow = true;
		obj.receiveShadow = true;
		console.log(obj);
		obj.children[0].position.y = obj.children[0].scale.y;
		
		bb8Super.add( obj );
	});

	var tloader = new THREE.JSONLoader( manager );
	tloader.load( "./models/tieFighter02.json", function( geometry, materials ) {
	   	var tieMat = materials[0];
	   	tieMat.transparent = true;
	   	tieMat.opacity = 1;
	   	geometry.computeFaceNormals();
		geometry.computeVertexNormals();
	   	tfighterModel = new THREE.Mesh( geometry, tieMat );
	   	tfighterModel.scale.set(300,300,300);
	   	rotateObject(tfighterModel, 0, -90, 0);
	   	tfighterModel.castShadow = true;
	   	tfighterModel.receiveShadow = true;
	});

	var iLoader = new THREE.TextureLoader( manager );
	var iLoadManifest = [
		{id:"image0",src:'media/explo2.png'},
		{id:"image1",src:'media/planet_tex.jpg'},
		{id:"image2",src:'media/moon_tex.jpg'},
		{id:"image3",src:'media/clouds.png'},
		{id:"starmap",src:'media/starmap_4k.jpg'}
	];
	for (var i = 0; i < iLoadManifest.length; i++){
		var texture = iLoader.load(iLoadManifest[i].src);
		var regex = /[^/\\]+(?:jpg|gif|png)/gi;
		var imgSrc = iLoadManifest[i].src;
		var nameness = imgSrc.match(regex);
		texture.name = 'tex-'+nameness[0];

		imgArray.push(texture);
	}

	

	var audioLoader = new THREE.AudioLoader();
		
	var aLoadManifest = [
		{id:"tfb0",src:'media/audio/sfx/TieFighterBy_01.mp3'},
		{id:"tfb1",src:'media/audio/sfx/TieFighterBy_02.mp3'},
		{id:"tfb2",src:'media/audio/sfx/TieFighterBy_03.mp3'},
		{id:"tfb3",src:'media/audio/sfx/TieFighterBy_04.mp3'},
		{id:"tfb4",src:'media/audio/sfx/TieFighterBy_05.mp3'},
		{id:"tfb5",src:'media/audio/sfx/TieFighterBy_06.mp3'}
	];
	var listener = new THREE.AudioListener();
	for(var i = 0; i< aLoadManifest.length; i++){
		
		camera.add( listener );
		
		audioLoader.load( aLoadManifest[i].src, function( buffer, i ) {
			var sound = new THREE.PositionalAudio( listener );
			sound.setBuffer( buffer );
			sound.setRefDistance( 1000 );
			sound.setVolume( 1 );
			audioArray.push( sound );
			audioOrder.push( getRandomInt(0,5) );
			console.log(sound);
		});

	}

	createPointLight( 0x266aff, 1, 80, {x:-8,y:-18,z:1} );
	createPointLight( 0xed2828, 1, 80, {x:6,y:-20,z:3} );
	//createPointLight( 0xffffff, 1, 50, {x:0,y:-10,z:3} );///white
	createPointLight( 0xffffff, 1, 300, {x:0,y:30,z:70} );///white
	createPointLight( 0xe2f1ff, 3, 6000, {x:0,y:10,z:-5000} );
	createDirectionalLight( 0xf9f8e5, 2, {x:10.7, y:0.129, z:14.15} );
	createDirectionalLight( 0xf9f8e5, 1, {x:-30, y:0, z:0} );

	var amb = new THREE.AmbientLight( 0x404040, .8 );
	xwing.add( amb );		
	scene.add( xwing );

	var hudHotSpot = new THREE.Mesh(
		new THREE.IcosahedronBufferGeometry(1, 2),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
			visible: false,
			wireframe: true,
		})
	);
	hudHotSpot.name = 'hudHotSpot';
	hudHotSpot.position.set(0,50,-100);
	scene.add(hudHotSpot);

	//initHotspot( "hudHotSpot" , "hudHotSpot", "hud" );	
}

function loadingScreen(){
	var allProgress;
	var interval = window.setInterval(function(){
		//allProgress = (threeProgress + audioProgress)/2;
		allProgress = (threeProgress + audioProgress)/2;
		if(allProgress > 99){
			explosionTexture = imgArray[0];
			animateLoad();

			console.log('All Loaded');
			orderPost = [1,2,3,4,7,8,9,10,12];
			orderPre =[0,5,6,11,99,99];
			orderPost = AudioSFX.shuffle(orderPost);
			orderPre = AudioSFX.shuffle(orderPre);
			console.log("pre "+orderPre);
			console.log("post "+orderPost);
			
			window.clearInterval(interval);
			
		}else{
			loadingClip = document.getElementById('xwingB');
			loadingClip.setAttribute("y",(100-allProgress));
		}
	},100);
}

function animateLoad(){
	var loadingAnim = document.getElementById('loading');
	loadingClip.setAttribute("opacity", 0);
	document.getElementById('xwingF').setAttribute("class", "st1");
	TweenLite.to('#header', 2, { opacity: 1, delay: .5,onComplete: function(){
			TweenLite.to('#startBtn', .5, { opacity: 1 });
			document.getElementById('startBtn').addEventListener('touchend', handleStart);
			function handleStart(){
				document.getElementById('startBtn').removeEventListener('touchend', handleStart);
				TweenLite.to('#header', 1, { opacity: 0, onComplete: function(){
					//document.getElementById('header').remove();
				}});	
				readyTimer = window.setTimeout(onReady, 800);
				
				for (var i =0; i < audioArray.length; i++){
					audioArray[i].play();
					audioArray[i].pause();
					
				}
			}
		}
	});
	TweenLite.to(loadingAnim, 1, { top:(-loadingAnim.clientHeight), delay: .25, ease: Power3.easeInOut});
}

function onReady(){
	//makePlanet();

	controls.enabled = true;
	animate();
	AudioSFX.introSound();
	controls.alphaOffsetAngle = -camera.rotation.y;

	window.clearTimeout(readyTimer);

	if (isMobile){
		mode = 0;

		//window.addEventListener( 'deviceorientation', getInitTilt);
		//window.addEventListener( 'deviceorientation', handleTilt);

		console.log("mobile: " + isMobile);
	}

	TweenLite.to('#blocker', 1, { opacity: 0});
}

function isInView( obj, string ){
	var div = document.getElementById( string );
  	camera.updateMatrix(); // make sure camera's local matrix is updated
  	camera.updateMatrixWorld(); // make sure camera's world matrix is updated
  	camera.matrixWorldInverse.getInverse( camera.matrixWorld );
  
  	var frustum = new THREE.Frustum();
  	frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
  	if ( frustum.intersectsObject( obj )){
    	div.style.display = '';
  	}else{
    	div.style.display = 'none';
  	}
}

function handleEvents(bool){
			
	var active = bool;
	if (active){
		if(isMobile){
			window.addEventListener( 'touchstart', onMouseDown, false );
			window.addEventListener( 'touchend', onMouseUp, false );
		}else{
			window.addEventListener( 'mousedown', onMouseDown, false );
			window.addEventListener( 'mouseup', onMouseUp, false );
		}
	}else{
		if(isMobile){
			window.removeEventListener( 'touchstart', onMouseDown, false );
			window.removeEventListener( 'touchend', onMouseUp, false );
		}else{
			window.removeEventListener( 'mousedown', onMouseDown, false );
			window.removeEventListener( 'mouseup', onMouseUp, false );
		}
	}
}

function onMouseDown(e){
	e.preventDefault();
	//e.stopPropagation();

	console.log("tap");
	var pointer = (e.touches && e.touches[0].clientX) ? event.touches[0] : event;
	endPt.x = pointer.clientX;
	endPt.y = pointer.clientY;
	/*endPt.z = -1000*/
	
	console.log(endPt);
	//if(!isAndroid || !isChrome ) { event.preventDefault(); }
	
	isTap = camera.getWorldDirection();
	mouseVector.x = ( endPt.x / window.innerWidth ) * 2 - 1;
	mouseVector.y = - ( endPt.y / window.innerHeight ) * 2 + 1;

	var mode = 0;
	TieFighter.checkWin(.1, {x: pointer.clientX, y: pointer.clientY}, mouseVector  );	
}

function onMouseUp(e){
	
	path1 = [];
	path2 = [];
	endPt.x, endPt.y = 0;
	
}

function triggerResolve(){
	var xwing0 = scene.getObjectByName( "xwing" );
	//console.log(xwing0);
	//scene.remove(xwing0);
	document.getElementById("hud").style.opacity = 0;
	document.getElementById("startBtn").style.display = 'none';
	document.getElementById("endBtn").style.display = 'block';
	document.getElementById("blocker").style.opacity = 1;
	document.getElementById("header").style.opacity = 1;
	document.getElementById("header").style.top = 31+'%';
	document.getElementById("loadwrap").style.backgroundColor = 'rgba(0,0,0,.5)';
	document.getElementById("blocker").style.backgroundColor = 'rgba(0,0,0,0)';
	
	document.getElementById("endBtn").addEventListener('touchend', function(){
		window.location = 'http://www.starwars.com/films/star-wars-episode-viii-the-last-jedi';
	}, false);

}

///SCENE
function createPointLight(color, intensity, falloff, pos){

	var light = new THREE.PointLight( color, intensity, falloff, 2 );
	light.position.set(pos.x, pos.y, pos.z);
	light.castShadow = true;

	/*var lightControl = new THREE.TransformControls( camera, renderer.domElement );
	lightControl.addEventListener( 'change', render );
	lightControl.attach( light );
	scene.add( lightControl );*/

	scene.add( light );
}

function createDirectionalLight(color, intensity, pos){

	var dirLight = new THREE.DirectionalLight( color, intensity );
	dirLight.castShadow = true;

	var targetObject = new THREE.Object3D();
	targetObject.position.set(pos.x, pos.y, pos.z);
	
	var transformControl = new THREE.TransformControls( camera, renderer.domElement );
	//transformControl.addEventListener( 'change', function(e){render();} );

	dirLight.target = targetObject;
	scene.add(targetObject);
	transformControl.attach( targetObject );
	//scene.add( transformControl );
	scene.add( dirLight );
}

function addDistantStars(){
	var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
	for ( i = 0; i < 250; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2 - 1;
		vertex.y = Math.random() * 2 - 1;
		vertex.z = Math.random() * 2 - 1;
		vertex.multiplyScalar( r );
		starsGeometry[ 0 ].vertices.push( vertex );
	}
	for ( i = 0; i < 1500; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2 - 1;
		vertex.y = Math.random() * 2 - 1;
		vertex.z = Math.random() * 2 - 1;
		vertex.multiplyScalar( r );
		starsGeometry[ 1 ].vertices.push( vertex );
	}
	var stars;
	var starsMaterials = [
		new THREE.PointsMaterial( { color: 0x555555, size: .5, sizeAttenuation: false } ),
		new THREE.PointsMaterial( { color: 0x555555, size: .25, sizeAttenuation: false } ),
		new THREE.PointsMaterial( { color: 0x333333, size: .5, sizeAttenuation: false } ),
		new THREE.PointsMaterial( { color: 0x3a3a3a, size: .25, sizeAttenuation: false } ),
		new THREE.PointsMaterial( { color: 0x1a1a1a, size: .5, sizeAttenuation: false } ),
		new THREE.PointsMaterial( { color: 0x1a1a1a, size: .25, sizeAttenuation: false } )
	];
	for ( i = 10; i < 30; i ++ ) {
		stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
		stars.rotation.x = Math.random() * 6;
		stars.rotation.y = Math.random() * 6;
		stars.rotation.z = Math.random() * 6;
		s = i * 10;
		stars.scale.set( s, s, s );
		stars.matrixAutoUpdate = false;
		stars.updateMatrix();
		scene.add( stars );
	}
}

function addStarfield(){
	var starsGeometry = new THREE.Geometry();
	// The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
	for ( var z= -1000; z < 1000; z+=50 ) {
		
		var star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread( 2000 );
			star.y = THREE.Math.randFloatSpread( 2000 );
			star.z = THREE.Math.randFloatSpread( 2000 );

		starsGeometry.vertices.push( star );

		var starsMaterial = new THREE.PointsMaterial( { color: 0x888888, size: 3, sizeAttenuation: true } );


		var starField = new THREE.Points( starsGeometry, starsMaterial );

		// This time we give the sphere random x and y positions between -500 and 500
		starField.position.x = Math.random() * 1000 - 500;
		starField.position.y = Math.random() * 1000 - 500;

		// Then set the z position to where it is in the loop (distance of camera)
		starField.position.z = z*1.2;

		//add the sphere to the scene
		scene.add( starField );

		//finally push it to the stars array 
		starsF.push(starField); 
	}
	
}

function makeSolarSystem(){
	var planetMoon = new THREE.Object3D();
	planetMoon.name = 'planetMoon';
		
	var rndRadius = getRandomInt(5000, 10000);
	var detail = Math.ceil((5*radius)/6500);
	var pGeom = new THREE.IcosahedronBufferGeometry(radius, 4);
	var cGeom = new THREE.IcosahedronBufferGeometry(radius+.5, 4);
	var color = '0x'+Math.floor(Math.random()*16777215).toString(16);
	var pMat = new THREE.MeshPhongMaterial({
		//color: 0x000000
		map: imgArray[1],
		emissive: 0xe1f3ff,
		emissiveMap: imgArray[1],
		emissiveIntensity: .1,
	});
	var cMat = new THREE.MeshLambertMaterial({
		
		map: imgArray[3],
		transparent: true,
		emissive: 0xffffff,
		emissiveIntensity: .2,
		depthTest: true,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: -5,
		polygonOffsetUnits: -25.0
	});

	var planet = new THREE.Mesh( pGeom, pMat );
	planet.name = "planet";
	planet.castShadow = true;
   	planet.receiveShadow = true;
	var clouds = new THREE.Mesh( cGeom, cMat );
	clouds.name = "clouds";
	//clouds.scale.set(1.1,1.1,1.1);
	
	planet.material.color.setHex( color );

	///GLOW
	var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: {  },
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
		opacity:.5
	}   );
		
	var ballGeometry = new THREE.IcosahedronBufferGeometry(radius * 1.05, 4);
	var ball = new THREE.Mesh( ballGeometry, customMaterial );
	

	var mGeom = new THREE.IcosahedronBufferGeometry(radius/5, 2);
	var mMat = new THREE.MeshLambertMaterial({
		map: imgArray[2],
		emissive: 0xffffff,
		emissiveMap: imgArray[2],
		emissiveIntensity: .3,
	});
	var moon = new THREE.Mesh( mGeom, mMat );
	moon.rotation.x = Math.PI/2;
	moon.castShadow = true;
   	moon.receiveShadow = true;
	//moon.material.color.setHex( color );
	moon.position.set(radius * 2,radius * 2,radius * 2);

	planetMoon.add(planet);
	planetMoon.add(clouds);
	planetMoon.add( ball );
	planetMoon.add(moon);
	planetMoon.position.set( -radius, radius, -(radius * 3) );
	planetMoon.rotation.x = -Math.PI/1.3;
	
	scene.add(planetMoon);
}

///ANIMATION
function animateStars() { 
			
	// loop through each star
	for(var i=0; i<starsF.length; i++) {
		
		var starF = starsF[i]; 
			
		// and move it forward dependent on the mouseY position. 
		starF.position.z +=  i/3;
			
		// if the particle is too close move it to the back
		if(starF.position.z>1000) starF.position.z-=2000;
		if(starF.position.x<5000 || starF.position.x > -5000){ starF.opacity = 0; }  
		
	}
}

function animatePlanets(){
	var clouds = scene.getObjectByName('clouds');
	var system = scene.getObjectByName('planetMoon');
	var rate = 10;

	system.position.z += rate;
	clouds.rotation.z += .0001;
	clouds.rotation.y += .00015;
}
	
function animate() {
	var delta = new Date();
	var eDis = -5000;


	requestAnimationFrame( animate );

	//isInView( i, textlabels[i].t.element );
	controls.update();
	stats.update();
	TWEEN.update();
	animateStars();
	animatePlanets();
	TieFighter.checkLockOn();
	var hudHotSpot = scene.getObjectByName('hudHotSpot');
	var tieHotSpot = scene.getObjectByName('tie');
	
	isInView( hudHotSpot, 'hud' );
	
	if(tieHotSpot){
		//console.log(tieHotSpot);
		//isInView( tieHotSpot.children[1], 'tie')
	};
	var delta = clock.getDelta(); 
	if( boomer && boomerTimer ) { boomer.update(100 * delta); }
	
	render();
}

function render() {

	if (hotspots.length > 0){
		for(var i=0; i<hotspots.length; i++) {

			hotspots[i].updatePosition();
		}
	}
	renderer.render(scene, camera);

}

///UTILITIES
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function rotateObject(object,degreeX, degreeY, degreeZ){
   degreeX = (degreeX * Math.PI)/180;
   degreeY = (degreeY * Math.PI)/180;
   degreeZ = (degreeZ * Math.PI)/180;

   object.rotateX(degreeX);
   object.rotateY(degreeY);
   object.rotateZ(degreeZ);
}

function onWindowResize() {
  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  	hudPos = {t: parseInt(window.getComputedStyle(hud, null).top), l:parseInt(window.getComputedStyle(hud, null).left)};
	hudSize = { h:hud.clientHeight, w: hud.clientWidth };

  	render();
}

function fadeOpacity(obj, to, duration, func){
  duration = (typeof duration === 'undefined') ? 1000 : duration;
  var interval = 10;
  curO= window.getComputedStyle(obj, null).opacity;
  curO = parseFloat(curO);
  rate = (Math.abs(to - curO))/(duration/interval);
  if(to > curO){

    var delta = curO;

    (function fade(){

      obj.style.opacity = delta;
      obj.style.display = '';
      if((delta += rate) > to){
        obj.style.opacity = to;
        if (func !== undefined){
          func();
        }
      }else{
        requestAnimationFrame(fade);
      }
    })();
  }else if (to < curO){
    var delta = curO;
    
    (function fade(){

      obj.style.opacity = delta;
      obj.style.display = '';
      if((delta -= rate) < to){
        obj.style.opacity = to;
        if (delta = 0){ obj.style.display = 'none'; };
        if (func !== undefined){
          func();
        }
      }else{
        requestAnimationFrame(fade);
      }
    })();
  }else{
    console.log('no fade, start = end');
    return;
  }
}

function createTest(num, log){

	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	var test = document.createElement('div');
	test.id = "test";
	for (var i = 0; i < num; i++){
		var field = document.createElement('div');
		field.id = "param"+(i+1);
		test.appendChild(field);
	}
	if(log && isMobile){
	   window.onerror = function(message, url, linenumber) {
	    	var createLog = document.createElement('div');
		    createLog.id = 'log';
		    test.appendChild(createLog);
	        document.getElementById('log').innerHTML ="JavaScript error: " + message + " on line " +
	            linenumber + " for " /*+ url*/;
	    }; 
	}

  document.body.appendChild(test);
}