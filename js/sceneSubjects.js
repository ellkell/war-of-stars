
var StarEnv = function(scene){
	var radius = 30000;
	var starsF=[];
	var startPt = [];
	var distant, starfield = false;
	this.initDistant = function(){
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
	this.initStarfield= function(){
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
	this.update = function(){
		if(starfield){
			for(var i=0; i < starsF.length; i++) {
			
				var starF = starsF[i]; 
					
				// and move it forward dependent on the mouseY position. 
				starF.position.z +=  i/3;
					
				// if the particle is too close move it to the back
				if(starF.position.z>1000) starF.position.z-=2000;
				if(starF.position.x<5000 || starF.position.x > -5000){ starF.opacity = 0; }  
			
			}
		}
	}
}

var SetControls = function(scene){
	var controls;
	var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)|(IEMobile)|(Opera Mini)/i);
	if (isMobile) { 
		controls = new THREE.DeviceOrientationControls( camera ); 
	}else{ 
		controls = new THREE.OrbitControls( camera );
		controls.rotateSpeed = -.3;
	}

	this.enabled = function(bool){
		controls.enabled = bool;
	}
	
	this.update = function() {
		controls.update();
	}
}

var VideoSphere = function(scene){
	          
	var video = document.createElement('video');
		video.id = 'video';
		video.src = "media/gorillaz360.mp4";
		video.autoplay = true;
		video.load();
		video.play();

	var texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;
		texture.anistropy = 16;

	var sphere = new THREE.SphereGeometry(80, 50, 50);

	var material = new THREE.MeshBasicMaterial({
	color: 0xffffff, 
	map: texture,
	side: THREE.DoubleSide
	});

	var sphereMesh = new THREE.Mesh(sphere, material);
	//sphereMesh.position.set(0,0,500);
	scene.add(sphereMesh);

	scene.add(mesh);
	
	this.update = function() {
		//something something
	}
}