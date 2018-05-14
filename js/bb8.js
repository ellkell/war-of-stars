var BB = (function(){

	
	var clock = new THREE.Clock();

	function toRad(deg){
		return (deg * Math.PI)/180;
	}

	function centerPivot(obj){
		obj.geometry.computeBoundingBox();

		var boundingBox = obj.geometry.boundingBox;

		var position = new THREE.Vector3();
		position.subVectors( boundingBox.max, boundingBox.min );
		position.multiplyScalar( 0.5 );
		position.add( boundingBox.min );

		position.applyMatrix4( obj.matrixWorld );

	}
	return {
		initBB: function(){
			bb8Super.scale.set(8,8,8);
			scene.add(bb8Super);			
			bb8Super.rotation.set(0,Math.PI/2,0);
			bb8Super.position.set (0,-13, 80);

		},
		animate: function(){
			var bbHead = scene.getObjectByName('bb8Head');
			var bbBody = scene.getObjectByName('bb8Body');
			
			var animOscY = function(obj, timing, amt){
				//console.log("AmtY: "+amt);
				TweenLite.to(obj.rotation, timing, {directionalRotation:{y:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
						
						TweenLite.to(obj.rotation, timing*2, {directionalRotation:{y:"-="+(amt*2)+"_ccw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
								
								TweenLite.to(obj.rotation, timing, {directionalRotation:{y:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut})
					}})
				}});
			};
			var animOscZ = function(obj, timing, amt){
				//console.log("AmtZ: "+amt);
				TweenLite.to(obj.rotation, timing, {directionalRotation:{z:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
						
						TweenLite.to(obj.rotation, timing*2, {directionalRotation:{z:"-="+(amt*2)+"_ccw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
								
								TweenLite.to(obj.rotation, timing, {directionalRotation:{z:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut})
					}})
				}});
			};
			var animOscX = function(obj, timing, amt){
				//console.log("AmtX: "+amt);
				TweenLite.to(obj.rotation, timing, {directionalRotation:{x:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
						
						TweenLite.to(obj.rotation, timing*2, {directionalRotation:{x:"-="+(amt*2)+"_ccw", useRadians: true}, ease:Power1.easeInOut, onComplete: function(){
								
								TweenLite.to(obj.rotation, timing, {directionalRotation:{x:"+="+amt+"_cw", useRadians: true}, ease:Power1.easeInOut})
					}})
				}});
			};
			animOscY(bbHead, .2, getRandomInt(.2,.8));
			animOscZ(bb8Super, .7,.1);	
		}
	}
}());
