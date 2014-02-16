function loop(){
$("#day_div").delay(1000).fadeOut(5000).delay(1000).fadeIn(5000, function() {
		loop();
		});
}

//OCANVAS INSTANTIATION
var canvas = oCanvas.create({
	canvas: "#canvas",
	fps: 60
});

//MAIN MENU

// GLOBAL CONSTANTS
var ourCar,collFlag=false;
var isPosReady=0;
var dur=3000,jumptest=0,move;
var star,isStar=0;
var lives=3;
var score=0;
var started=0;
//GLOBAL LISTS

var badCar=new Array();
var randomPos=[0,0,0];
var laneArray = new Array(3);
var buildArray = new Array(3);
var laneVariables = {"laneSpeed": 50, "lanedy": 5, "laney": 120};
var lanePos = [120, 120 - 90, 120 - 180, 120 - 270];

//HELPER FUNCTIONS
Math.easeInQuint = function(t,b,c,d){
		t /=d;
		return c*t*t*t*t*t+b
}


function getRandomPos(){
	for(var i=0;i<=2;i++)
	{
     randomPos[i]=Math.floor((Math.random()*2));
	}
    isPosReady=1;
}

//INITIALISERS

function initCar(canvas){
	ourCar = canvas.display.image({
		x: 359.5,
		y: 350,
		origin: { x: "center", y: "center" },
		image: "car0.png",
		ourSpeed : 0,
		currLane:1,
		});
	canvas.addChild(ourCar);
	//alert('added');

}

function initTraffic(canvas){	
	//Fix for multiple calls to initTraffic////////////		
	isPosReady=0; 
	//////////////////////
	if(badCar.length>12)
	  badCar.shift();
	var ddx=-350;

	for(i=0;i<badCar.length;i++)
	{
		if(badCar[i].y<120+50)
			return;
	}
	for(i=0;i<3;i++)
	{
	if(randomPos[i]!=0)
	{
		tempCar=getCar(i,ddx);
		tempCar.animate({
			x: tempCar.x+tempCar.dx,
			y: tempCar.y+tempCar.dy,
			width: tempCar.width+310,
			height:	tempCar.height+200
			},
			{
			easing: "ease-in-quint",
			duration: dur,
			callback:function(){
				canvas.removeChild(badCar.shift());
				}
			}
		);
		canvas.addChild(tempCar);
		badCar.push(tempCar);		
	}	
	ddx+=350;
	}

	canvas.removeChild(ourCar);
	canvas.addChild(ourCar);


}

function initBuilding(canvas){

		var build1 = canvas.display.image({
			x: 359.5,
			y: lanePos[0],
			width: 1.0,
			height: 1.0,
			origin: { x: "center", y: "center" },
			image: "built.png",});

		for(i=0;i<4;i++){
			buildArray[i] = build1.clone({});
			canvas.addChild(buildArray[i]);
		}
}


function initLanes(canvas){
		var lane1 = canvas.display.image({
			x: 359.5,
			y: lanePos[0],
			width: 1.0,
			height: 1.0,
			origin: { x: "center", y: "center" },
			image: "laner2.png",
		});
		for(i=0;i<4;i++){
			laneArray[i] =  lane1.clone({
					y:lanePos[i],
					});
			canvas.addChild(laneArray[i]);
		}
}



//SPRITE GENERATORS
function getCar(currentLane, diffX){
    var carNum=parseInt(Math.random()*5)+1;
    var x = canvas.display.image({
	x: 359.5,
	y: 120,
	origin: { x: "center", y: "center" },
	image: "car"+carNum+".png",
	height: 1.0,
	width: 2.05,
	dx:diffX,
	dy:500,
	currLane:currentLane,
   });
   return x;
   }


function getStar(){
	return canvas.display.image({
	  x:-100,
	  y:-100,
	  origin: { x: "center", y: "center" },
	  image: "splash.png",
	  width:100,
	  height:100,

  	});
  }

   
//GAME LOOP FUNCTIONS
function moveLanes(){
	laneVariables.lanedy=6-dur/1000;
	if(started)
		score+=laneVariables.lanedy;
	for(var i=0;i<4;i++){
		if(lanePos[i]>500){
			lanePos[i]=120;
		}
	
		lanePos[i] += laneVariables.lanedy;
		quintedPos = Math.easeInQuint(lanePos[i],120,350,500);///Change to ('','','',dur);
	
		laneArray[i].x= 359.5;
		laneArray[i].y= quintedPos;
		laneArray[i].width= (quintedPos-120)/(440-120)*316.5+1;
		laneArray[i].height= ((quintedPos-120)/(440-120)*224)+1;
}
	
}
function moveBuilding(){
	laneVariables.laney+=laneVariables.lanedy
	for(var i=0;i<4;i++){
		if(lanePos[i]>500){
			lanePos[i]=120;
		}
	
		lanePos[i] += laneVariables.lanedy;
		quintedPos = Math.easeInQuint(lanePos[i],120,270,500);///Change to ('','','',dur);
		buildArray[i].x= 359-((quintedPos-120)/(440-120)*520);
		buildArray[i].y= quintedPos;
		buildArray[i].width= (quintedPos-120)/(440-120)*388+1;
		buildArray[i].height= ((quintedPos-120)/(440-120)*484)+1;
	}


}

