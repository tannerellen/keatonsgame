var privateFunctions = (function() {
  return {
    //Item factory
    createItem: function(image, x, y, points, collisionOffsets) {
      var item = {};
      var imageLoaded;
        item.image = new Image();
        item.image.src = image;
        item.x = x;
        item.y = y;
        item.image.onload = function() {
          item.height = item.image.height;
          item.width = item.image.width;
        };
        item.collisionBoundary = collisionOffsets;
        item.points = points;
        item.collisionCount = 0;
        item.timeRendered = new Date().getTime();
        item.instance = [];
      return item;
    },

    scrollLayer: function(context, gameWidth, gameHeight,  item, speed) {
      var xOffset;
      var yOffset;
      var i = 0;
      var ii = 0;
      if (Math.abs(item.x) < item.width) {
        item.x = item.x - speed;
      }
      else {
        item.x = 0;
      }
      do {
        do {
          xOffset = item.x + (item.width * i);
          yOffset = item.height * ii;
          this.updateImage(item.image, xOffset, yOffset);
          ii++;
        }
        while (yOffset < gameHeight);
        i++;
        ii = 0;
      }
      while (xOffset < gameWidth);
    },

    attackSpawn: function(weapon, startX, startY) {
        var time = new Date().getTime();
        //Fire another fireball only if at leaset 150 milliseconds have passed since last time
        if (time > weapon.timeRendered + 150) {
          weapon.timeRendered = time;
          //Check to see if any existing array indexes are empty
          for (var i = 0; i < weapon.instance.length; i++) {
            if (!weapon.instance[i]) {
              count = i;
              break;
            }
          }
          for (var i = 0; i < game.weaponLevel; i++) {
            var spawn = {
              x: startX + (25 + (20 * i)),
              y: startY + (30 * i)
            };
            weapon.instance.push(spawn);
          }


          game.sounds.fireball.pause();
          game.sounds.fireball.currentTime = 0;
          game.sounds.fireball.play();
        }
    },

    attackAdvance: function(weapon, speed) {
      if (weapon.instance) {
        for (var i = 0; i < weapon.instance.length; i ++) {
          if (weapon.instance[i]) {
            if (weapon.instance[i].x > game.width) {
              weapon.instance[i] = null;
            }
            else {
              weapon.instance[i].x += speed;
              this.updateImage(weapon.image, weapon.instance[i].x, weapon.instance[i].y);
            }
          }
          //Remove the last array item if it is empty so we don't keep growing our array.
          else if (i === weapon.instance.length - 1){
            weapon.instance.pop();
          }
        }
      }
    },

    activatePowerUp: function(enemy, activePowerUp) {
      if (activePowerUp.max > game.weaponLevel) {
        activePowerUp.powerUp.instance.push({
          x: enemy.x,
          y: enemy.y
        });
      }
    },

    moveCharacter: function(keys, character, speed) {
      //Initialize character coordinates
      if (!character.instance[0]) {
        character.instance[0] = {
          x: character.x,
          y: character.y
        };
      }
      //Down
      if (keys['40'] && character.instance[0].y + character.height < game.height) {
        character.instance[0].y += speed;
      }
      //Up
      if (keys['38'] && character.instance[0].y > 0) {
        character.instance[0].y -= speed;

      }
      //Right
      if (keys['39'] && character.instance[0].x + character.width < game.width) {
        character.instance[0].x += speed;

      }
      //Left
      if (keys['37'] && character.instance[0].x > 0) {
        character.instance[0].x -= speed;

      }
      //Space
      if (keys['32']) {
        keys['32'] = false; // We don't want this key to allow rapid fire so we don't hold it down.
        this.attackSpawn(characters.fireball, character.instance[0].x + 50, character.instance[0].y);
      }
      this.updateImage(character.image, character.instance[0].x, character.instance[0].y);
    },

    collisionDetection: function(x1, y1, width1, height1, x2, y2, width2, height2) {
      var left1 = x1;
      var right1 = x1 + width1;
      var top1 = y1;
      var bottom1 = y1 + height1;

      var left2 =x2;
      var right2 = x2 + width2;
      var top2 = y2;
      var bottom2 = y2 + height2;
      
      var xCollision = (left2 < right1 && left2 > left1) || (right2 > left1 && left1 > left2);
      var yCollision = (top2 < bottom1 && top2 > top1) || (bottom2 > top1 && top1 > top2);
      
      return (xCollision && yCollision) ? true : false;
    },

    hit: function(item, maxHits, sounds) {
      if (item.collisionCount) {
        item.collisionCount++;
      }
      else {
        item.collisionCount = 1;
      }
      item.x -= 20;
      if (item.collisionCount >= maxHits) {
        sounds.die.play();
        return true;
      }
      else {
        sounds.hit.play();
        return false;
      }
    },

    clearState: function(items) {
      var item;
      for (item in items) {
        items[item].instance = [];
      }
    },

    updateImage: function(image,x,y) {
      canvasContext.drawImage(image, x, y);
    },

    clear: function(element, x, y, width, height) {
      element.clearRect(x,y,width,height);
    },

    fade: function(context, width, height, time, duration, direction) {
      var transparency = direction === 'in' ? (duration - time) / duration : (1 - (duration - time)) / duration;
      canvasContext.beginPath();
      canvasContext.rect(0, 0, width, height);
      canvasContext.fillStyle = 'rgba(0,0,0,' + Math.round(transparency * 100) / 100 + ')';
      canvasContext.fill();
    },

    titleText: function(context, viewWidth, viewHeight, text) {
      context.font = "128px Helvetica";
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.lineWidth = 3;
      context.strokeStyle = 'rgb(75,75,75)';
      context.fillText(text, viewWidth / 2, viewHeight / 2);
      context.strokeText(text, viewWidth / 2, viewHeight / 2);
    },

    lifeMeter: function(context, x, y, maxHits, hits) {
      var hitsRemaining = maxHits - hits;
      var color;
      var text = "Health";
      var metrics = canvasContext.measureText(text);
      var textWidth = metrics.width;

      context.font = "32px Helvetica";
      context.textAlign = 'left';
      context.fillStyle = 'white';
      context.lineWidth = 1;
      context.strokeStyle = 'rgb(50,50,50)';
      context.fillText(text, x, y);
      context.strokeText(text, x, y);

      for (var i = 0; i < maxHits; i++) {
        if (i + 1 <= hitsRemaining || hits === undefined) {
          color = 'rgb(0,255,0)';
        }
        else {
          color = 'rgba(200,200,200, 0.5)';
        }

        context.beginPath();
        context.rect(x + textWidth + 10 + (i * 15), y - 20, 10, 20);
        context.fillStyle = color;
        context.fill();

      }

    },
    //Change game state: this is currently referencing outside objects so is not fully decoupled
    changeState: function(newState) {

      if (states[game.state].end) {
        states[game.state].end();
      }

      game.state = newState;
      if (states[newState].start) {
        states[newState].start();
      }
      if (states[newState].run) {
        states[newState].run();
      }

    },

  };

})();