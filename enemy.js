function Enemy(x, y, width, height, speed, id)
{
	this.X = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.speed = speed;
	this.originalSpeed = this.speed;
	this.id = id;

	this.followPlayer = function(playerX, playerY)
	{
		if(this.x < playerX)
		{
			this.x += this.speed;
		}
		else if(this.x > playerX)
		{
			this.x -= this.speed;
		}
		if(this.y < playerY)
		{
			this.y += this.speed;
		}
		else if(this.y > playerY)
		{
			this.y -= this.speed;
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

	this.getWidth = function()
	{
		return this.width;
	}

	this.getHeight = function()
	{
		return this.height;
	}

	this.getID = function()
	{
		return this.id;
	}

	/**
	 * Note enemy can run throw walls as they are human, but their movespeed goes down
	 */
	this.blocked = function(isBlocked)
	{
		if(isBlocked)
		{
			this.speed = 0.01;
		}
		else
		{
			this.speed = this.originalSpeed;
		}
	}
}