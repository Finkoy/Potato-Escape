$(document).ready(function()
{	
	//Setup variables.
	var canvas;
	var context;
	var img;
	var loaded = false;
	//Maze information variables.
	var mazeHeight;
	var mazeWidth;
	var victory = false;
	var offsetX = 0;
	var offsetY = 0;

	//player
	var player;
	var playerStartX = 5;
	var playerStartY = 3;
	var playerWidth = 5;
	var playerHeight = 5;
	var playerSpeed = 1;
	var playerStartDir = 2; //south
	var playerStepCount = 0;
	
	//enemies
	var maxEnemy = 50;
	var enemyCount = 0;
	var spawnRate = 1;
	var spawnRadius = 100;
	var enemyQueue;
	var spawnUnits = [];

	//bullets
	var bullets = [];

	//Game state variables
	var levelCount = 1;
	var deathCount = 0;
	var speedCap = 5;
	function main()
	{
		$("#level_count").text("Level: " + levelCount);
		$("#death_count").text("Death count: " + deathCount);
		init();
		loop();
	}

	function init()
	{
		player = new Player(playerStartDir, playerStartX, playerStartY, playerWidth, playerHeight, playerSpeed);
		enemyQueue = new Queue();
		drawMazeAndCharacter(playerStartX, playerStartY);
		window.addEventListener("keydown", moveCharacter, true);

		//Adds enemy ID tags into queue
		resetQueue();
	}

	function loop()
	{
		update();
		if(!victory)
		{
			requestAnimationFrame(loop, canvas);
		}
	}

	function update()
	{
		if(loaded)
		{
			//alert(mazeWidth);
			render();
			determineSpawn();
			updateEnemyMovement();
			updatePlayerBullets();
			player.checkBullets();
			updatePlayerMovement(player.getDirection());
			playerStepCount++;
		}
	}

	/**
	 * Called once in the beginning to draw the map along with the player
	 * character.
	 */
	function drawMazeAndCharacter(playerX, playerY, onload)
	{
		canvas = $("#mazecanvas")[0];
		context = canvas.getContext("2d");
		img = new Image();
		img.crossOrigin = "Anonymous";
	    img.onload = function() 
	    { // when the image is loaded, draw the image and the character
			context.drawImage(img, 0, 0);
			drawCharacter(playerX, playerY, "red", player);
			mazeHeight = this.height;
			mazeWidth = this.width;
			loaded = true;
		};
		img.src = "maze.png";
	}

	function drawCharacter(x, y, color, unit)
	{
		restoreBackground(x, y);
		unit.setX(x);
		unit.setY(y);
		context.fillStyle = color;
		context.fillRect(x,y, unit.getWidth(), unit.getHeight());
		context.beginPath();
		context.rect(x,y,100,100);
		context.closePath();
	}

	function drawBullet(x, y, color, bullet)
	{
		restoreBackground(x, y);
		bullet.setX(x);
		bullet.setY(y);
		context.beginPath();
		context.arc(x, y, bullet.getRadius(), 0, 2 * Math.PI, false);
		context.fillStyle = "black";
		context.fill();
		context.closePath();
	}

	/**
	 * Helper function to redraw the overwritten canvas
	 */
	function restoreBackground(x, y)
	{
		context.fillStyle = "#CC6600";
		context.fillRect(player.getX(), player.getY(), player.getWidth(), player.getHeight());
		context.beginPath();
		context.rect(player.getX(), player.getY(), 100 , 100);
		context.closePath();
	}

	function updatePlayerMovement(direction)
	{
		restoreBackground(player.getX(), player.getY());
		switch(direction)
		{
			case 0: player.moveNorth();
					offsetY+= player.getSpeed();
					break;
			case 1: player.moveEast();
					offsetX-= player.getSpeed();
					break;
			case 2: player.moveSouth();
					offsetY-= player.getSpeed();
					break;
			case 3: player.moveWest();
					offsetX+= player.getSpeed();
					break;
		}
		if(!detectCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), player))
		{
			drawCharacter(player.getX(), player.getY(), "red", player);
		}
		else if(victory)
		{
			victoryScreen();
		}
		else
		{
			respawn();
		}	
	}
	function moveCharacter(e) 
	{
		restoreBackground(player.getX(), player.getY());
	    e = e || window.event;
	    switch (e.keyCode) 
	    {
	        case 38:   // arrow up key
	        case 87: // W key
	 	        player.moveNorth();
	 	        offsetY -= player.getSpeed() * 3;
	        	break;
	        case 37: // arrow left key
	        case 65: // A key
			    player.moveWest();
			    offsetX-= player.getSpeed() * 3;
			    break;
		    case 40: // arrow down key
		    case 83: // S key
		    	player.moveSouth();
		    	offsetY += player.getSpeed() * 3;
		        break;
		    case 39: // arrow right key
		    case 68: // D key
		        player.moveEast();
		        offsetX+= player.getSpeed() * 3;
		        break;
		    case 32: 
		    	player.shoot();
		    	break;
		    case 82: 
		    	respawn();
		    	break;
		    default: return;
		}
		if(!detectCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight(), player))
		{
			drawCharacter(player.getX(), player.getY(), "red", player);
		}
		else if(victory)
		{
			victoryScreen();
		}
		else
		{
			respawn();
		}
	}

	function respawn()
	{
		clearAllUnits();
		player.despawnBullets();
		offsetX = 0;
		offsetY = 0;
		player.setX(5);
		player.setY(5);
		player.setDirection(2);
		deathCount++;
		resetQueue();

		if(playerSpeed > 0.6)
		{
			playerSpeed-= 0.5;
			player.setSpeed(playerSpeed);
		}
		$("#death_count").text("Death count: " + deathCount);
		drawCharacter(player.getX(), player.getY(), "red", player);
	}

	function detectCollision(nextX, nextY, width, height, unit)
	{
		var imgData = context.getImageData(nextX, nextY, width, height);
		var data = imgData.data;
		var finish = false;
		if(nextX <= 0 || nextX + width >= canvas.width
			|| nextY <= 0 || nextY + height >= canvas.height)
		{
			return true;
		}

		for(var i = 0; i < 4 * width * height; i +=4)
		{
			if(data[i] >= 175 && data[i + 1] <= 106 && data[i + 2] < 40)
			{	
			}
			else if(unit === player && (data[i] > 200 && data[i + 1] > 200 && data[i + 2] === 0))
			{
				finish = true;
				break;
			}
			else
			{
				if(unit instanceof Enemy && data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0)
				{
					deleteUnit(unit.getID());
				}
				else if(unit instanceof Projectile && !(data[i] === 0 && data[i + 1] === 153 && data[i + 2] === 0)
					&& (data[i] > 40 && data[i + 1] > 40 && data[i + 2] > 40) ||
						(unit instanceof Projectile && data[i] < 80 && data[i + 1] < 80 && data[i + 2] > 150))
				{
					findByID(closestEnemyToBullet(unit.getX(), unit.getY()));
					unit.hitUnit(true);
					return true;
				}

				if(unit instanceof Projectile)
				{

					console.log(data[i] + ", " + data[i + 1] + ", " + data[i + 2]);
				}
				return true;
			}
		}
		if(finish)
		{
			victory = true;
			return true;
			
		}
		return false;
	}

	function victoryScreen()
	{
		player.despawnBullets();
		clearScreen(0, 0, canvas.width, canvas.height);
		levelCount++;
		spawnRate++;
		$("#level_count").text("Level: " + levelCount);
		context.font = "1.75vw Arial";
		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "white";
		context.fillText("You win!", canvas.width/2, canvas.height/2);
		context.fillText("Please space to continue", canvas.width/2, canvas.height/2 + 60);
		window.removeEventListener("keydown", moveCharacter, true);
		$(window).keypress(function(e)
		{
			if(e.which === 32)
			{
				$(window).unbind("keypress")
				clearScreen(0, 0, canvas.width, canvas.height);
				offsetX = 0;
				offsetY = 0;
				victory = false;
				loaded = false;
				if(playerSpeed < speedCap)
				{
					playerSpeed+= 0.5;
				}
				main();
			}
		});
		
	}

	function clearScreen(xPos, yPos, width, height)
	{
		context.beginPath();
		context.rect(xPos,yPos, width, height);
		context.closePath();
		context.fillStyle = "black";
		context.fill();
	}

	function render()
	{
		clearScreen(0, 0, canvas.width, canvas.height);
		context.drawImage(img, offsetX, offsetY);
	}

	function spawnEnemy(xPos, yPos, dim, speed)
	{
		var id = enemyQueue.dequeue();
		var enemy = new Enemy(xPos, yPos, dim, dim, speed, id);
		enemyCount++;
		spawnUnits[id] = enemy;
		drawCharacter(xPos, yPos, "blue", enemy);
	}

	function determineSpawn()
	{
		if(enemyCount >= maxEnemy) return;
		if(playerStepCount % Math.floor(500/spawnRate) === 0)
		{
			var minX = (player.getX() - spawnRadius < 0) ? 0 : player.getX() - spawnRadius;
			var maxX = player.getX() + spawnRadius;
			var minY = (player.getY() - spawnRadius < 0) ? 0 : player.getY() - spawnRadius;			
			var maxY = player.getX() + spawnRadius;
			var xPos = Math.floor(Math.random() * maxX) + minX;
			var yPos = Math.floor(Math.random() * maxY) + minY;
			var dim = Math.floor(Math.random() * 10) + 5;
			var speed = /*Math.floor(Math.random() * 3) + 1*/0.5;
			spawnEnemy(xPos, yPos, dim, speed);
		}
	}

	function deleteUnit(index)
	{
		spawnUnits[index] = null;
		enemyQueue.enqueue(index);
		enemyCount--;
	}

	function clearAllUnits()
	{
		spawnUnits = [];
		enemyCount = 0;
	}

	function updateEnemyMovement()
	{
		spawnUnits.clean(null);
		for(var i = 0; i < spawnUnits.length; i++)
		{
			var enemy = spawnUnits[i];
			if(enemy != null)
			{
				enemy.followPlayer(player.getX(), player.getY());
				var isBlocked = detectCollision(enemy.getX(), enemy.getY(), enemy.getWidth(), enemy.getHeight(), enemy);
				enemy.blocked(isBlocked);
				drawCharacter(enemy.getX(), enemy.getY(), "blue", enemy);
			}
		}
	}

	function updatePlayerBullets()
	{
		var bullets = player.getBullets();
		for(var i = 0; i < bullets.length; i++)
		{
			bullets[i].move();
			bullets[i].updateTraveled();
			if(detectCollision(bullets[i].getX(), bullets[i].getY(), bullets[i].getRadius(), bullets[i].getRadius(), bullets[i]))
			{
				bullets[i].ricochet();
			}
			if(bullets[i].isAlive())
			{
				drawBullet(bullets[i].getX(), bullets[i].getY(), "black", bullets[i]);
			}
		}
	}

	function closestEnemyToBullet(x, y)
	{
		var closestID = -1;
		var smallestDist = 0x7FFFFFFF;
		spawnUnits.clean(null);
		for(var i = 0; i < spawnUnits.length; i++)
		{
			var curDist = Math.sqrt(Math.pow(x - spawnUnits[i].getX(), 2) + Math.pow(y - spawnUnits[i].getY(), 2));
			if(curDist < smallestDist)
			{
				smallestDist = curDist;
				closestID = spawnUnits[i].getID();
			}
		}
		return closestID;
	}

	function findByID(ID)
	{
		for(var i = 0; i < spawnUnits.length; i++)
		{
			if(spawnUnits[i] != null && spawnUnits[i].getID() === ID)
			{
				spawnUnits[i] = null;
				enemyQueue.enqueue(i);
				enemyCount--;
			}
		}
	}

	function resetQueue()
	{
		enemyQueue = new Queue();
		for(var i = 0; i < maxEnemy; i++)
		{
			enemyQueue.enqueue(i);
		} 
	}

	Array.prototype.clean = function(deleteValue) 
	{
  		for (var i = 0; i < this.length; i++) 
  		{
    		if (this[i] == deleteValue) 
    		{         
    	  		this.splice(i, 1);
      			i--;
    		}
  		}
  		return this;
	};

	main();
})