var TieFighter = (function (){
	var wobbleTimer = false;
	var ePos = 0;
	var currentName = "tie";
	var firstTie = true;
	var firstDummy = true;
	var startPos = { x:0, y: 1000 , z:1000};
	var wobbleTween, randWobble;
	var aOPos = 0;

	var makeTie = function(px, py, pz){
		
		var tieTie = new THREE.Object3D();
		
		tieTie.position.set( px, py, pz );
		
		var rad = 900;

		tfighterModel.material.opacity = 1;

		tieTie.add(tfighterModel.clone());
		
		var hitbox = new THREE.Mesh(
				new THREE.IcosahedronBufferGeometry((rad + 10), 2),
				new THREE.MeshBasicMaterial({
					color: 0xffffff,
					visible: false,
					wireframe: false,
				})
			);
		hitbox.name = 'hitbox';
		
		tieTie.add(hitbox);
		return tieTie;

	}
	var loadTieAudio = function( mesh ) {
		
		console.log(aOPos);
		console.log(audioArray);
		audioArray[aOPos].play();
		mesh.add(audioArray[aOPos]);

		(aOPos >= 5)? aOPos = 0 : aOPos++ ;

	}
	var wobble = function(obj){
		var pos = 0;

		wobbleTween = TweenLite.to(obj.position, 2, { 
			x: getRandomInt(-800, 800),
			y: getRandomInt(0, 1000),
			z: (obj.position.z + getRandomInt(-100, 100)),
			ease: Power3.easeInOut,
			onComplete: function(){
					
			}
		});

		wobbleTimer = window.setInterval(handleInterval, 3000);

		function handleInterval(){
			if (pos < 3) {
				wobbleTween = TweenLite.to(obj.position, 2.8, { 
					x: getRandomInt(-800, 800),
					y: getRandomInt(0, 1000),
					z: (obj.position.z + getRandomInt(-100, 100)),
					ease: Power3.easeInOut
				});
				pos++;
			}else{
				wobbleTween.kill();
				clearInterval(wobbleTimer);
				handleEvents(false);
				enableLock = false;
				var retical = document.getElementById('retical');
				if(retical){retical.style.opacity = 0};

				var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
				var target = { x : 10000 * plusOrMinus, z : obj.position.z*2 }
				TweenLite.to(obj.position, 2, { 
					x: target.x,
					z: target.z,
					ease: Power1.easeInOut,
					//delay:.3
				});
				TweenLite.to(arrows, .3, {width:"100vw", opacity:.3});

				TweenLite.to(obj.scale, 1.5, { 
					x: .1,
					y: .1,
					z: .1,
					ease: Power1.easeInOut,
					onComplete: function(){
						TieFighter.killEnemy(obj);
					}
				});

				var vec = new THREE.Vector3( target.x , obj.rotation.y, target.z );
				var startRotation = new THREE.Euler().copy( obj.rotation );
				var dummy = new THREE.Object3D;
				dummy.rotation.copy(obj.rotation);
				dummy.position.copy(obj.position);
				dummy.lookAt( vec );
				var endRotation = new THREE.Euler().copy( dummy.rotation );
				TweenLite.to(obj.rotation, .8, {
					directionalRotation:{y:"+="+endRotation.y+"_short", useRadians: true}, 
					ease:Power1.easeInOut
				});
			}

		}

	}
	var makeDummy = function(tVec){
		var dummy, objDum; 
		if(firstDummy) {
			firstDummy = false;
			dummy = new THREE.Object3D();
			dummy.position.set(tVec.x, tVec.y, tVec.z);
			dummy.name = 'dummy';
			dummy.add(tfighterModel.clone());
			scene.add(dummy);
			objDum = scene.getObjectByName('dummy');
		}else{
			objDum = scene.getObjectByName('dummy');
			objDum.position.set(tVec.x, tVec.y, tVec.z);
			//objDum.children[0].material.opacity = 1;
		}
		
		//console.log(obj);
		TweenLite.to(objDum.children[0].material, .3, { 
				opacity: 0, delay: .3,
				ease: Power3.easeInOut,
				onComplete: function(){
					/*scene.remove(obj);
					while ( obj != undefined ) {
					    scene.remove( obj );
					    obj = scene.getObjectByName( obj.name );
					}*/
				}
		});
	}

	var createHotspot = function( name ) {
	    var div = document.createElement('div');
	    div.id = name;
	    div.style.position = 'absolute';

	    var _this = this;
	    
	    return {
	      element: div,
	      parent: false,
	      position: new THREE.Vector3(0,0,0),

	      setHTML: function(html) {
	        this.element.innerHTML = html;
	      },
	      setParent: function(threejsobj) {
	        this.parent = threejsobj;
	      },
	      updatePosition: function() {
	        if(parent) {
	          this.position.copy(this.parent.position);
	          this.position.x += 3;
	          this.position.y += 3;
	        }
	        var coords2d = this.get2DCoords(this.position, _this.camera);
	        this.element.style.left = coords2d.x + 'px';
	        this.element.style.top = coords2d.y + 'px';
	      },
	      get2DCoords: function(position, camera) {

	        var vector = position.project(camera);
	        vector.x = (vector.x + 1)/2 * window.innerWidth;
	        vector.y = -(vector.y - 1)/2 * window.innerHeight;
	        return vector;
	      }
	    };
	}

	var createRetical = function(){
	
		var div = document.createElement( 'div' );
		div.id = "retical";
		return div;
	}
	
	return {

		addEnemy : function(){
			if (eCount++ < 7){
				if(orderPre[aPos]<20){
					BB.animate();
					AudioSFX.fightSoundPre(orderPre[aPos]);
				}
				enableLock = false;
				
				var startVec = new THREE.Vector3(startPos.x, startPos.y, startPos.z);
				
				if(firstTie){

					firstTie = false;
					var tFInstance = makeTie(startPos.x, startPos.y, startPos.z+200);
					tFInstance.name = "tie"+ePos;
					currentName = tFInstance.name;
					tFInstance.children[0].material.opacity = 1;
					tFInstance.lookAt(startVec);
					scene.add(tFInstance);
					var tFInstance = scene.getObjectByName( currentName );
					var center = function(obj) {
						var children = obj.children,
						completeBoundingBox = new THREE.Box3();
						for(var i = 0, j = children.length; i < j; i++) {
							if(children[i].geometry){
								children[i].geometry.computeBoundingBox();
								var box = children[i].geometry.boundingBox.clone();
								box.translate(children[i].position);
								completeBoundingBox.set(box.max, box.min);
							}
						}
						var objectCenter = completeBoundingBox.getCenter()
						obj.position.x -= objectCenter.x;
						obj.position.y -= objectCenter.y;
						obj.position.z -= objectCenter.z;
					}
					center(tFInstance);

				}else if (!firstTie){
					var tFInstance = scene.getObjectByName( currentName );
					tFInstance.name = "tie"+ePos;
					currentName = tFInstance.name;
					tFInstance.position.set(startPos.x, startPos.y, startPos.z+200);
					tFInstance.scale.set(1,1,1);
					tFInstance.lookAt(startVec);
					tFInstance.visible = true;
				}

				var tieFighter = scene.getObjectByName( currentName );
				ePos++;

				TieFighter.initHotspot( currentName , "tie" );

				

				//initial fly-in

				loadTieAudio(tieFighter);
				TweenLite.to(tieFighter.position, 3, { 
					x: getRandomInt(-500, 500),
					z: -2000,
					y: getRandomInt(0, 1000), 
					ease: Power2.easeOut,
					onComplete: handleComplete
				});

				function handleComplete(){

					enableLock = true;
					var retical = document.getElementById('retical');
					if(retical){retical.style.opacity = .5;};
					
					wobble(tieFighter);
				}
			}else{
				window.setTimeout(function(){AudioSFX.endFight(true)},2000);
				battleEnd = true;
				console.log('end game');
			}
			
		},

		initHotspot: function( parent, string, bool ){
			h++;
			var name = (!string) ? "hotspot"+ h : string;
		  /*for (var i = 0; i < array.length; i++){*/

		    var obj = scene.getObjectByName( parent );

		    var labelObj = new THREE.Object3D();
		    
		    labelObj.position.set(obj.position.x , obj.position.y, obj.position.z);

		    var text = createHotspot( name );
		        text.setParent( obj );
		        //text.setHTML( self.content );

		    if (!bool){
		    	hotspotWrap.appendChild(text.element);
		    	var div = createRetical();
		    	document.getElementById( 'tie' ).appendChild( div );
				var bGeom = new THREE.SphereGeometry(10, 10,10);
			    var bMat = new THREE.MeshBasicMaterial({
			       transparent: true,
			       opacity:0,
			       visible : true,
			       side: THREE.DoubleSide,
			       color: 0x000000
			    });
			    var bound = new THREE.Mesh(bGeom, bMat);
			        bound.scale.set(0.1, 0.1, 0.1);
			        //boundObj.push( bound );

			    labelObj.add( bound );
			    //var geomBB = {w: 30, h: 4};

			    //textlabels.push({t: text});
			    var tObj = scene.getObjectByName(currentName);
			    tObj.add( labelObj );
		    }else{
				var htmlElement = document.getElementById( bool );
		    	// `element` is the element you want to wrap
				var parent = htmlElement.parentNode;
				var wrapper = text.element;

				// set the wrapper as child (instead of the element)
				parent.replaceChild(wrapper, htmlElement);
				// set element as child of wrapper
				wrapper.appendChild(htmlElement);
			}

		    hotspots.push(text);
		},


		checkLockOn : function(){
			var retical = document.getElementById('retical');
			var retParent = document.getElementById('tie');
			var arrows = document.getElementById('arrows');
			var hud = document.getElementById('hud');


			hudSize = { h:parseInt((window.getComputedStyle(hud, null)).height), w: parseInt(window.getComputedStyle(hud, null).width) };
			hudPos = {t: window.innerHeight/4, l:(((window.innerWidth)/4)*3)/2};

			
			if(retical && enableLock){
				var retPos = {t: parseInt(window.getComputedStyle(retParent, null).top), l: parseInt(window.getComputedStyle(retParent, null).left)};

			   	if( retPos.t > hudPos.t  && retPos.t < hudPos.t + hudSize.h  &&
			   		retPos.l > hudPos.l  && retPos.l < hudPos.l + hudSize.w  ){
					handleEvents(true);
					
					retical.style.opacity = 1;				
					TweenLite.to(arrows, .3, {width:"70vw", opacity:1, onComplete: function(){
						//AudioSFX.lockOn();
					}});
					

				}else{
					handleEvents(false);

					retical.style.opacity = .3;
					TweenLite.to(arrows, .3, {width:"100vw", opacity:.3});
				}
			}
		},

		checkWin: function(threshold, bam){
			var cam = camera.getWorldDirection();
			if    ((isTap.x >= (cam.x - threshold) || isTap <= (cam.x + threshold)) 
				&& (isTap.y >= (cam.y - threshold) || isTap <= (cam.y + threshold)) 
				&& (isTap.z >= (cam.z - threshold) || isTap <= (cam.z + threshold))) {
				
				var tieFighter = scene.getObjectByName( currentName );

				raycaster.setFromCamera( mouseVector.clone(), camera );

				var intersects = raycaster.intersectObjects( tieFighter.children );

				if (intersects.length > 0) {
					clearInterval(wobbleTimer);
					wobbleTimer = null;

					var target = intersects[0].object;
					var tVec = tieFighter.position.clone();
					WeaponsFire.laserBlast(.3, tVec);
					//controls.enabled = false;
					handleEvents(false);
					console.log("BAM dead");

					BB.animate();
					AudioSFX.fightSoundPost(orderPost[aPos]);
					wobbleTween.kill();
					this.killEnemy( tieFighter );
					//makeDummy(tVec);

				}else{
					if(document.getElementById('param1')){document.getElementById('param1').innerHTML = 
					"tap: "+ isTap.x+" "+isTap.y;
				};
					console.log("no hit");
					//controls.enabled = true;
				}
			}
		},

		killEnemy : function(){
			//clearInterval(timer);
			var objKill = scene.getObjectByName(currentName);
			//objKill.parent.remove( objKill );
			TweenLite.to(objKill.children[0].material, .3, { 
				opacity: 1, delay: .3,
				ease: Power3.easeInOut,
				onComplete: function(){
					objKill.position.set(startPos.x, startPos.y, startPos.z + 200);
					//console.log(scene.getObjectByName(currentName), objKill);
					window.setTimeout(function(){TieFighter.addEnemy()}, 3000);
				}
			});
			
			enableLock = false;
			document.getElementById('tie').remove();
			TweenLite.to(arrows, .3, {width:"100vw", opacity:.3});
			aPos++;
		}
	}

}());



