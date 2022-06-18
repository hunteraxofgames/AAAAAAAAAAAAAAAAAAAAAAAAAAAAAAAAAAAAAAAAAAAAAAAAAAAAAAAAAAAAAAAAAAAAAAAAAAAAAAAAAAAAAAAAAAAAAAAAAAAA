const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world, backgroundImg;
var canvas, tower, ground, cannon;
var angle = 20; 
var cannonBall;
var balls = [];
var boats=[];
var boatAnimation = []
var boatSpriteData
var boatSpriteSheet
var bBoatAnimation = []
var bBoatSpriteData
var bBoatSpriteSheet
function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON ("./assets/boat/boat.json")
  boatSpriteSheet = loadImage ("./assets/boat/boat.png")
  bBoatSpriteData = loadJSON ("./assets/boat/broken_boat.json")
  bBoatSpriteSheet = loadImage ("./assets/boat/broken_boat.png")
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  var options = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);

  angleMode(DEGREES);
  angle = 15;
  cannon = new Cannon(180, 110, 130, 100, angle);
  boat = new Boat(width-79,height-60,170,170,-80)

  var boatFrames = boatSpriteData.frames
  for (let i = 0; i < boatFrames.length; i++) {
    var pos=boatFrames [i].position
      var img = boatSpriteSheet.get (pos.x,pos.y,pos.w,pos.h)
      boatAnimation.push (img) 
  }

var bBoatFrames = bBoatSpriteData.frames
  for (let i = 0; i < bBoatFrames.length; i++) {
    var pos=bBoatFrames [i].position
      var img = bBoatSpriteSheet.get (pos.x,pos.y,pos.w,pos.h)
      bBoatAnimation.push (img) 
  }
}

function draw() {

  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  
  push();
  imageMode(CENTER);
  image(towerImage,tower.position.x, tower.position.y, 160, 310);
  pop();


  cannon.display();
  showBoats();

  for (var i = 0; i<balls.length;i++){
    showCannonBalls(balls[i],i)
    collisionWithBoat (i)
  }
}

function keyReleased(){
  if (keyCode==DOWN_ARROW) {
    balls[balls.length-1].shoot();
  }
}

function keyPressed(){
  if (keyCode==DOWN_ARROW) {
   var cannonBall = new Cannonball(cannon.x,cannon.y);
    balls.push(cannonBall);
 
  }
}

function showCannonBalls(ball,index){
  if(ball){
    ball.show();
   if (ball.body.position.x >= width || ball.body.position.y>= height-50){
     ball.remove (index)
   }
   
  }
 
}
function showBoats(){
  if (boats.length>0) {
    if (boats[boats.length-1]===undefined || 
      boats[boats.length-1].body.position.x<width-300) {
      var positions=[-40,-60,-70,-20];
      var position=random(positions);
      var boat = new Boat(width-79,height-60,170,170,position,boatAnimation)
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0})
        boats[i].show();
        boats [i].animate ()
      }
      
    }
  } else {
    var boat = new Boat(width-79,height-60,170,170,-80,boatAnimation)
    boats.push(boat);
  }
}
function collisionWithBoat (index){
  for (let i = 0; i < boats.length; i++) {
  if (balls[index]!==undefined &&boats[i]!==undefined){
  var collision =Matter.SAT.collides (balls[index].body,boats[i].body)
  if (collision.collided){
    boats [i].remove (i)
    Matter.World.remove (world,balls[index].body)
    delete balls [index]
  }
  }
    
  }
}