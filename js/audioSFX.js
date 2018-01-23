var audioProgress = 0;
var aPos = 0;
var orderPost = [];
var orderPre = [];
var ambient;
var battleEnd = false;

var AudioSFX = (function (){
		
	var sounds = {
		sfx:{
			explosions:[
				{id:"explo1", src:"media/audio/sfx/Explo_01.mp3"},
				{id:"explo2", src:"media/audio/sfx/Explo_02.mp3"},
				{id:"explo3", src:"media/audio/sfx/Explo_03.mp3"},
				{id:"explo4", src:"media/audio/sfx/Explo_04.mp3"},
				{id:"explo5", src:"media/audio/sfx/Explo_05.mp3"},
				{id:"explo6", src:"media/audio/sfx/Explo_06.mp3"}
			],
			lasers:[
				{id:"laser1", src:"media/audio/sfx/Laser_01.mp3"},
				{id:"laser2", src:"media/audio/sfx/Laser_02.mp3"},
				{id:"laser3", src:"media/audio/sfx/Laser_03.mp3"},
				{id:"laser4", src:"media/audio/sfx/Laser_04.mp3"},
				{id:"laser5", src:"media/audio/sfx/Laser_05.mp3"},
				{id:"laser6", src:"media/audio/sfx/Laser_06.mp3"}
			],
			tie:[
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_01.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_02.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_03.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_04.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_05.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_06.mp3"},
			],
			ambient:[
				{id:"ambLP", src:"media/audio/sfx/AMB_LP.mp3"}
			],
			music:[
				{id:"battleIntro", src:"media/audio/music/Battle_Intro96.mp3"},
				{id:"battleLp", src:"media/audio/music/Battle_Lp96.mp3"},
				{id:"battleOutro", src:"media/audio/music/Battle_Outro96.mp3"},
				{id:"introLoad", src:"media/audio/music/Intro_LoadScreen96.mp3"},
				{id:"introPlay", src:"media/audio/music/Intro_Play96.mp3"},
				{id:"outro", src:"media/audio/music/Outro96.mp3"},
			],
		},
		
		intro:{
			poe:[
			 	{id:"poeIntro1", src:"media/audio/poe/Intro_01.mp3"},
				{id:"poeIntro2", src:"media/audio/poe/Intro_02.mp3"},
				{id:"poeIntro3", src:"media/audio/poe/Intro_03.mp3"}
			],
			
			bb8: {id:"bb8Intro1", src:"media/audio/bb8/Intro_01.mp3"},
			
			base:[
				{id:"baseIntro1", src:"media/audio/base/Intro_01.mp3"},
				{id:"baseIntro2", src:"media/audio/base/Intro_02.mp3"}
			]
		},
		fight: {
			poe:[
				{id:"poeFight1", src:"media/audio/poe/Fight_01.mp3"},
				{id:"poeFight2", src:"media/audio/poe/Fight_02.mp3"},
				{id:"poeFight3", src:"media/audio/poe/Fight_03.mp3"},
				{id:"poeFight4", src:"media/audio/poe/Fight_04.mp3"},
				{id:"poeFight5", src:"media/audio/poe/Fight_05.mp3"},
				{id:"poeFight6", src:"media/audio/poe/Fight_06.mp3"},
				{id:"poeFight7", src:"media/audio/poe/Fight_07.mp3"},
				{id:"poeFight8", src:"media/audio/poe/Fight_08.mp3"},
				{id:"poeFight9", src:"media/audio/poe/Fight_09.mp3"},
				{id:"poeFight10", src:"media/audio/poe/Fight_10.mp3"},
				{id:"poeFight11", src:"media/audio/poe/Fight_11.mp3"},
				{id:"poeFight12", src:"media/audio/poe/Fight_12.mp3"},
				{id:"poeFight13", src:"media/audio/poe/Fight_13.mp3"}
			],
			bb8:[
				{id:"bb8Fight1", src:"media/audio/bb8/Fight_01.mp3"},
				{id:"bb8Fight2", src:"media/audio/bb8/Fight_02.mp3"},
				{id:"bb8Fight3", src:"media/audio/bb8/Fight_03.mp3"},
				{id:"bb8Fight4", src:"media/audio/bb8/Fight_04.mp3"},
				{id:"bb8Fight5", src:"media/audio/bb8/Fight_05.mp3"},
				{id:"bb8Fight6", src:"media/audio/bb8/Fight_06.mp3"},
				{id:"bb8Fight7", src:"media/audio/bb8/Fight_07.mp3"},
				{id:"bb8Fight8", src:"media/audio/bb8/Fight_08.mp3"},
				{id:"bb8Fight9", src:"media/audio/bb8/Fight_09.mp3"},
				{id:"bb8Fight10", src:"media/audio/bb8/Fight_10.mp3"},
				{id:"bb8Fight11", src:"media/audio/bb8/Fight_11.mp3"},
				{id:"bb8Fight12", src:"media/audio/bb8/Fight_12.mp3"},
				{id:"bb8Fight13", src:"media/audio/bb8/Fight_13.mp3"},
			]
		},
		win:[
		 	{id:"poeWin", src:"media/audio/poe/FightWin.mp3"},
		 	{id:"baseWin", src:"media/audio/base/FightWin.mp3"}
		],
		lose:[
			{id:"poeLose", src:"media/audio/poe/FightLose.mp3"},
			{id:"baseLose", src:"media/audio/base/FightLose.mp3"}
		]
	};

	var getRandomInt = function(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return {

		loadSound : function () {
			var queue = new createjs.LoadQueue();
			createjs.Sound.alternateExtensions = ["mp3"];
			queue.installPlugin(createjs.Sound);
			//queue.addEventListener("complete", audioLoaded);
			queue.on("progress", function(){
				audioProgress = Math.floor(queue.progress*100);
				//console.log(audioProgress + '%');
			});
			queue.loadManifest([
				{id:"poeIntro1", src:"media/audio/poe/Intro_01.mp3"},
				{id:"poeIntro2", src:"media/audio/poe/Intro_02.mp3"},
				{id:"poeIntro3", src:"media/audio/poe/Intro_03.mp3"},

				{id:"bb8Intro1", src:"media/audio/bb8/Intro_01.mp3"},

				{id:"baseIntro1", src:"media/audio/base/Intro_01.mp3"},
				{id:"baseIntro2", src:"media/audio/base/Intro_02.mp3"},
				
				{id:"poeFight1", src:"media/audio/poe/Fight_01.mp3"},
				{id:"poeFight2", src:"media/audio/poe/Fight_02.mp3"},
				{id:"poeFight3", src:"media/audio/poe/Fight_03.mp3"},
				{id:"poeFight4", src:"media/audio/poe/Fight_04.mp3"},
				{id:"poeFight5", src:"media/audio/poe/Fight_05.mp3"},
				{id:"poeFight6", src:"media/audio/poe/Fight_06.mp3"},
				{id:"poeFight7", src:"media/audio/poe/Fight_07.mp3"},
				{id:"poeFight8", src:"media/audio/poe/Fight_08.mp3"},
				{id:"poeFight9", src:"media/audio/poe/Fight_09.mp3"},
				{id:"poeFight10", src:"media/audio/poe/Fight_10.mp3"},
				{id:"poeFight11", src:"media/audio/poe/Fight_11.mp3"},
				{id:"poeFight12", src:"media/audio/poe/Fight_12.mp3"},
				{id:"poeFight13", src:"media/audio/poe/Fight_13.mp3"},
				
				{id:"bb8Fight1", src:"media/audio/bb8/Fight_01.mp3"},
				{id:"bb8Fight2", src:"media/audio/bb8/Fight_02.mp3"},
				{id:"bb8Fight3", src:"media/audio/bb8/Fight_03.mp3"},
				{id:"bb8Fight4", src:"media/audio/bb8/Fight_04.mp3"},
				{id:"bb8Fight5", src:"media/audio/bb8/Fight_05.mp3"},
				{id:"bb8Fight6", src:"media/audio/bb8/Fight_06.mp3"},
				{id:"bb8Fight7", src:"media/audio/bb8/Fight_07.mp3"},
				{id:"bb8Fight8", src:"media/audio/bb8/Fight_08.mp3"},
				{id:"bb8Fight9", src:"media/audio/bb8/Fight_09.mp3"},
				{id:"bb8Fight10", src:"media/audio/bb8/Fight_10.mp3"},
				{id:"bb8Fight11", src:"media/audio/bb8/Fight_11.mp3"},
				{id:"bb8Fight12", src:"media/audio/bb8/Fight_12.mp3"},
				{id:"bb8Fight13", src:"media/audio/bb8/Fight_13.mp3"},
				
				{id:"poeWin", src:"media/audio/poe/FightWin.mp3"},
		 		
		 		{id:"baseWin", src:"media/audio/base/FightWin.mp3"},

		 		{id:"poeLose", src:"media/audio/poe/FightLose.mp3"},

				{id:"baseLose", src:"media/audio/base/FightLose.mp3"},

				{id:"explo1", src:"media/audio/sfx/Explo_01.mp3"},
				{id:"explo2", src:"media/audio/sfx/Explo_02.mp3"},
				{id:"explo3", src:"media/audio/sfx/Explo_03.mp3"},
				{id:"explo4", src:"media/audio/sfx/Explo_04.mp3"},
				{id:"explo5", src:"media/audio/sfx/Explo_05.mp3"},
				{id:"explo6", src:"media/audio/sfx/Explo_06.mp3"},

				{id:"laser1", src:"media/audio/sfx/Laser_01.mp3"},
				{id:"laser2", src:"media/audio/sfx/Laser_02.mp3"},
				{id:"laser3", src:"media/audio/sfx/Laser_03.mp3"},
				{id:"laser4", src:"media/audio/sfx/Laser_04.mp3"},
				{id:"laser5", src:"media/audio/sfx/Laser_05.mp3"},
				{id:"laser6", src:"media/audio/sfx/Laser_06.mp3"},

				{id:"tie1", src:"media/audio/sfx/TieFighterBy_01.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_02.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_03.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_04.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_05.mp3"},
				{id:"tie1", src:"media/audio/sfx/TieFighterBy_06.mp3"},

				{id:"ambLP", src:"media/audio/sfx/AMB_LP.mp3"},

				{id:"battleIntro", src:"media/audio/music/Battle_Intro96.mp3"},
				{id:"battleLp", src:"media/audio/music/Battle_Lp96.mp3"},
				{id:"battleOutro", src:"media/audio/music/Battle_Outro96.mp3"},
				{id:"introLoad", src:"media/audio/music/Intro_LoadScreen96.mp3"},
				{id:"introPlay", src:"media/audio/music/Intro_Play96.mp3"},
				{id:"outro", src:"media/audio/music/Outro96.mp3"},
				{id:"target", src:"media/audio/sfx/target.mp3"}




			]);
		},


		audioLoaded : function(){
			orderPost = [1,2,3,4,7,8,9,10,12];
			orderPre =[0,5,6,11,99,99];
			orderPost = this.shuffle(orderPost);
			orderPre = this.shuffle(orderPre);
			console.log("pre "+orderPre);
			console.log("post "+orderPost);
			console.log(sounds.intro.base[0].src);
			this.introSound();
			
		},

			
		introSound : function() {
			ambient = createjs.Sound.play("ambLP");
			ambient.loop = -1;
			ambient.volume = .1;

			var introMusic = createjs.Sound.play("introPlay");
			introMusic.on("complete", function () {
				AudioSFX.battleMusic();
				createjs.Sound.play("poeIntro3").on("complete", function(){
					TieFighter.addEnemy(); 
					//console.log('boop');
				},this);
				
			});
			//introMusic.loop = -1;
			introMusic.volume = .5;

			createjs.Sound.play("baseIntro1").on("complete", function () {
				createjs.Sound.play("poeIntro1").on("complete", function(){
					BB.animate();
					createjs.Sound.play("bb8Intro1").on("complete", function(){
						createjs.Sound.play("poeIntro2").on("complete", function(){
							createjs.Sound.play("baseIntro2").on("complete", function(){
								
							},this);
						},this);
					},this);
				},this);
		  	}, this);	
			
		},

		battle : function(){
			if(eCount < 3){
			
			}else{

			}
		},

		fightSoundPre : function (pos) {
			///pos 0,5,6,11 are before, the rest are after
		  	createjs.Sound.play(sounds.fight.bb8[pos].id).on("complete", function () {
				createjs.Sound.play(sounds.fight.poe[pos].id)
		  	}, this);
		  	
		},

		fightSoundPost : function (pos, obj) {
			///pos 0,5,6,11 are before, the rest are after
		  	createjs.Sound.play(sounds.fight.bb8[pos].id).on("complete", function () {
				createjs.Sound.play(sounds.fight.poe[pos].id).on("complete", function () {
					//tieFighter.addEnemy();
		  		}, this);
		  	}, this);
		  	
		},

		endFight : function (bool){
			//window.clearInterval(interval);
			console.log("end battle");
			
			if(bool == true){
				createjs.Sound.play(sounds.win[1].id).on("complete", function(){
					createjs.Sound.play(sounds.win[0].id);
					window.setTimeout(function(){
						var outro = createjs.Sound.play("outro");
						outro.volume = .6;
						ambient.stop();
						window.setTimeout(triggerResolve, 2000);

					}, 8000);
				}, this)
			}else{
				createjs.Sound.play(sounds.lose[1].id).on("complete", function(){
					createjs.Sound.play(sounds.lose[0].id);
				}, this)
			}

		},
		explosion : function (pos){
			var instance = createjs.Sound.play(sounds.sfx.explosions[pos].id);
			instance.volume = 0.5;
			instance.on("complete", function () {
				//createjs.Sound.play(sounds.fight.poe[pos].id)
		  	}, this);
		},
		laser : function (pos){
			var instance = createjs.Sound.play(sounds.sfx.lasers[pos].id);
			instance.volume = 0.5;
			instance.on("complete", function () {
				//createjs.Sound.play(sounds.fight.poe[pos].id)
		  	}, this);
		},
		battleMusic : function(){
			battleVol = .3;
			var instance = createjs.Sound.play("battleIntro");
			instance.volume = battleVol;
			instance.on("complete", function () {
				var instanceLP1 = createjs.Sound.play("battleLp");
				instanceLP1.volume = battleVol;
			}, this);
			window.setTimeout(function(){
				var battleTimer = window.setInterval(function(){
					console.log('boop');
					if(battleEnd){
						var instanceOut = createjs.Sound.play("battleOutro");
						instanceOut.volume = battleVol;
						clearInterval(battleTimer);
					}else{
						var instanceLP = createjs.Sound.play("battleLp");
						instanceLP.volume = battleVol;
					}
				}, 7400);
			},4557);
		},
		lockOn : function(){
			//createjs.Sound.play("target");
		},

		shuffle : function(array) {
		    var i = array.length,
		        j = 0,
		        temp;

		    while (i--) {

		        j = Math.floor(Math.random() * (i+1));

		        // swap randomly chosen element with current element
		        temp = array[i];
		        array[i] = array[j];
		        array[j] = temp;

		    }

		    return array;
		}
		
	}
}());
