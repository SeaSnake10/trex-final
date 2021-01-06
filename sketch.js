var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;
var score=0;

var gameOver, restart;



localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("A22.png","B22.png","C22.png");
  trex_collided = loadAnimation("I11.png");
  
  groundImage = loadImage("h.png");
  
  backgroundImg = loadImage("GROUND7.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("tree-removebg-preview.png");
  obstacle2 = loadImage("rock-removebg-preview.png");
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("f.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  ground = createSprite(width/2,height-600,width,400);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale = 3;
  
  
  trex = createSprite(50,height-30,200,200);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  trex.debug = false;
  trex.setCollider("rectangle",0,0,50,200);
  
  gameOver = createSprite(width/2,height-257);
  gameOver.addImage(gameOverImg);
  
  
  restart = createSprite(width/2,height-210);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,height-30,800,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
 
  
if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
  
if((touches.length >  0 ||keyDown("space") && trex.y >= 159)) {
      trex.velocityY = -12;
      touches = [];
    }
  
trex.velocityY = trex.velocityY + 1.5;
  
if (ground.x < width/2.9){
      ground.x = width/2;
    }
  
trex.collide(invisibleGround);
spawnClouds();
spawnObstacles();
  
if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || mousePressedOver(restart)) {
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
   textSize(15)
  fill("black");
  text("Score: "+ score, 500, 50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-57,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstacle.debug = false;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}