
class Scissor_Minion
{
	constructor(index, gl, vs, fs)
	{
		this.index = index;
		this.pos = new Point(130, 88);
		this.frame = new Point();
		this.isAlive = true;
		this.isGone = false;
		this.count = 0;
		
		this.walk = new Sprite(gl, "img/scissor_minion_move.png", vs, fs, {width:8, height:8});
		this.idle = new Sprite(gl, "img/scissor_minion_idle.png", vs, fs, {width:8, height:8});
		this.pew = new Sprite(gl, "img/small_death.png", vs, fs, {width: 16, height: 16});
		this.hitbox = new Hit_Box(this.pos.x + 2, this.pos.y + 2, 4, 4);
		
		this.curr = this.idle;
		this.currNum = 1;
		this.mirrored = -1;
		
		this.healthbar = new Sprite (gl, "img/healthbar.png", vs, fs, {width: 14, height: 6});
		this.health_frame = new Point();
		this.health_pos = new Point();
	}
	
	update()
	{	
	
	if (this.health_frame.y >= 10)
		this.isAlive = false;
	
	if (this.isAlive == true)
	{
		this.curr = this.idle;
		this.currNum = 1;
		
		if(Math.abs(100-this.pos.x) < 128) { // instead of 35 you subtract 27 bc need from mid of character
			if(((73) < this.pos.x && this.mirrored == -1) || 127<=this.pos.x) {
				this.movement(-1);
			}
			if(((127) > this.pos.x && this.mirrored == 1) || 73>=this.pos.x) 
			{	
				this.movement(1);
			}
		} else {
			this.movement(0);
		}
				
		this.render();
	}
	else 
	{
		this.curr = this.pew;
		this.currNum = 2;
		if (this.isGone == false)
		{
			this.render();
			this.count++;
			
			if (this.count >= 12)
			{
				this.isGone = true;
			}
		}
	}
	}
	
	deal_damage(points)
	{
		console.log("hit!");
		this.health_frame.y += points;
	}

	
	movement(num)
	{	
		if (num == 0)
		{
		}
		if (num == -1) //move left
		{
			this.curr = this.walk;
			this.currNum = 0;
			if (this.mirrored == 1)
			{
				this.pos.x += 10;
			}
			this.mirrored = -1;
			this.pos.x-=.5;
		}
		if (num == 1) // move right	
		{
			this.curr = this.walk;
			this.currNum = 0;
			if (this.mirrored == -1)
			{
				this.pos.x -= 10;
			}
			this.mirrored = 1;
			this.pos.x+=.5;
		}
		
		this.hitbox.translate(this.pos.x + 2, this.pos.y + 2);
		
		if (this.mirrored == -1)
			this.health_pos.x = this.pos.x - 10;
		else
			this.health_pos.x = this.pos.x - 3;
		this.health_pos.y = this.pos.y -10;
	}
	
	render()
	{	
	
		this.frame.x = ( new Date() * this.index.s_f_s[this.currNum][1]) % this.index.s_f_s[this.currNum][0];
		this.curr.render(this.pos, this.frame, this.mirrored);
		
		this.healthbar.render(this.health_pos, this.health_frame, 1);
	}
}


class Plane{
	constructor(index, gl, vs, fs)
	{
		this.index = index;
		this.pos = new Point(200, 20);
		this.frame = new Point();
		this.idle = new Sprite(gl, "img/paper_airplane.png", vs, fs, {width:16, height:16});
		this.pew = new Sprite(gl, "img/small_death.png", vs, fs, {width: 16, height: 16});
		this.hitbox = new Hit_Box(this.pos.x + 2, this.pos.y + 2, 12, 12);
		this.isAlive = true;
		this.isGone = false;
		this.count = 0;
		
		this.healthbar = new Sprite (gl, "img/healthbar.png", vs, fs, {width: 14, height: 6});
		this.health_frame = new Point();
		this.health_pos = new Point();
	}
	update()
	{	
	if (this.health_frame.y >= 10)
		this.isAlive = false;
	if (this.isAlive == true)
	{
		this.curr = this.idle;
		this.currNum = 0;
		if (this.pos.y >=80)
		{
			this.render();
			return 1;
		}
		else
		{
			if(Math.abs(100-this.pos.x) < 128) 
			{ // instead of 35 you subtract 27 bc need from mid of character
				if(((73) < this.pos.x && this.mirrored == -1) || 127<=this.pos.x)
				{
					this.movement(-1);
				}
				if(((127) > this.pos.x && this.mirrored == 1) || 73>=this.pos.x) 
				{	
					this.movement(1);
				}
			} 		
			else 
			{
				this.movement(-1);
			}
			this.render();
			return 0;
		}
	}
	else 
	{
		this.curr = this.pew;
		this.currNum = 2;
		if (this.isGone == false)
		{
			this.render();
			this.count++;
			
			if (this.count >= 12)
			{
				this.isGone = true;
			}
		}
	}
	}
	
