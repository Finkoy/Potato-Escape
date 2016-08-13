function Projectile(startX, startY, dir, speed, radius, maxDist)
{
	this.x = startX;
	this.y = startY;
	this.direction = dir;
	this.speed = speed;
	this.radius = radius;
	this.distance = 0;
	this.alive = true;

	/**
	 * This function is used when the player shoots
	 */
	this.move = function()
	{
		if(this.direction === 0)
		{
			this.y -= this.speed;
		}
		else if(this.direction === 1)
		{
			this.x += this.speed;
		}
		else if(this.direction === 2)
		{
			this.y += this.speed;
		}
		else
		{
			this.x -= this.speed;
		}
	}

	this.setX = function(xPos)
	{
		this.x = xPos;
	}

	this.setY = function(yPos)
	{
		this.y = yPos;
	}

	this.getX = function()
	{
		return this.x;
	}

	this.getY = function()
	{
		return this.y;
	}

	this.getRadius = function()
	{
		return this.radius;
	}

	this.ricochet = function()
	{
		if(this.direction === 0)
		{
			this.direction = 2;
		}
		else if(this.direction === 1)
		{
			this.direction = 3;
		}
		else if(this.direction === 2)
		{
			this.direction = 0;
		}
		else
		{
			this.direction = 1;
		}
	}

	this.updateTraveled = function()
	{
		this.distance++;
		if(this.distance >= maxDist)
		{
			this.alive = false;
		}
	}

	this.hitUnit = function(yes)
	{
		if(yes)
		{
			this.alive = false;
		}
	}

	this.isAlive = function()
	{
		return this.alive;
	}
}