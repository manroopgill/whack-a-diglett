/*
  global
  createCanvas, soundFormats, width, height, random, loadImage, image, text, colorMode, HSB, textSize, textAlign, fill, LEFT, CENTER, background, 
  createButton, mouseX, mouseY, keyCode, ENTER, mouseIsPressed, loadSound, io, setVolume, noLoop

*/

let dugtrio1, dugtrio2, dugtrio3, dugtrio4, dugtrio5, bgMusic, diglettSound, whack, ham, digletts, diglett1, diglett2, diglett3, diglett4, diglett5, pic, backgroundImage, positions, button, isStarted, backgroundColor, gameIsOver, score, ham2, lives; 

let teamScore = 0;

var socket;

function preload() {
  soundFormats('mp3');
  whack = loadSound('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2Fhit.mp3?v=1628024180029');
  whack.setVolume(0.009);
  diglettSound = loadSound('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2Fdiglett.mp3?v=1628025327190');
  diglettSound.setVolume(0.009);
  bgMusic = loadSound('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FbgMusic.mp3?v=1628109046494');
  bgMusic.setVolume(0.001);
  bgMusic.loop();

}

function setup(){
  socket = io.connect('http://localhost:3000');
  socket.on('team score', updateTeamScore);

  createCanvas(900, 675);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  diglett1 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0115.PNG?v=1627933186431');
  diglett2 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0116.PNG?v=1627933198323');
  diglett3 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0117.PNG?v=1627933218771');
  diglett4 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0118.PNG?v=1627933229166');
  diglett5 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0120.PNG?v=1627935502014');
  dugtrio1 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0128%202.PNG?v=1628194448601');
  dugtrio2 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0127.PNG?v=1628194451954');
  dugtrio3 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0126.PNG?v=1628194456582');
  dugtrio4 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0125.PNG?v=1628194460177');
  dugtrio5 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FIMG_0129.PNG?v=1628194462470');
  backgroundImage = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FScreen%20Shot%202021-08-02%20at%2012.41.38%20PM.png?v=1627933396644');
  pic = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2Fwhack-a-diglett.png?v=1627940291104');
  ham = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FHammer1.png?v=1628022610412');
  ham2 = loadImage('https://cdn.glitch.com/c130eace-6f5a-4c1f-9ec8-55327d44e593%2FHammer2.png?v=1628022649115')
  isStarted = false;
  gameIsOver = false; 
  score = 0;
  lives = 10;
  
  //1 is diglett, 3 is dugtrio
  digletts = [new Diglett(40, 90, 1), new Diglett(200, 20, 3), new Diglett(370, 100, 1), new Diglett(620, 60, 1), 
              new Diglett(80, 240, 1), new Diglett(230,180, 1), new Diglett(500, 140, 3), new Diglett(750, 210, 1),
              new Diglett(200, 360, 1), new Diglett(400, 260, 1), new Diglett(630, 270, 1), new Diglett(380, 440, 1),
              new Diglett(440, 550, 1), new Diglett(580, 490, 3), new Diglett(690, 400, 1)];
  

}

function updateTeamScore(data) {
  teamScore = data.teamSc;
}

function draw(){
  if(!isStarted) {
    start(); 
  } else if (isStarted) {
    gamePlay();  
  } else if (gameIsOver) {
    gameOver();
  }
  bgMusic.play();
  showHammer();
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (!isStarted) {
      isStarted = true;
    }
  }
}

function mousePressed() {
  console.log("Mouse Pressed");
  for (let diglett of digletts) {
    if (diglett.mouseInRange(mouseX, mouseY)) {
      diglett.whack();
    }
  }
}

function showHammer() {
  if (!mouseIsPressed){
    image(ham, mouseX - 40, mouseY - 55, 80, 110);
  } else{
    image(ham2, mouseX - 40, mouseY - 55, 80, 110);
  }
}

function showScores() {
  textSize(15);
  textAlign(LEFT);
  fill('black');
  text('Score: ' + score, 20, 20);  
  text('Team Score: ' + teamScore, 20, 50);
}

function showLives() {
  text(`Lives: ${lives}`, 20, 80);
}

function start() {
  background(backgroundColor);
  textSize(30);
  textAlign(CENTER);
  text('Whack-A-Diglett', width / 2, height / 7);
  //instructions
  textSize(15);
  textAlign(CENTER);
  text('To gain points click on the diglett/dugtrio that pops up. When the dugtrio is hit, you get triple points!', 450, 530);
  text('Press enter to start playing.', 450, 550);
  //display the picture
  image(pic, 200, 200, 496, 265);
}

