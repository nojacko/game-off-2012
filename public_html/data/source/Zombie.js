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
	
	this.attackRange = GAME.level.map.blockSize*2;
	this.damage = 20;
	
	this.zombieGroup = zombieGroup;
	
	this.render();
}

Zombie.inherits(Character);

// Static
Zombie.STATUS_IDLE = 'STATUS_IDLE';
Zombie.STATUS_WANDERING = 'STATUS_WANDERING';
Zombie.STATUS_ATTACK = 'STATUS_ATTACK';


Zombie.method('tick', function (active) {	
	var actionOk = this.lastAction < (microtime() - this.actionInterval);
	
	this.status = Zombie.STATUS_WANDERING;
	
	// Is player in range
	if (actionOk && this.targetPlayer !== null) {		
		var distanceToPlayer = Math.distanceBetweenObjs(this.targetPlayer.currentBlock, this.currentBlock);
		if (distanceToPlayer < this.attackRange) {
			this.status = Zombie.STATUS_ATTACKING;
		} 
	}
	
	switch (this.status) {
		case Zombie.STATUS_ATTACKING:
			if (actionOk) {		
				this.targetPlayer.damage(this.damage);
				if (this.targetPlayer.status === Player.STATUS_DEAD) {
					this.targetPlayer = null;
				}
			}
			break;
		case Zombie.STATUS_WANDERING:
		default: 
			// Move to nearest player
			if (actionOk) {
				this.followPlayer();
			} 				
			this.processMoveQueue(); 
	} 
	
	// If action could have happened update last action
	if (actionOk) {
		this.lastAction	= microtime();
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
		if (route && this.targetPlayer !== null) { 
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