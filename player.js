function Player(direction, x, y, width, height, speed)
{
	//Game character variables.
	this.charPosX = x;
	this.charPosY = y;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.speed = speed;

	this.moveNorth = function()
	{
		if(this.direction != 2)
		{
			this.direction = 0;
			this.charPosY-= this.speed;
		}
	}

	this.moveEast = function()
	{
		if(this.direction != 3)
		{
			this.direction = 1;
			this.charPosX+= this.speed;
		}
	}

	this.moveSouth = function()
	{
		if(this.direction != 0)
		{
			this.direction = 2;
			this.charPosY+= this.speed;
		}
	}

	this.moveWest = function()
	{
		if(this.direction != 1)
		{
			this.direction = 3;
			this.charPosX-= this.speed;
		}
	}

	/**
	 * Dummy test function
	 */
	this.stop = function()
	{
		if(this.direction === 0)
		{
			this.charPosY++;
		}
		else if(this.direction === 1)
		{
			this.charPosX--;
		}
		else if(this.direction === 2)
		{
			this.charPosY--;
		}
		else
		{
			this.charPosX++;
		}
	}

	this.getX = function()
	{
		return this.charPosX;
	}

	this.getY = function()
	{
		return this.charPosY;
	}

	this.getHeight = function()
	{
		return this.height;
	}

	this.getWidth = function()
	{
		return this.width;
	}

	this.getDirection = function()
	{
		return this.direction;
	}

	this.getSpeed = function()
	{
		return this.speed;
	}

	this.setX = function(x)
	{
		this.charPosX = x;
	}

	this.setY = function(y)
	{
		this.charPosY = y;
	}

	this.setDirection = function(dir)
	{
		this.direction = dir;
	}

	this.setSpeed = function(speed)
	{
		this.speed = speed;
	}
}