function gamePlay() {
  image(backgroundImage, 0, 0, width, height);
  isStarted = true;
  let sound = random(400);
      if(sound < 1){
        diglettSound.play();
      }
  showScores();
  showLives();
  for(let i = 0; i < digletts.length; i++){
    digletts[i].randMove();
    digletts[i].move();    
  }
}

function gameOver() {
  lives = 0;
  gameIsOver = true;
  background(backgroundColor);
  textSize(25);
  fill('black');
  textAlign(CENTER);
  text('Game Over', width / 2, height / 1.8);
  noLoop();
  
}

class Diglett {
  constructor(x, y, pointValue){
    this.x = x;
    this.y = y;
    //the click area is a rectangle with the upper left corner as (x,y) and a width and height
    this.width = 100;
    this.height = 100;
    this.time = 0;
    this.active = false; // True if the diglett is moving
    this.whacked = false; // True if the diglett has been whacked
    this.pointValue = pointValue;
  }
  
  move() {
    if (this.active) {
      this.time++;
    }
    this.display();
  }
  
  display() {
    if(!gameIsOver){
      if (this.pointValue == 1) {
        this.displayDiglett();
      } else {
        this.displayDugtrio();
      }
    }
  }
  
  displayDiglett() {
    if (this.time == 0) {
      //inactive
      image(diglett1, this.x, this.y, this.width, this.height);
    } else if (this.time <= 5) {
      image(diglett2, this.x, this.y, this.width, this.height);
    } else if (this.time <= 10) {
      if (this.whacked) {
        image(diglett5, this.x, this.y, this.width, this.height);
      } else {
        image(diglett3, this.x, this.y, this.width, this.height);
      }
    } else if (this.time <= 90) {
      if (this.whacked) {
        image(diglett5, this.x, this.y, this.width, this.height);
      } else {
        image(diglett4, this.x, this.y, this.width, this.height);
      }
    } else if (this.time <= 95) {
      image(diglett3, this.x, this.y, this.width, this.height);
    } else if (this.time < 100) {
      image(diglett2, this.x, this.y, this.width, this.height);
    } else {
      //reset diglett, or if no lives left end game
      if (!this.whacked) {
        lives > 1 ? lives-- : gameOver();
      }
      this.time = 0;
      this.active = false;
      this.whacked = false;
    }
  }
  
  displayDugtrio(){
    if (this.time == 0) {
      //inactive
      image(dugtrio1, this.x, this.y, this.width, this.height);
    } else if (this.time <= 5) {
      image(dugtrio2, this.x, this.y, this.width, this.height);
    } else if (this.time <= 10) {
      if (this.whacked) {
        image(dugtrio5, this.x, this.y, this.width, this.height);
      } else {
        image(dugtrio3, this.x, this.y, this.width, this.height);
      }
    } else if (this.time <= 90) {
      if (this.whacked) {
        image(dugtrio5, this.x, this.y, this.width, this.height);
      } else {
        image(dugtrio4, this.x, this.y, this.width, this.height);
      }
    } else if (this.time <= 95) {
      image(dugtrio3, this.x, this.y, this.width, this.height);
    } else if (this.time < 100) {
      image(dugtrio2, this.x, this.y, this.width, this.height);
    } else {
      //reset dugtrio, or if no lives left end game
      if (!this.whacked) {
        lives > 1 ? lives-- : gameOver();
      }
      this.time = 0;
      this.active = false;
      this.whacked = false;
    }
  }
  
  whack() {
    if (this.time > 5 && this.whacked == false) {
      this.whacked = true;
      //score point
      score += this.pointValue; 
      teamScore += this.pointValue;
      whack.play();
      var data = {
        teamSc: teamScore
      }
      socket.emit('team score', data);
    }
  }
  
  
  //Call move randomly
  randMove(){
    if(!this.active){
      let num = random(500);
      if(num < 1){
        this.active = true;
      }
    }
  }
  
  mouseInRange(mouseX, mouseY) {
    if (mouseX >= this.x && mouseX <= this.x + this.width) {
      if (mouseY >= this.y && mouseY <= this.y + this.height) {
        return true;
      }
    }
    return false;
  }
}