//COLLISION HANDLERS 
function checkCollision()
{	var ourCary=ourCar.y;
	var badCary=0;
	var badCarDx=0
	//var flag=0;
	for(i=0;i<badCar.length;i++)
		{
			badCarDx=badCar[i].dx;

			if(badCar[i].currLane==ourCar.currLane)
			{
				if(Math.abs(ourCary-badCar[i].y)<75 && jumptest==0)
					{
						collFlag=true;
						if(badCar[i].y>ourCary-50)
						{
							badCar[i].width=100;
							badCar[i].height=65;
							badCar[i].y=350-75;
							if(badCar[i].dx!=0)
								badCar[i].x=359.5+105*(badCarDx/Math.abs(badCarDx));

						}
						if(isStar==0)
						{
						star=getStar();isStar=1;
						star.x=badCar[i].x;
						star.y=badCar[i].y;
						canvas.addChild(star);
						}
						break;
					}

						
			}
				
		}
	if(collFlag)
	{
		 onCollision();
	}
}

function checkSideCollision(){
	for(i=0;i<badCar.length;i++)
	{
		
		 if(Math.abs(ourCar.y-badCar[i].y)<75 && Math.abs(ourCar.x+140*move-badCar[i].x)<50)
		{
			  /*star.x=(ourcar.x+img1.x)/2;
	          star.y=(ourcar.y+img1.y)/2
			  isStar=1;*/
			  dur=5000;
			  move=0;
			  if(isStar==0)
			  {
			  	  score-=200;
				  star=getStar();isStar=1;
				  star.x=(badCar[i].x+ourCar.x)/2;
				  star.y=(badCar[i].y+ourCar.y)/2;
				  canvas.addChild(star);
			  }
			  return;
		}
	}
}

function onCollision(){
		lives-=1;
		var dur1=dur;
		score-=1000;
		dur=5000;
		for(j=0;j<badCar.length;j++)
		{
			if(badCar[j].y<425)
			{
				badCar[j].stop().animate({y: 120,
							  x: 359.5,
							  width: 2.05,
							  height: 1.0},
							  {
							easing: "ease-out-quint",
							duration:dur1*(badCar[j].y/380.0),
							callback:function(){
									canvas.removeChild(this);
									badCar.splice(this,1);
									if(badCar.length==0)
									{
										//dur=4000;
										collFlag=false;
									}
								}
							}
						);
			}
			
			
		}
			
}

function gameOver(){
	canvas.timeline.stop();
	//fbapi.sendScore(score,2);
	//fbapi.getHighScores(score,2);
	
	var scoreDisplay = canvas.display.image({
			x: 0,
			y: 0,
			width: 530,
			height: 320,
			image: "scoreboard.png",
	});

	scoreDisplay.x=canvas.width/2 - scoreDisplay.width/2;
	scoreDisplay.y=canvas.height/2 - scoreDisplay.height/2;

	var title = canvas.display.text({
		x: 100,
		y: 50,
		font: "bold 25px sans-serif",
		origin:{x:"center", y:"center"},
		text: "Your Score is "+Math.floor(score),
		fill: "#ffffff"
	});
	var scoreNames = canvas.display.text({
		x: 100,
		y: 100,
		font: "bold 25px sans-serif",
		text: "",
		fill: "#ffffff"
	});

	title.x = canvas.width/2 - title.width/2;

	var scoreVals = canvas.display.text({
		x: 250,
		y: 100,
		font: "bold 25px sans-serif",
		text: "",
		fill: "#ffffff"
	});

	var highScores = {
		"Jude":30,
		"Jaz":50,
		"Dev":50,
		"Sid":30,
		"Deepak":50,
	}
	for(var key in highScores){
		scoreNames.text+=key+"\n";
		scoreVals.text+=":      "+highScores[key]+"\n";
	}

	canvas.addChild(scoreDisplay);
	scoreDisplay.addChild(scoreNames);
	scoreDisplay.addChild(scoreVals);
	scoreDisplay.addChild(title);
}

//MAIN GAME LOOP
canvas.setLoop(function(){
	scores.text="Score : "+Math.floor(score);
	if(lives==0){
        canvas.removeChild(scores);
        if(score<0){score=0;}
		gameOver();
	}
	moveLanes();
	moveBuilding();
	if(isStar==4)
	{
	 isStar=0;
	 canvas.removeChild(star);
	 }
	 else if(isStar>0 && isStar<4)
	 isStar++;

	 
	if(!collFlag){
		if(isPosReady){
			initTraffic(canvas);
			}
		checkCollision();
	}
}).start();



