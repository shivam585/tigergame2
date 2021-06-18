var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var back,backimage;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("tiger1.png","tiger2.png");
  trex_collided = loadAnimation("killtiger.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("rock.png");
  obstacle2 = loadImage("hunter2.png");
  obstacle3 = loadImage("hunter.png");
  obstacle4 = loadImage("tortise.png");
  obstacle5 = loadImage("pool.png");
  obstacle6 = loadImage("flytrap.png");
  
   restartImg = loadImage("replay.png")
  gameOverImg = loadImage("over.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
backimage=loadImage("forestback.jpg")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
 back=createSprite(width/2,height/2,500,200);
back.addImage(backimage)
back.scale = 1.2;
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-30,700,50);
  ground.visible=false;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/3.5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/1-100);
  restart.addImage(restartImg);
  
  gameOver.scale =1.8;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,700,50);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
 
  
 
  
  if(gameState === PLAY){
    
    
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -4;
    back.velocityX = -4;
    //scoring
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
  if (back.x < 0){
      back.x = back.width/2;
    }
    
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y>250) {
        trex.velocityY = -12;
      jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
     back.velocityX=0
      trex.velocityY = 0
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
  
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
   
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();

if(gameState === PLAY){
    
   text("Score: "+ score,width/2,height/10);}
  
if(mousePressedOver(restart)&&gameState===END){
gameState=PLAY;
reset();

}
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width/1,height-45,700,50);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.visible=false;
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
obstaclesGroup.destroyEach() ;
gameOver.visible=false;
restart.visible=false;
 trex.changeAnimation("running", trex_running);
score=0;
}