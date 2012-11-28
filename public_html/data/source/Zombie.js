function Zombie (x, y) {
	this.characterInit(x, y);
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.speed = 1;
	this.colour = '#33CC33';
	
	this.render();
}

Zombie.inherits(Character);

// Static
Zombie.STATUS_IDLE = 'STATUS_IDLE';
Zombie.STATUS_WANDERING = 'STATUS_WANDERING';
Zombie.STATUS_ATTACK = 'STATUS_ATTACK';


Zombie.method('tick', function (active) {	
	// If player in range
	if (false) {
		this.status = Zombie.STATUS_ATTACK;
	} else 	{
		// Else, move
		this.processMoveQueue();
		
		// Status
		if (this.moveQueue.length > 0 || this.moveTarget !== null) {
			this.status = Zombie.STATUS_WANDERING;
		} else {
			this.status = Zombie.STATUS_IDLE;
		}
	}
});

Zombie.method('render', function () { 
	this.shape.graphics.clear();
	this.shape.graphics.beginFill(this.colour).drawCircle(
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/2
	);
});