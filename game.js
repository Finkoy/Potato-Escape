$(document).ready(function()
{	
	//Setup variables.
	var canvas;
	var context;
	var img;

	//Maze information variables.
	var mazeHeight;
	var mazeWidth;
	var victory = false;

	//player
	var player;
	var playerStartX = 5;
	var playerStartY = 3;
	//Game state variables
	var frames;
	var loaded = false;
	var requestID;
	function main()
	{
		player = new Player(2, playerStartX, playerStartY, 5, 5);
		drawMazeAndCharacter(playerStartX, playerStartY);

		frames = 0;
		window.addEventListener("keydown", moveCharacter, true);

		init();
		loop();
	}

	function init()
	{
		/*TODO: Initialize game state information*/
	}

	function loop()
	{
		update();
		if(!victory)
		{
			requestID = requestAnimationFrame(loop, canvas);
		}
	}

	function update()
	{
		frames++;
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
		drawCharacter(player.getX(), player.getY(), "#0000FF");
	}

	function detectCollision(nextX, nextY, width, height)
	{

		var imgData = context.getImageData(nextX, nextY, width, height);
		var data = imgData.data;
		var finish = false;
		for(var i = 0; i < 4 * width * height; i +=4)
		{
			if(data[i] === 0 && data[i+1] === 153 && data[i+2] === 0)
			{
				return true;
			}
			else if((data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0)
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
		clearScreen(0, 0, canvas.width, canvas.height);
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