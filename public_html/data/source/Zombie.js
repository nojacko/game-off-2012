function Zombie (zombieGroup, x, y) {
	this.characterInit(x, y);
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.speed = 2.5;
	this.colour = '#006600';
	
	this.lastAction = 0;
	this.actionInterval = 2;
	
	this.targetPlayer = null;
	this.targetBlock = null;

	this.health = 100;
	this.attackRange = GAME.level.map.blockSize*2;
	this.attackHp = 20;
	
	this.zombieGroup = zombieGroup;

	this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y);
	
	this.render();
}

Zombie.inherits(Character);

// Static
Zombie.STATUS_IDLE = 'STATUS_IDLE';
Zombie.STATUS_WANDERING = 'STATUS_WANDERING';
Zombie.STATUS_ATTACK = 'STATUS_ATTACK';
Zombie.STATUS_DEAD = 'STATUS_DEAD';


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
				this.targetPlayer.damage(this.attackHp);
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

Zombie.method('damage', function (hp) {
	this.health -= hp;
	
	GAME.debug ? console.log('zombie damanged - health: ' + this.health) : null;
	
	if (this.health <= 0) {
		// Score
		GAME.level.score.score += (10 + GAME.level.score.level-1);
		GAME.level.score.kills++;
		
		// Kill zombies
		this.zombieGroup.removeZombie(this);
		this.status = Zombie.STATUS_DEAD;
		GAME.debug ? console.log('zombie dead') : null;
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