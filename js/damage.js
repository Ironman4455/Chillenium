
class Rect
{
	constructor(x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}


class PlayerAttackBoxes
{
	constructor (x, y, w, h, x2, y2, w2, h2)
	{
		this.LeftRect = new Rect(x,y,w,h);
		this.RightRect = new Rect(x2,y2,w2,h2);
	}
	
	check_collisions(enemyList, mirrored)
	{
		for(var i = 0; i < enemyList.length; i++)
		{
			if (mirrored == false)
			{
				this.Rect1 = this.RightRect;
			}
			else 
			{
				this.Rect1 = this.LeftRect;
			}
			this.Rect2 = enemyList[i].hitbox.hitbox;
			/*
			console.log(this.Rect1.x)
			console.log(this.Rect1.y)
			console.log(this.Rect1.w)
			console.log(this.Rect1.h)
			console.log(this.Rect2.x)
			console.log(this.Rect2.y)
			console.log(this.Rect2.w)
			console.log(this.Rect2.h)
			*/
			console.log(this.Rect2)
			
			if ((this.Rect1.x < this.Rect2.x + this.Rect2.w) &&
				(this.Rect1.x + this.Rect1.w > this.Rect2.x) &&
				(this.Rect1.y < this.Rect2.y + this.Rect2.h) &&
				(this.Rect1.y + this.Rect1.h > this.Rect2.y))
				{
					// deal damage to enemy...
					console.log("collision detected! ... \n");
					enemyList[i].isAlive = false;
				}
		}
	}
}

class Hit_Box
{
	constructor (x,y,w,h)
	{
		this.hitbox = new Rect(x,y,w,h);
	}
	
	translate(x,y)
	{
		this.hitbox.x = x;
		this.hitbox.y = y;
	}
}
