var loadLevelAssets = function(game, characters) {
  return {
    level1: function() {
      characters.background = privateFunctions.createItem("images/background-clouds.jpg", 0, 0);
      characters.clouds = privateFunctions.createItem("images/background-paralax.png", 0, 0);
      characters.fish = privateFunctions.createItem("images/enemy-fish.png", game.width, game.height / 2, 1, {top: 15, right: 20, bottom: 15, left: 20});
      characters.meowth = privateFunctions.createItem("images/enemy-meowth.png", game.width, game.height / 2, 1, {top: 15, right: 20, bottom: 15, left: 20});
      characters.rayquaza = privateFunctions.createItem("images/enemy-rayquaza.png", game.width, game.height / 2, 1, {top: 15, right: 20, bottom: 15, left: 20});
      characters.shredder = privateFunctions.createItem("images/enemy-shredder.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 10, left: 35});
      characters.keaton = privateFunctions.createItem("images/keaton-silly.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.keatonDown = privateFunctions.createItem("images/keaton-silly-down.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.powerup = privateFunctions.createItem("images/powerup-fire.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});


      var levelProperties = {
        title: 'Level 1',
        timeStarted: new Date().getTime(),
        timeToFinish: 60 * 1000 * 1, // 1 Minutes
        nextLevel: 'level2',
        sounds: {
          theme: new Audio("sounds/theme-level1.mp3"),
        },
        powerUps: [{
          powerUp: characters.powerup,
          activateSound: '',
          direction: 'up',
          max: 2,
          sounds: {
            powerUp: new Audio("sounds/powerup.wav")
          },
          killFunction: function() {
            this.sounds.powerUp.play();
            game.weaponLevel++;
          }
        }],
        enemies: [{
          enemy: characters.fish,
          speed: 3,
          hitsToKill: 1,
          frequency: 4000, //Change this to a millisecond value
          groupSize: 4,
          counter: 0,
          placement: 'grouped',
          direction: 'diagonal',
          constrain: false
        },
        {
        enemy: characters.keaton,
          speed: 2,
          hitsToKill: 1,
          frequency: [15000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: game.height,
          direction: 'pop-up',
          constrain: false,
          killFunction: function(sourceEnemy, powerUp) {
            privateFunctions.activatePowerUp(sourceEnemy, powerUp);
          }
        },
        {
        enemy: characters.keatonDown,
          speed: 2,
          hitsToKill: 1,
          frequency: [11000, 13000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: 0 - characters.keatonDown.image.height,
          direction: 'pop-down',
          constrain: false
        },
        {
          enemy: characters.meowth,
          speed: 3,
          hitsToKill: 1,
          frequency: 5000,
          groupSize: 1,
          counter: 0,
          placement: 'random',
          direction: 'dash',
          constrain: true
        },
        {
          enemy: characters.rayquaza,
          speed: 7,
          hitsToKill: 1,
          frequency: 9000,
          groupSize: 1,
          counter: 0,
          placement: 'random',
          direction: 'wave-horizontal',
          constrain: true
        },
        {
          enemy: characters.shredder,
          speed: 5,
          hitsToKill: 1,
          frequency: 7000,
          groupSize: 1,
          counter: 0,
          placement: 'random',
          direction: 'dash',
          constrain: true
        }]
      };
      var loadCount = levelProperties.enemies.length;
      for (var i = 0; i < levelProperties.enemies.length; i++) {
        levelProperties.enemies[i].enemy.image.onload = function() {
          loadCount--;
          if(loadCount === 0) {
            game.levelProperties.loaded = true;
          }
        };
      }
      return levelProperties;
    },
    level2: function() {
      characters.background = privateFunctions.createItem("images/background-starfield.png", 0, 0);
      characters.clouds = privateFunctions.createItem("images/background-paralax-space.png", 0, 0);
      characters.rocket = privateFunctions.createItem("images/enemy-rocket.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.asteroid = privateFunctions.createItem("images/enemy-asteroid.png", game.width, game.height / 2, 1, {top: 20, right: 20, bottom: 20, left: 20});
      characters.bug = privateFunctions.createItem("images/enemy-bug.png", game.width, game.height / 2, 10, {top: 20, right: 20, bottom: 20, left: 20});
      characters.keaton = privateFunctions.createItem("images/keaton-silly.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.keatonDown = privateFunctions.createItem("images/keaton-silly-down.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.powerup = privateFunctions.createItem("images/powerup-fire.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});

      var levelProperties = {
        title: 'Level 2',
        timeStarted: new Date().getTime(),
        timeToFinish: 60 * 1000 * 1.5, //1.5 Minutes
        nextLevel: 'level3',
        sounds: {
          theme: new Audio("sounds/theme-level2.mp3"),
        },
        powerUps: [{
          powerUp: characters.powerup,
          activateSound: '',
          direction: 'up',
          max: 3,
          sounds: {
            powerUp: new Audio("sounds/powerup.wav")
          },
          killFunction: function() {
            this.sounds.powerUp.play();
            game.weaponLevel++;
          }
        }],
        enemies: [{
          enemy: characters.rocket,
          speed: 5,
          hitsToKill: 1,
          frequency: 2000,//Miliseconds
          groupSize: 1,
          placement: 'random',
          direction: 'diagonal',
          constrain: false
        },
        {
          enemy: characters.keaton,
          speed: 2,
          hitsToKill: 1,
          frequency: [15000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: game.height,
          direction: 'pop-up',
          constrain: false,
          killFunction: function(sourceEnemy, powerUp) {
            privateFunctions.activatePowerUp(sourceEnemy, powerUp);
          }
        },
        {
        enemy: characters.keatonDown,
          speed: 2,
          hitsToKill: 1,
          frequency: [11000, 13000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: 0 - characters.keatonDown.image.height,
          direction: 'pop-down',
          constrain: false
        },
        {
          enemy: characters.asteroid,
          speed: 2,
          hitsToKill: 1,
          frequency: 2000,//Milliseconds
          groupSize: 1,
          placement: 'random',
          direction: 'horizontal',
          constrain: true
        },
        {
          enemy: characters.bug,
          speed: 5,
          hitsToKill: 2,
          frequency: 5000,
          groupSize: 1,
          placement: 'random',
          direction: 'wave-horizontal',
          constrain: true
        }]
      };
      var loadCount = levelProperties.enemies.length;
      for (var i = 0; i < levelProperties.enemies.length; i++) {
        levelProperties.enemies[i].enemy.image.onload = function() {
          loadCount--;
          if(loadCount === 0) {
            game.levelProperties.loaded = true;
          }
        };
      }
      return levelProperties;

    },
    level3: function() {
      characters.background = privateFunctions.createItem("images/background-starfield.png", 0, 0);
      characters.clouds = privateFunctions.createItem("images/background-blank.png", 0, 0);
      characters.missle = privateFunctions.createItem("images/enemy-missle.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.asteroid = privateFunctions.createItem("images/enemy-asteroid.png", game.width, game.height / 2, 1, {top: 20, right: 20, bottom: 20, left: 20});
      characters.ufo = privateFunctions.createItem("images/enemy-ufo.png", game.width, game.height / 2, 10, {top: 20, right: 20, bottom: 20, left: 20});
      characters.keaton = privateFunctions.createItem("images/keaton-silly.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.keatonDown = privateFunctions.createItem("images/keaton-silly-down.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});
      characters.powerup = privateFunctions.createItem("images/powerup-fire.png", game.width, game.height / 2, 5, {top: 20, right: 20, bottom: 20, left: 20});

      var levelProperties = {
        title: 'Level 3',
        timeStarted: new Date().getTime(),
        timeToFinish: 60 * 1000 * 1.5, //1.5 Minutes
        nextLevel: 'intro',
        sounds: {
          theme: new Audio("sounds/theme-level3.mp3"),
        },
        powerUps: [{
          powerUp: characters.powerup,
          activateSound: '',
          direction: 'up',
          max: 3,
          sounds: {
            powerUp: new Audio("sounds/powerup.wav")
          },
          killFunction: function() {
            this.sounds.powerUp.play();
            game.weaponLevel++;
          }
        }],
        enemies: [{
          enemy: characters.missle,
          speed: 7,
          hitsToKill: 1,
          frequency: 2000,//Miliseconds
          groupSize: 1,
          placement: 'random',
          direction: 'dash',
          constrain: false
        },
        {
          enemy: characters.keaton,
          speed: 2,
          hitsToKill: 1,
          frequency: [15000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: game.height,
          direction: 'pop-up',
          constrain: false,
          killFunction: function(sourceEnemy, powerUp) {
            privateFunctions.activatePowerUp(sourceEnemy, powerUp);
          }
        },
        {
        enemy: characters.keatonDown,
          speed: 2,
          hitsToKill: 1,
          frequency: [11000, 13000], //Change this to a millisecond value
          groupSize: 1,
          counter: 0,
          placement: 'specific',
          x: game.width / 1.25,
          y: 0 - characters.keatonDown.image.height,
          direction: 'pop-down',
          constrain: false
        },
        {
          enemy: characters.ufo,
          speed: 6,
          hitsToKill: 3,
          frequency: 5000,
          groupSize: 1,
          placement: 'random',
          direction: 'wave-horizontal',
          constrain: true
        }]
      };
      var loadCount = levelProperties.enemies.length;
      for (var i = 0; i < levelProperties.enemies.length; i++) {
        levelProperties.enemies[i].enemy.image.onload = function() {
          loadCount--;
          if(loadCount === 0) {
            game.levelProperties.loaded = true;
          }
        };
      }
      return levelProperties;

    }
  };
}