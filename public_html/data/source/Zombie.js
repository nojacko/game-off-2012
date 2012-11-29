function Zombie (zombieGroup, x, y) {
	this.characterInit(x, y);
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.speed = 2.5;
	this.colour = '#33CC33';
	
	this.lastAction = 0;
	this.actionInterval = 1;
	
	this.targetPlayer = null;
	this.targetBlock = null;
	
	this.zombieGroup = zombieGroup;
	
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
		switch (this.status) {
			case Zombie.STATUS_WANDERING:
				var foundPlayer = false;
				// Move to nearest player
				if (this.lastAction < (microtime() - this.actionInterval)) {
					this.followPlayer();
					this.lastAction	= microtime()
				} 
				
				this.processMoveQueue(); 
				break;
			default: 	
				// Move to nearest player
			if (this.lastAction < (microtime() - this.actionInterval)) {
					this.followPlayer();
					this.lastAction	= microtime()
				}	
				break;
		} 
		
		// Status
		if (this.moveQueue.length > 0 || this.moveTarget !== null) {
			this.status = Zombie.STATUS_WANDERING;
		} else {
			this.status = Zombie.STATUS_IDLE;
		}
	}
});

Zombie.method('followPlayer', function () { 
	var route = false;
	if (this.currentBlock !== null) { 
		// Reroute if player has moved
		var nearestPlayer = GAME.level.playerGroup.playerNearestToBlock(this.currentBlock);
		
		// Change target if other player closer
		if (nearestPlayer !== this.targetPlayer) {
			this.targetPlayer = nearestPlayer;
			route = true;
		} else if (this.targetPlayer !== null && this.targetBlock !== this.targetPlayer.currentBlock) {
			route = true;			
		}
		
		// Route
		if (route) { 
			var path = GAME.level.map.grid.shortestPath(this.currentBlock.node, this.targetPlayer.currentBlock.node);
			if (path.length > 0) {
				this.stop();
				this.addPath(path);	
				this.targetBlock = this.targetPlayer.currentBlock;
			}
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