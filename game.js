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

	//player
	var player;
	var playerStartX = 5;
	var playerStartY = 3;
	var playerWidth = 5;
	var playerHeight = 5;
	var playerSpeed = 1;
	var playerStartDir = 2; //south
	

	//Game state variables
	var levelCount = 1;
	var deathCount = 0;
	var speedCap = 5;
	var firstRound = true;
	function main()
	{
		player = new Player(playerStartDir, playerStartX, playerStartY, playerWidth, playerHeight, playerSpeed);
		drawMazeAndCharacter(playerStartX, playerStartY);
		$("#level_count").text("Level: " + levelCount);
		$("#death_count").text("Death count: " + deathCount);
		window.addEventListener("keydown", moveCharacter, true);
		loop();
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
		console.log(playerSpeed);
		if(loaded)
		{
			//alert(mazeWidth);
			updateMovement(player.getDirection());
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
	    img.onload = function() 
	    { // when the image is loaded, draw the image and the character
			context.drawImage(img, 0, 0);
			drawCharacter(playerX, playerY);
			mazeHeight = this.height;
			mazeWidth = this.width;
			loaded = true;
		};
		img.src = "maze.png";
	}

	function drawCharacter(x, y)
	{
		restoreBackground(x, y);
		player.setX(x);
		player.setY(y);
		context.fillStyle = "red";
		context.fillRect(x,y, player.getWidth(), player.getHeight());
		context.beginPath();
		context.rect(x,y,100,100);
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

	function updateMovement(direction)
	{
		restoreBackground(player.getX(), player.getY());
		switch(direction)
		{
			case 0: player.moveNorth();
					break;
			case 1: player.moveEast();
					break;
			case 2: player.moveSouth();
					break;
			case 3: player.moveWest();
					break;
		}
		if(!detectCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight()))
		{
			drawCharacter(player.getX(), player.getY(), "#0000FF");
		}
		else if(victory)
		{
			victoryScreen();
		}
		else
		{
			player.stop();
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
	        	break;
	        case 37: // arrow left key
	        case 65: // A key
			    player.moveWest();
			    break;
		    case 40: // arrow down key
		    case 83: // S key
		    	player.moveSouth();
		        break;
		    case 39: // arrow right key
		    case 68: // D key
		        player.moveEast();
		        break;
		    default: return;
		}
		if(!detectCollision(player.getX(), player.getY(), player.getWidth(), player.getHeight()))
		{
			drawCharacter(player.getX(), player.getY(), "#0000FF");
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
		player.setX(5);
		player.setY(5);
		player.setDirection(2);
		deathCount++;
		if(playerSpeed > 1)
		{
			playerSpeed--;
			player.setSpeed(playerSpeed);
		}
		$("#death_count").text("Death count: " + deathCount);
		drawCharacter(player.getX(), player.getY(), "#0000FF");
	}

	function detectCollision(nextX, nextY, width, height)
	{

		var imgData = context.getImageData(nextX, nextY, width, height);
		var data = imgData.data;
		var finish = false;
		for(var i = 0; i < 4 * width * height; i +=4)
		{
			//console.log(data[i] + ", " + data[i + 1] + ", " + data[i+ 2]);
			if(data[i] === 0 && data[i+1] === 153 && data[i+2] === 0)
			{
				return true;
			}
			else if((firstRound && data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0)
				|| (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255))
			{
				finish = true;
				break;
			}
		}
		if(finish)
		{
			player.stop();
			victory = true;
			return true;
			
		}
		return false;
	}

	function victoryScreen()
	{
		firstRound = false;
		clearScreen(0, 0, canvas.width, canvas.height);
		levelCount++;
		$("#level_count").text("Level: " + levelCount);
		context.font = "40px Arial";
		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText("You win!", canvas.width/2, canvas.height/2);
		context.fillText("Please space to continue", canvas.width/2, canvas.height/2 + 60);
		window.removeEventListener("keydown", moveCharacter, true);
		$(window).keypress(function(e)
		{
			if(e.which === 32)
			{
				$(window).unbind("keypress")
				clearScreen(0, 0, canvas.width, canvas.height);
				victory = false;
				loaded = false;
				if(playerSpeed < speedCap)
				{
					playerSpeed++;
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
		context.fillStyle = "white";
		context.fill();
	}

	main();
})