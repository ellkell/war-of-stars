var SolarSystem() = (function(){

	return {
		planet: function (){

		},
		moon: function(){
			
		}
	}
	var planetMoon = new THREE.Object3D();
		
	var rndRadius = getRandomInt(5000, 10000);
	var detail = Math.ceil((5*radius)/6500);
	var pGeom = new THREE.IcosahedronBufferGeometry(radius, 4);
	var cGeom = new THREE.IcosahedronBufferGeometry(radius, 4);
	var color = '0x'+Math.floor(Math.random()*16777215).toString(16);
	var pMat = new THREE.MeshPhongMaterial({
		//color: 0x000000
		map: imgArray[1].src,
		emissive: 0xe1f3ff,
		emissiveMap: imgArray[1].src,
		emissiveIntensity: .2,
	});
	var cMat = new THREE.MeshLambertMaterial({
		
		map: toString(imgArray[3].src),
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
	/*var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: {  },
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );*/
		
	var ballGeometry = new THREE.IcosahedronBufferGeometry(radius * 1.03, 4);
	//var ball = new THREE.Mesh( ballGeometry, customMaterial );
	

	var mGeom = new THREE.IcosahedronBufferGeometry(radius/5, 2);
	var mMat = new THREE.MeshLambertMaterial({
		map: toString(imgArray[2].src),
		emissive: 0xffffff,
		emissiveMap: imgArray[2].src,
		emissiveIntensity: .3,
	});
	var moon = new THREE.Mesh( mGeom, mMat );
	moon.rotation.x = Math.PI/2;
	moon.castShadow = true;
   	moon.receiveShadow = true;
	//moon.material.color.setHex( color );
	moon.position.set(radius * 2,radius * 2,radius * 2);

	planetMoon.add(planet);
	//planetMoon.add(clouds);
	//planetMoon.add( ball );
	//planetMoon.add(moon);
	planetMoon.position.set( -radius, radius, -(radius * 3) );
	planetMoon.rotation.x = -Math.PI/1.3;

	//scene.add(mesh);
	scene.add(planetMoon);
			
})();