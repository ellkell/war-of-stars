var WeaponsFire = (function (){
	var lines = [];
	var animateVisibility = false;
	var clock = new THREE.Clock();
	var endPos;
	

	var textureAnimator = function(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration){	
		// note: texture passed by reference, will be updated by the update function.
			
		this.tilesHorizontal = tilesHoriz;
		this.tilesVertical = tilesVert;
		// how many images does this spritesheet contain?
		//  usually equals tilesHoriz * tilesVert, but not necessarily,
		//  if there at blank tiles at the bottom of the spritesheet. 
		this.numberOfTiles = numTiles;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

		// how long should each image be displayed?
		this.tileDisplayDuration = tileDispDuration;

		// how long has the current image been displayed?
		this.currentDisplayTime = 0;

		// which image is currently being displayed?
		this.currentTile = 0;

		this.update = function( milliSec ){
			this.currentDisplayTime += milliSec;
			if (this.currentDisplayTime > this.tileDisplayDuration)
			{
				this.currentDisplayTime -= this.tileDisplayDuration;
				this.currentTile++;
				if (this.currentTile == this.numberOfTiles){
					this.currentTile = 0;
				}else{
					var currentColumn = this.currentTile % this.tilesHorizontal;
					texture.offset.x = currentColumn / this.tilesHorizontal;
					var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
					texture.offset.y = currentRow / this.tilesVertical;
				}
			}
		};
	}

	var explosion = function(tfPos){
		AudioSFX.explosion(getRandomInt(0, 5));	
		boomer = new textureAnimator( explosionTexture, 25, 1, 25, 5 );	// texture, #horiz, #vert, #total, duration.
		
		var explosionMaterial = new THREE.SpriteMaterial( { map: explosionTexture, color:'#ffffff' } );
		
		var exploSprite = new THREE.Sprite( explosionMaterial );
			exploSprite.needsUpdate = true;
			exploSprite.position.set(tfPos.x,tfPos.y,(tfPos.z+200));
			exploSprite.scale.set(800,800,800);
			exploSprite.name = 'exploSprite';
		scene.add( exploSprite );
		
		var explo = scene.getObjectByName('exploSprite');
		boomerTimer = window.setTimeout(function(){
			boomerTimer = false;
			scene.remove(explo);
			for(var i=0;i<lines.length;i++){
				scene.remove(lines[i]);
			}
		}, 900);
	}

	///laser///
	

	return {

		initLaser : function(){
			
			startPt[0] = new THREE.Vector3(-300 , 40, -150);
			startPt[1] = new THREE.Vector3(-300 ,-100,-150);
			startPt[2] = new THREE.Vector3(300 ,40,-150);
			startPt[3] = new THREE.Vector3(300 ,-100,-150);
			//endPt = {x:0,y:0,z:-1000};
			animateVisibility = true;
			
		},

		laserBlast : function (blast, tfPos){
			AudioSFX.laser(getRandomInt(0, 5));
			endPos = tfPos.clone();
			for(var i=0; i<4;i++){
				var circleRadius = .2;
				var circleShape = new THREE.Shape();
				circleShape.moveTo( 0, circleRadius );
				circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
				circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
				circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
				circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );
				
				var mid = new THREE.Vector3(
					((startPt[i].x-endPos.x)/2),
					((startPt[i].y-endPos.y)/2),
					((startPt[i].z-endPos.z)/2),
				);
				var extrudeSettings = {
					steps: 2,
					amount: 150,
					bevelEnabled: true,
					bevelThickness: 1,
					bevelSize: 1,
					bevelSegments: 5
				};

				var geometry = new THREE.ExtrudeGeometry( circleShape, extrudeSettings );
				var material = new THREE.MeshBasicMaterial( { color: 0xf44242, opacity: .8, transparent: true } );
				var mesh = new THREE.Mesh( geometry, material ) ;
				mesh.position.set(startPt[i].x, startPt[i].y, startPt[i].z);
				geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, -150) );
				scene.add( mesh );
				mesh.lookAt(tfPos);
				lines.push(mesh);
		             
		        this.animateBlast(mesh, i, blast, endPos);
			}
			
		},
		

		animateBlast : function(mesh, i, blast, tfPos){
			//console.log("blast animated");
			//var bVec = tfObj.position;
			var t = TweenLite.to( mesh.position , blast, {x: tfPos.x, y:tfPos.y, z: tfPos.z, ease: Power0.easeNone }).play()
			//t.updateTo({x:bVec.x, y:bVec.y, z:bVec.z}, false);
	        TweenLite.to(mesh.scale , .1 , {x: mesh.scale.x, y: mesh.scale.y, z:.01, delay:blast,ease: Power0.easeNone, onComplete: function(){
	        	if(i == 3){
	        		explosion(endPos);
	        	}
	        }}).play();
		}
	}
}());