	deal_damage(points)
	{
		console.log("hit!");
		this.health_frame.y += points;
	}
	
	movement(num)
	{	
	if(this.pos.y < 80){
		
		
		if (num == -1) //move left
		{
			this.curr = this.idle;
			this.currNum = 0;
			if (this.mirrored == -1)
			{
				this.pos.x -= 5;
			}
			this.mirrored = 1;
			this.pos.x-=.5;
			this.pos.y+=0.2;
		}
		if (num == 1) // move right	
		{
			this.curr = this.idle;
			this.currNum = 0;
			if (this.mirrored == 1)
			{
				this.pos.x += 5;
			}
			this.mirrored = -1;
			this.pos.y+=0.2;
			this.pos.x+=.5;
	}
		}
	else{
		this.currNum = 1;
		this.curr = this.idle
		
	}
	this.hitbox.translate(this.pos.x + 2, this.pos.y + 2);
	if (this.mirrored == -1)
			this.health_pos.x = this.pos.x - 15;
		else
			this.health_pos.x = this.pos.x + 3;
		this.health_pos.y = this.pos.y - 5;
	}
	render()
	{	
		this.frame.x = ( new Date() * this.index.s_f_s[this.currNum][1]) % this.index.s_f_s[this.currNum][0];
		this.curr.render(this.pos, this.frame, this.mirrored);
		
		this.healthbar.render(this.health_pos, this.health_frame, 1);
	}

}

class Pebble
{
	constructor(index, gl, vs, fs)
	{
		this.index = index;
		this.pos = new Point(140, 80);
		this.frame = new Point();
		this.isAlive = true;
		this.isGone = false;
		this.count = 0;
		
		this.walk = new Sprite(gl, "img/pebble_move.png", vs, fs, {width:16, height:16});
		this.idle = new Sprite(gl, "img/pebble_move.png", vs, fs, {width:16, height:16});
		this.pew = new Sprite(gl, "img/small_death.png", vs, fs, {width: 16, height: 16});
		this.hitbox = new Hit_Box(this.pos.x, this.pos.y, 8, 8);
		
		this.curr = this.idle;
		this.currNum = 1;
		this.mirrored = -1;
		
		this.healthbar = new Sprite (gl, "img/healthbar.png", vs, fs, {width: 14, height: 6});
		this.health_frame = new Point();
		this.health_pos = new Point();
	}
	
	update()
	{	
	if (this.health_frame.y >= 10)
		this.isAlive = false;
	if (this.isAlive == true)
	{
		this.curr = this.idle;
		this.currNum = 1;
		
		if(Math.abs(100-this.pos.x) < 128) { // instead of 35 you subtract 27 bc need from mid of character
			if(((73) < this.pos.x && this.mirrored == -1) || 127<=this.pos.x)
			{
				this.movement(-1);
			}
			if(((127) > this.pos.x && this.mirrored == 1) || 73>=this.pos.x) 
			{	
				this.movement(1);
			}
		} else {
			this.movement(0);
		}
		
		this.render();
	}
	else 
	{	
		this.curr = this.pew;
		this.currNum = 2;
		if (this.isGone == false)
		{
			this.render();
			this.count++;
			
			if (this.count >= 12)
			{
				this.isGone = true;
			}
		}
	}
	}
	
	deal_damage(points)
	{
		console.log("hit!");
		this.health_frame.y += points;
	}
	
