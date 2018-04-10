// Enemies our player must avoid
var Enemy = function(x_0 = 0, lane = 0, speed = 50) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = x_0;
    this.y = 83 * (lane % 3) + 60;
    this.delta = 70;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed*dt;
    if(this.x > window.innerWidth)
      this.x = 0;
    //handles collision
    if((player.x > this.x - this.delta) && (player.x < this.x + this.delta) &&
       (player.y > this.y - this.delta) && (player.y < this.y + this.delta)) {
         //collision detected
         player.loseGame = true;
       }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  //load image
  this.images = ['images/char-pink-girl.png','images/char-horn-girl.png',
                 'images/char-boy.png','images/char-princess-girl.png',
                'images/char-cat-girl.png'];
  this.sprite = this.images[0];
  this.lastImage = 0;

  //define initial position
  this.initialPosition_x = 300;
  this.initialPosition_y = 402;
  this.x = 300;
  this.y = 402;
  this.nextPosition_x = this.x;
  this.nextPosition_y = this.y;
  this.winGame = false;
  this.resetGame = false;
  this.loseGame = false;
  this.resetCount = 0;

  //defines delta movement in pixels
  this.dx = 100;
  this.dy = 83;
};

Player.prototype.update = function(dt) {
  if(this.resetGame == false){
    // not set to reset game
    if(this.loseGame == true){
      // check if palyer has lost the game and set its score to zero
      score = 0;
      document.getElementById('score').innerHTML = 'Player score: ' + score;
      this.resetGame = true;
    } else if(this.winGame == true){
      // check if player has won the game and increment its score
      score++;
      document.getElementById('score').innerHTML = 'Player score: ' + score;
      this.resetGame = true;
    } else {
      // normal cycle of update players position
      this.x = this.nextPosition_x;
      this.y = this.nextPosition_y;
    }
  } else {
    //reset condition was set, keep freezed for 10 cycles before restart
    if(this.resetCount == 0){
      //updates only once and freeze
      this.x = this.nextPosition_x;
      this.y = this.nextPosition_y;
    }
    this.resetCount++;
    if(this.resetCount > 10 || this.loseGame){
      //freeze only to that player has won if it has lost reset game unconditionally
      this.nextPosition_x = this.initialPosition_x;
      this.nextPosition_y = this.initialPosition_y;
      this.resetGame = false;
      this.loseGame = false;
      this.winGame = false;
      this.resetCount = 0;
    }
  }

};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite),this.x,this.y);
};

Player.prototype.handleInput = function(key){
  switch(key){
    case 'left':
      this.nextPosition_x = this.x - this.dx;
      if(this.nextPosition_x < 0) // check if reached left border
        this.nextPosition_x = this.x;
    break;
    case 'up':
      this.nextPosition_y = this.y - this.dy;
      if(this.nextPosition_y < -85) // check if reached upper border
        this.nextPosition_y = this.y;
    break;
    case 'right':
      this.nextPosition_x = this.x + this.dx;
      if(this.nextPosition_x > window.innerWidth - 200) // check if reached right border
        this.nextPosition_x = this.x;
    break;
    case 'down':
      this.nextPosition_y = this.y + this.dy;
      if(this.nextPosition_y > window.innerHeight - 500) // check if reached lower border
        this.nextPosition_y = this.y;
    break;
    case 'R':
      // change player image
      const index = (++this.lastImage)%this.images.length;
      this.sprite = this.images[index];
    break;
    default:
      console.log('Let\'s move! Use the arrows to move player.');
  }
  //check if it reached the water and reset
  if (this.nextPosition_y < 70){
    //water achieved
    this.resetPlayer();
  }
};

Player.prototype.resetPlayer = function (){
  //reset unconditionally
    this.winGame = true;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [ new Enemy(0,0,100), new Enemy(200,0,100), new Enemy(0,1,50),
                   new Enemy(0,2,200), new Enemy(0,2,400) ];
// Place the player object in a variable called player
var player = new Player();

//creates a score variable for the player
var score = 0;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'R'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
