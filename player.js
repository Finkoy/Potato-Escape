function Player(direction, x, y, width, height, speed)
{
	//Game character variables.
	this.charPosX = x;
	this.charPosY = y;
	this.width = width;
	this.height = height;
	this.direction = direction;
	this.speed = speed;
	this.bullets = [];

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

	this.shoot = function()
	{
		var startX;
		var startY;
		var projSpeed = 2;
		var radius = 2;
		var maxDist = 1000;
		switch(this.direction)
		{
			case 0: 
				startX = this.charPosX + this.width/2;
				startY = this.charPosY - this.height;
				break;
			case 1:
				startX = this.charPosX + 2 * this.width;
				startY = this.charPosY + this.height/2;
				break;
			case 2:
				startX = this.charPosX + this.width/2;
				startY = this.charPosY + 2 * this.height;
				break;
			case 3:
				startX = this.charPosX - this.width;
				startY = this.charPosY + this.height/2;
				break;
			default: break;
		}
		var proj = new Projectile(startX, startY, this.direction, projSpeed, radius, maxDist);
		this.bullets.push(proj);
	}

	this.getBullets = function()
	{
		return this.bullets;
	}

	this.checkBullets = function()
	{
		if(this.bullets.length === 0) return;
		if(!this.bullets[0].isAlive())
		{
			this.bullets.shift();
		}
	}

	this.despawnBullets = function()
	{
		this.bullets = [];
	}
}