//ONE TIME FUNCTIONS
var scores = canvas.display.text({
	x: 75,
	y: 25,
	origin: { x: "center", y: "center" },
	width: 75,
	height: 30,
	font: "bold 20px sans-serif",
	text: "Score : 0",
	fill: "#000000"
});
canvas.addChild(scores)
initLanes(canvas);
initBuilding(canvas);
initCar(canvas);


//MAIN MENU
var mainMenuBg = canvas.display.image({
			x: 0,
			y: 0,
			width: 650,
			height: 420,
			image: "frontboard.png",
			opacity: 0.0
	});
mainMenuBg.x = canvas.width/2 - mainMenuBg.width/2;
mainMenuBg.y = canvas.height/2 - mainMenuBg.height/2;

canvas.addChild(mainMenuBg);
var text = canvas.display.text({
	x: 350,
	y: 230,
	origin: { x: "center", y: "center" },
	font: "bold 40px sans-serif",
	text: "Press Up key to accelerate,\nDown key to deaccelerate,\nSpace to jump and Side keys\n to switch between the lines.",
	fill: "#ffffff"
});
var button = canvas.display.image({
	x: 0,
	y: 0,
	
	width: 719,
	height: 478,
	image: "trans.png",
});

var text1 = canvas.display.text({
	x: 359.5,
	y: 180,
       origin: { x: "center", y: "center" },
	width: 75,
	height: 30,
	font: "bold 50px sans-serif",
	text: "START",
	fill: "#ffffff"
});
var text2 = canvas.display.text({
	x: 359.5,
	y: 230,
	origin: { x: "center", y: "center" },
	width: 75,
	height: 30,
	font: "bold 50px sans-serif",
	text: "INSTRUCTIONS",
	fill: "#ffffff"
});
var text3 = canvas.display.text({
	x: 359.5,
	y: 280,
	origin: { x: "center", y: "center" },
	width: 75,
	height: 30,
	font: "bold 50px sans-serif",
	text: "HIGH SCORES",
	fill: "#ffffff"
});

canvas.addChild(text1);
canvas.addChild(text2);
canvas.addChild(text3);
text1.bind("click tap", function () {
	canvas.removeChild(text1);
	canvas.removeChild(text2);
	canvas.removeChild(text3);
	setInterval(getRandomPos,dur/3);
	//fbapi.gameStarted(2);

	started=1;
	loop();
});
text2.bind("click tap", function () {
	canvas.addChild(button);
	canvas.removeChild(text1);
	canvas.removeChild(text2);
	canvas.removeChild(text3);
	button.addChild(text);
});


text3.bind("click tap", function () { 
	console.log("there");
});

button.bind("click tap", function () { 
	canvas.addChild(text1);
	canvas.addChild(text2);
	canvas.addChild(text3);
	canvas.removeChild(button);
});


//KEY BIND FUNCTIONS
canvas.bind("keydown", function (e) {
	if(jumptest==0){
	    
		var keys = e.keyCode;
			
		if (keys==32){
			jumptest=1;
			var d;
			if(dur>3000)
			  d=300;
			else if(dur<2000)
			 d=200;
			else
			 d=dur/10;
										
			ourCar.animate({ y: ourCar.y-170}, {duration: d,callback:function(){
			ourCar.animate({ y: ourCar.y+170} ,{easing: "ease-in-sine",duration: d,callback:function(){
				jumptest=0;
					
				}});
			}});}
}});
 canvas.bind("keypress", function (e) {
	if(jumptest==0){
	    
		var keys = e.keyCode;
			
		
		if (keys==39 && ourCar.x<440){

			move=1;
			checkSideCollision();
			if(move!=0){
				jumptest=1;
				ourCar.animate({rotation: 45,x: ourCar.x+120}, {duration: 50, callback:function(){
					ourCar.animate({rotation:0,
								x:ourCar.x+40}, 
								{duration: 20,
								callback:function(){
									jumptest=0;
									move=0;
									if(ourCar.x==359.5)
										ourCar.currLane=1;
									else if(ourCar.x>359.5)
										ourCar.currLane=2;
									else
										ourCar.currLane=0;
								}}
					);
				}});
			}
				
		}	
		else if(keys==37 && ourCar.x>220){
			move=-1;
			checkSideCollision();
			if(move!=0){
				jumptest=1;
				ourCar.animate({rotation: -45,x: ourCar.x-120}, {duration: 50, callback:function(){
					ourCar.animate({
						rotation: 0,
						x: ourCar.x-40}, 
						{duration: 20,
						callback:function(){
							jumptest=0;
							move=0;
							if(ourCar.x==359.5)
								ourCar.currLane=1;
							else if(ourCar.x>359.5)
								ourCar.currLane=2;
							else
								ourCar.currLane=0;
						}}
					);
				}});
			}
				
		}
	else if(keys==38){
			if(!collFlag)
			{
				if(dur>1000) 
					dur-=10;
			}
			}
	else if(keys==40){
				if(!collFlag)
			{
				if(dur<5000)
					dur+=10;
			}
				

	}
	}
});