	movement(num)
	{	
		if (num == 0)
		{
		}
		if (num == -1) //move left
		{
			this.curr = this.walk;
			this.currNum = 0;
			if (this.mirrored == 1)
			{
				this.pos.x += 15;
			}
			this.mirrored = -1;
			this.mirrored = -1;
			this.pos.x-=.5;
		}
		if (num == 1) // move right	
		{
			this.curr = this.walk;
			this.currNum = 0;
			if (this.mirrored == -1)
			{
				this.pos.x -= 15;
			}
			this.mirrored = -1;
			this.mirrored = 1;
			this.pos.x+=.5;
		}
		this.hitbox.translate(this.pos.x, this.pos.y);
		
		if (this.mirrored == -1)
			this.health_pos.x = this.pos.x - 15;
		else
			this.health_pos.x = this.pos.x + 1;
		this.health_pos.y = this.pos.y - 5;
	}
	
	render()
	{	
		this.frame.x = ( new Date() * this.index.s_f_s[this.currNum][1]) % this.index.s_f_s[this.currNum][0];
		this.curr.render(this.pos, this.frame, this.mirrored);
		
		this.healthbar.render(this.health_pos, this.health_frame, 1);
	}
}

class Boulder
{
	constructor(index, gl, vs, fs)
	{
		this.index = index;
		this.pos = new Point(485, 80);
		this.frame = new Point();
		this.isAlive = true;
		this.isGone = false;
		this.count = 0;

		
		this.attack = new Sprite(gl, "img/boulder_attack.png", vs, fs, {width:16, height:16});
		this.idle = new Sprite(gl, "img/boulder_idle.png", vs, fs, {width:16, height:16});
		this.pew = new Sprite(gl, "img/small_death.png", vs, fs, {width: 16, height: 16});
		this.hitbox = new Hit_Box(this.pos.x, this.pos.y, 16, 16);

		this.curr = this.idle;
		this.currNum = 1;
		this.mirrored = -1;
		
		this.healthbar = new Sprite (gl, "img/healthbar.png", vs, fs, {width: 14, height: 6});
		this.health_frame = new Point();
		this.health_pos = new Point();
	}
	
	update()
	{	
	if (this.health_frame.y >= 10)
		this.isAlive = false;
	if (this.isAlive == true)
	{
		this.curr = this.idle;
		this.currNum = 1;
		
		if(Math.abs(100-this.pos.x) < 384) { // instead of 35 you subtract 27 bc need from mid of character
			if(((50) < this.pos.x && this.mirrored == -1) || 150<=this.pos.x)
			{
				// this.movement(0);
				this.movement(-1);
			}
			if(((160) > this.pos.x && this.mirrored == 1) || 50>=this.pos.x)
			{	
				// this.movement(0);
				this.movement(1);
			}
		} else {
			this.movement(0);
		}

		this.render();
		
	}
	else 
	{	
		this.curr = this.pew;
		this.currNum = 2;
		if (this.isGone == false)
		{
			this.render();
			this.count++;
			
			if (this.count >= 12)
			{
				this.isGone = true;
			}
		}
	}
	}
	
	deal_damage(points)
	{
		console.log("hit!");
		this.health_frame.y += points;
	}
	
	movement(num)
	{	
		if (num == 0)
		{
		}
		if (num == -1) //move left
		{
			this.curr = this.attack;
			this.currNum = 0;
			this.mirrored = -1;
			this.pos.x--;
		}
		if (num == 1) // move right	
		{
			this.curr = this.attack;
			this.currNum = 0;
			this.mirrored = 1;
			this.pos.x++;
		}
		this.hitbox.translate(this.pos.x, this.pos.y);
		if (this.mirrored == -1)
			this.health_pos.x = this.pos.x - 10;
		else
			this.health_pos.x = this.pos.x - 3;
		this.health_pos.y = this.pos.y -10;
	}
	
	render()
	{	
		this.frame.x = ( new Date() * this.index.s_f_s[this.currNum][1]) % this.index.s_f_s[this.currNum][0];
		this.curr.render(this.pos, this.frame, this.mirrored);
		
		this.healthbar.render(this.health_pos, this.health_frame, 1);
	}
}