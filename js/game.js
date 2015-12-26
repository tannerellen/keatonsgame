 //Get canvas elements and create context
    var myCanvas = document.getElementById('myCanvas');
    var canvasContext = myCanvas.getContext("2d");
    
    //Fullscreen mode
    // Find the right method, call on correct element
    function launchFullScreen(element) {
      if(element.requestFullscreen) {
        element.requestFullscreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
    myCanvas.addEventListener('click', function() {
    //launchFullScreen(document.documentElement); // the whole page
    launchFullScreen(document.getElementById("myCanvas")); // any individual element
    });


  


    //Game settings
    var game = {
      state: "intro",
      height: myCanvas.height,
      width: myCanvas.width,
      enemyCount: 8,
      collisions: 4,
      weaponLevel: 1,
      score: 0,
      keys: {},
      levelAssets: {},
      sounds: {
        intro: new Audio("sounds/intro.mp3"),
        over: new Audio("sounds/game-over.wav"),
        levelUp: new Audio("sounds/level-up.wav"),
        hit: new Audio("sounds/hit.wav"),
        enemyHit: new Audio("sounds/enemy-hit.wav"),
        die: new Audio("sounds/die.wav"),
        fireball: new Audio("sounds/lightning.wav"),
        lightning: new Audio("sounds/lightning.wav"),
        pop: new Audio("sounds/pop.wav")
      }
    };

    var characters = {
      hero: privateFunctions.createItem("images/main-character.png", game.width / 3, game.height / 2, 0, {top: 25, right: 25, bottom: 20, left: 20}),
      fireball: privateFunctions.createItem("images/attack-lightning.png", 0, 0, 0, {top: 5, right: 5, bottom: 5, left: 5}),
      lightning: privateFunctions.createItem("images/attack-lightning.png", 0, 0, 0, {top: 15, right: 20, bottom: 15, left: 20}),
      title: privateFunctions.createItem("images/title.jpg", 0, 0)
    };


  var levelAssets = loadLevelAssets(game, characters);

    //Monitor game input
    var keyPresses = {
        keyDown: document.addEventListener('keydown', function(e) {
        var keyPressed = e.keyCode;
        game.keys[keyPressed] = true;
        //40 = Down, 38 = Up, 37 = Left, 39 = Right, 32 = Space
      }),
      
      keyUp: document.addEventListener('keyup', function(e) {
          var keyUnpressed = e.keyCode;
          game.keys[keyUnpressed] = false;
      })
    };




  function powerUpGenerator(powerUps, time) {
    var currentPowerUp;
    var heroCollision;

    for (var i = 0; i < powerUps.length; i++){
     currentPowerUp = powerUps[i].powerUp;

       if (currentPowerUp.instance[0]) {
        if (currentPowerUp.instance[0].y + currentPowerUp.image.height < 0 ) {
          currentPowerUp.instance[0] = null;
        }
         currentPowerUp.instance[0].y -= 1;
         currentPowerUp.instance[0].x -= 0;


          if (characters.hero.instance[0]) {
            heroCollision = privateFunctions.collisionDetection(
              characters.hero.instance[0].x + (characters.hero.collisionBoundary.left),
              characters.hero.instance[0].y + (characters.hero.collisionBoundary.top),
              characters.hero.image.width - (characters.hero.collisionBoundary.left + characters.hero.collisionBoundary.right),
              characters.hero.image.height - (characters.hero.collisionBoundary.top + characters.hero.collisionBoundary.bottom),
              currentPowerUp.instance[0].x + (currentPowerUp.collisionBoundary.left),
              currentPowerUp.instance[0].y + (currentPowerUp.collisionBoundary.top),
              currentPowerUp.image.width - (currentPowerUp.collisionBoundary.left + currentPowerUp.collisionBoundary.right),
              currentPowerUp.image.height - (currentPowerUp.collisionBoundary.top + currentPowerUp.collisionBoundary.bottom)
            );
          }


          //If there was a collision remove the enemy
          if (heroCollision) {
            if (powerUps[i].killFunction) {
              powerUps[i].killFunction();
            }
            currentPowerUp.instance[0] = null;
          }
          else {
            privateFunctions.updateImage(currentPowerUp.image, currentPowerUp.instance[0].x, currentPowerUp.instance[0].y);
          }
      }
    }
  }
  function enemyGenerator(enemies, time, generate) {
    var currentEnemy;
    var enemy;
    var random;
    var collisionDetected;
    var heroCollision;
    var fireballCollision;
    var enemyTypeCount = enemies.length;
    var instanceCount = game.enemyCount / enemyTypeCount;
    var spawnX;
    var spawnY;
    var frequency;

    powerUpGenerator(game.levelProperties.powerUps, time);
    for (var typeCounter = 0; typeCounter < enemyTypeCount; typeCounter++) {
      currentEnemy = enemies[typeCounter];
      enemy = currentEnemy.enemy;

      if (time - game.levelProperties.timeStarted < currentEnemy.frequency) {
        continue;
      }

      //instanceCount = currentEnemy.frequency < 50 ? instanceCount * (currentEnemy.frequency * 0.01) : instanceCount * (1 + (currentEnemy.frequency * 0.01)); 
      instanceCount = enemy.instance.length;

      for (var i = 0; i < instanceCount; i++) {


        if (enemy.instance[i]) {
          //Diagonal movement
          if (currentEnemy.direction === "diagonal") {
            enemy.instance[i].x -= currentEnemy.speed;
            enemy.instance[i].y -= currentEnemy.speed / 4;
          }

          //pop-up
          else if (currentEnemy.direction === "pop-up") {
            if (enemy.instance[i].x > game.width) {
              enemy.instance[i].x -= game.width / 2;
            }
            if (enemy.instance[i].y === enemy.instance[i].spawn.y) {
              enemy.instance[i].y = game.height - 1;
            }
            if (!enemy.instance[i].increment && enemy.instance[i].y > game.height - enemy.image.height / 3) {
              enemy.instance[i].y -= currentEnemy.speed;
            }
            else if (!enemy.instance[i].increment && !enemy.instance[i].time && enemy.instance[i].y > game.height - enemy.image.height / 2) {
              enemy.instance[i].time = time;
            }
            else if (!enemy.instance[i].increment && time - enemy.instance[i].time >= 1500 && enemy.instance[i].y > game.height - enemy.image.height + 2) {
              enemy.instance[i].y -= currentEnemy.speed;
              if (enemy.instance[i].y <= game.height - enemy.image.height + 2) {
                enemy.instance[i].time = time;
              }
            }
            else if (time - enemy.instance[i].time >= 1500) {
              enemy.instance[i].y += currentEnemy.speed * 4;
              enemy.instance[i].increment = 1;

            }


          }
          //pop-down
          else if (currentEnemy.direction === "pop-down") {
            if (enemy.instance[i].x > game.width) {
              enemy.instance[i].x -= game.width / 2;
            }
            if (enemy.instance[i].y === enemy.instance[i].spawn.y) {
              enemy.instance[i].y = 0 - enemy.image.height;
            }

            if (!enemy.instance[i].increment && enemy.instance[i].y < 0 - enemy.image.height / 1.5) {
              enemy.instance[i].y += currentEnemy.speed;
            }
            else if (!enemy.instance[i].increment && !enemy.instance[i].time && enemy.instance[i].y > 0 - enemy.image.height / 1.5) {
              enemy.instance[i].time = time;
            }
            else if (time - enemy.instance[i].time >= 1500) {
              enemy.instance[i].y -= currentEnemy.speed * 4;
              enemy.instance[i].increment = 1;

            }


          }

          //Dash
          else if (currentEnemy.direction === "dash") {
            if (enemy.instance[i].x > game.width - enemy.image.width / 3) {
              enemy.instance[i].x -= currentEnemy.speed;
            }
            else if (enemy.instance[i].x >= game.width - enemy.image.width - currentEnemy.speed) {
              enemy.instance[i].x -= 0.1;
            }
            else {
              enemy.instance[i].x -= currentEnemy.speed * 2;
            }
          }
          //diagonal-loop
          if (currentEnemy.direction === "diagonal-loop") {
              if (enemy.instance[i].increment) {
              enemy.instance[i].increment += 0.5;
              }
              else {
                enemy.instance[i].increment = 1;
                enemy.instance[i].y += Math.random() * 150;
              }
              enemy.instance[i].x -= currentEnemy.speed + (enemy.instance[i].increment * 0.04);
              enemy.instance[i].y -= currentEnemy.speed  +  (enemy.instance[i].x * 0.0001) / 5;

          }

          //Diagonal wave movement
          else if (currentEnemy.direction === "wave-diagonal") {
            if (enemy.instance[i].increment) {
            enemy.instance[i].increment += Math.PI / 100;
            }
            else {
              enemy.instance[i].increment = Math.PI / 100;
              if (enemy.instance[i - 1]) {
                enemy.instance[i].y = enemy.instance[i - 1].y - 50;
                enemy.instance[i].x = enemy.instance[i - 1].x - 50;
                enemy.instance[i].spawn.y = enemy.instance[i - 1].y - 50;
                enemy.instance[i].spawn.x = enemy.instance[i - 1].x - 50;
              }

            }
            enemy.instance[i].x -= currentEnemy.speed;
            enemy.instance[i].y = enemy.instance[i].spawn.y + Math.sin(enemy.instance[i].increment) * 100;
            
          }

          //Horizontal wave movement
          else if (currentEnemy.direction === "wave-horizontal") {
            if (enemy.instance[i].increment) {
            enemy.instance[i].increment += Math.PI / 100;
            }
            else {
              enemy.instance[i].increment = Math.PI / 100;
            }
            enemy.instance[i].x -= currentEnemy.speed;
            enemy.instance[i].y = enemy.instance[i].spawn.y + Math.sin(enemy.instance[i].increment) * 100;
          }

          //Horizontal movement
          else {
            enemy.instance[i].x -= currentEnemy.speed;
          }

          privateFunctions.updateImage(enemy.image, enemy.instance[i].x, enemy.instance[i].y);


          if (enemy.instance[i].x < game.width) {
            //Test for collisions on the new position
            if (characters.hero.instance[0]) {
              heroCollision = privateFunctions.collisionDetection(
                characters.hero.instance[0].x + (characters.hero.collisionBoundary.left),
                characters.hero.instance[0].y + (characters.hero.collisionBoundary.top),
                characters.hero.image.width - (characters.hero.collisionBoundary.left + characters.hero.collisionBoundary.right),
                characters.hero.image.height - (characters.hero.collisionBoundary.top + characters.hero.collisionBoundary.bottom),
                enemy.instance[i].x + (enemy.collisionBoundary.left),
                enemy.instance[i].y + (enemy.collisionBoundary.top),
                enemy.image.width - (enemy.collisionBoundary.left + enemy.collisionBoundary.right),
                enemy.image.height - (enemy.collisionBoundary.top + enemy.collisionBoundary.bottom)
              );
            }
            if (characters.fireball.instance) {
              var fireballCount = characters.fireball.instance.length;
              for (var fireballNumber = 0; fireballNumber < fireballCount; fireballNumber++) {
                if (characters.fireball.instance[fireballNumber]) {
                  fireballCollision = privateFunctions.collisionDetection(
                    characters.fireball.instance[fireballNumber].x + (characters.fireball.collisionBoundary.left),
                    characters.fireball.instance[fireballNumber].y + (characters.fireball.collisionBoundary.top),
                    characters.fireball.image.width - (characters.fireball.collisionBoundary.left + characters.fireball.collisionBoundary.right),
                    characters.fireball.image.height - (characters.fireball.collisionBoundary.top + characters.fireball.collisionBoundary.bottom),
                    enemy.instance[i].x + (enemy.collisionBoundary.left),
                    enemy.instance[i].y + (enemy.collisionBoundary.top),
                    enemy.image.width - (enemy.collisionBoundary.left + enemy.collisionBoundary.right),
                    enemy.image.height - (enemy.collisionBoundary.top + enemy.collisionBoundary.bottom)
                  );
                  //Check if fireball killed an enemy
                  if (fireballCollision) {
                    fireballCollision = false;
                    enemy.instance[i].hits++;
                    characters.fireball.instance[fireballNumber] = null;
                    if (enemy.instance[i].hits < currentEnemy.hitsToKill) {
                      game.sounds.enemyHit.play();
                    }
                    else {
                      game.sounds.pop.play();
                    }
                    game.score += enemy.points;
                  }
                }
              }
            }

          }

          //Check if the hero collided with an enemy
          if (heroCollision) {
            collisionDetected = true;
            enemy.instance[i].hits = currentEnemy.hitsToKill;
          }


          //If there was a collision remove the enemy
          if (enemy.instance[i].x + enemy.width < 0 || enemy.instance[i].hits >= currentEnemy.hitsToKill) {
            if (currentEnemy.killFunction) {
              currentEnemy.killFunction(enemy.instance[i], game.levelProperties.powerUps[0]);
            }
            enemy.instance[i] = null;
          }

        }
        //Remove last array item if it is null
        else if (i === instanceCount - 1) {
          enemy.instance.pop();
        }
      }

      if (Array.isArray(currentEnemy.frequency) && currentEnemy.counter < currentEnemy.frequency.length) {
        if (!currentEnemy.timeGenerated) {
          currentEnemy.timeGenerated = time;
        }
        frequency = currentEnemy.frequency[currentEnemy.counter];
      }
      else {
        frequency = currentEnemy.frequency;
      }
      if ((generate && currentEnemy.timeGenerated + frequency <= time) || (generate && !currentEnemy.timeGenerated)) {
        currentEnemy.timeGenerated = time;
        for (var i = 0; i < currentEnemy.groupSize; i++) {
          if (currentEnemy.placement === 'grouped' && i > 0) {
            spawnX = enemy.x + (enemy.image.width * 2);
            spawnY = enemy.y + (enemy.image.height / 2);
          }
          else if (currentEnemy.placement === 'specific') {
            spawnX = currentEnemy.x;
            spawnY = currentEnemy.y;
          }
          else {
            random = Math.random() * 1000;
            spawnX = game.width + random;
            if (currentEnemy.constrain) {
              spawnY = Math.floor(Math.random() * ((game.height - enemy.image.height) - 0 + 1)) + 0;
            }
            else {
              spawnY = Math.floor(Math.random() * (game.height));
            }
          }
          
          currentEnemy.counter ++;

          enemy.instance.push({
            x: spawnX,
            y: spawnY,
            increment: 0,
            hits: 0,
            spawn: {
              x: spawnX,
              y: spawnY
            }
          });

          if (currentEnemy.placement === 'grouped') {
            enemy.x = spawnX;
            enemy.y = spawnY;
          }
        }
      }


     
    }
    return collisionDetected;
  }

//Gameplay code ----------------------->

  //Intro
  var intro = function() {
    var text = "You scored " + game.score + " points";
    privateFunctions.updateImage(characters.title.image, 0, 0);
    canvasContext.font = "64px Helvetica";
    canvasContext.textAlign = 'center';
    canvasContext.fillStyle = 'rgb(150,8,16)';
    canvasContext.lineWidth = 3;
    canvasContext.strokeStyle = 'white';
    if (game.score) {
      canvasContext.fillText(text, game.width / 2, (game.height / 2) + 80);
      //canvasContext.strokeText(text, game.width / 2, game.height / 2);
    }
    if (game.keys['13']) {
      privateFunctions.changeState("level1");
    }
  };
  
  //Level 1
  var gamePlay = function(levelProperties) {
    var time = new Date().getTime();
    var timeElapsed = time - levelProperties.timeStarted;
    var generateEnemy = false;

    if (timeElapsed > 3000) {
      generateEnemy = true;
    }
    if (timeElapsed >= levelProperties.timeToFinish) {
      generateEnemy = false;
      if (timeElapsed >= levelProperties.timeToFinish + 5000) {
        
        if (!levelProperties.complete) {
          levelProperties.complete = true;
          levelProperties.timeComplete = time;
          game.sounds.levelUp.play();
          setTimeout(function() {
            privateFunctions.changeState(levelProperties.nextLevel);
          }, 4000);
        }
           

      }
    }

      privateFunctions.clear(canvasContext,0,0,game.width,game.height);

      privateFunctions.scrollLayer(canvasContext, game.width, game.height, characters.background, 1);
      privateFunctions.scrollLayer(canvasContext, game.width, game.height, characters.clouds, 2);
      var enemyCollision = enemyGenerator(levelProperties.enemies, time, generateEnemy);
      
      if (enemyCollision && generateEnemy) {
        var reset = privateFunctions.hit(characters.hero.instance[0], game.collisions, game.sounds);
        if (reset) {
          endGame(game);
        }
      }
      //Character
      privateFunctions.moveCharacter(game.keys, characters.hero, 5);
      privateFunctions.attackAdvance(characters.fireball, 14);

      canvasContext.font = "32px Helvetica";
      canvasContext.textAlign = 'right';
      canvasContext.fillStyle = 'white';
      canvasContext.lineWidth = 1;
      canvasContext.strokeStyle = 'rgb(59,50,50)';
      canvasContext.fillText("Score: " + game.score, game.width - 20, 40);
      canvasContext.strokeText("Score: " + game.score, game.width - 20, 40);

      privateFunctions.lifeMeter(canvasContext, 20, 40, game.collisions, characters.hero.instance[0].collisionCount);

      if (timeElapsed < 3 * 1000) {
        privateFunctions.fade(canvasContext, game.width, game.height, timeElapsed, 2000, 'in');
      }
      if (timeElapsed < 3 * 1000) {
        privateFunctions.titleText(canvasContext, game.width, game.height, levelProperties.title);
      }
    
      if (levelProperties.complete) {
        privateFunctions.fade(canvasContext, game.width, game.height, (time - levelProperties.timeComplete), 2000, 'out');
        privateFunctions.titleText(canvasContext, game.width, game.height, 'Level Complete');
      }


  };

  function endGame(gameObject) {
    setTimeout(function() {

      gameObject.sounds.over.play();
      privateFunctions.changeState("intro");

    }, 350);

}

  //Manage game states ----------------->

  var states = {
    intro: {
      start: function() {
        game.sounds.intro.play();
      },
      run: function() {
        intro();
      },
      end: function() {
        game.sounds.intro.pause();
        if (game.sounds.intro.currentTime) {
          game.sounds.intro.currentTime = 0;
        }
        game.score = 0;
        game.weaponLevel = 1;
      }
    },

    level1: {
      start: function() {
        game.levelProperties = levelAssets.level1();
        game.levelProperties.sounds.theme.addEventListener('ended', handler = function() {
          this.currentTime = 0;
          this.play();
        }, false);
        game.levelProperties.sounds.theme.play();
      },
      run: function() {
        if (game.levelProperties.loaded) {
          gamePlay(game.levelProperties);
        }
      },
      end: function() {
        game.levelProperties.sounds.theme.pause();
        game.levelProperties.sounds.theme.currentTime = 0;
        game.levelProperties.sounds.theme.removeEventListener('ended', handler);
        privateFunctions.clearState(characters);
      }
    },
    
    level2: {
      start: function() {
        game.levelProperties = levelAssets.level2();
        game.levelProperties.sounds.theme.addEventListener('ended', handler = function() {
          this.currentTime = 0;
          this.play();
        }, false);
        game.levelProperties.sounds.theme.play();
      },
      run: function() {
        gamePlay(game.levelProperties);
      },
      end: function() {
        game.levelProperties.sounds.theme.pause();
        game.levelProperties.sounds.theme.currentTime = 0;
        game.levelProperties.sounds.theme.removeEventListener('ended', handler);
        privateFunctions.clearState(characters);
      }
    },
    level3: {
      start: function() {
        game.levelProperties = levelAssets.level3();
        game.levelProperties.sounds.theme.addEventListener('ended', handler = function() {
          this.currentTime = 0;
          this.play();
        }, false);
        game.levelProperties.sounds.theme.play();
      },
      run: function() {
        gamePlay(game.levelProperties);
      },
      end: function() {
        game.levelProperties.sounds.theme.pause();
        game.levelProperties.sounds.theme.currentTime = 0;
        game.levelProperties.sounds.theme.removeEventListener('ended', handler);
        privateFunctions.clearState(characters);
      }
    }
  };


  //Run the game ----------------------->

  //Initialize before the loop
  privateFunctions.changeState("intro");

  //Define our event loop function that will start the game   
  function render(gameObject) {
    states[gameObject.state].run();
  }
  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


    // usage:
    // instead of setInterval(render, 16) ....
    (function animloop(){
      requestAnimFrame(animloop);
      render(game);
    })();
    // place the rAF *before* the render() to assure as close to
    // 60fps with the setTimeout fallback.
