function Player (playerGroup, x, y) {
	this.characterInit(x, y);
	
	this.id = Player.getNextId();
	this.name = (this.id == 1) ? 'You' : 'Clone #' + this.id;
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.playerGroup = playerGroup; 
	this.colour = '#003399';
	this.colourDefault = '#003399';
	this.colourHover = '#FF6600';
	this.colourActive = '#FF6600';
	
	this.status = Player.STATUS_ALIVE;

	this.lastAction = 0;
	this.actionInterval = 1;
	
	this.health = 100;
	this.attackRange = GAME.level.map.blockSize*2;
	this.attackHp = 50;

	this.ammo = 25;
	this.maxAmmo = 50;
	this.shootingRange = GAME.level.map.blockSize*20;
	
	this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y);
	
	this.render();
}

Player.inherits(Character);


// Static
Player.NEXT_ID = 1;
Player.STATUS_ALIVE = 'STATUS_ALIVE';
Player.STATUS_DEAD = 'STATUS_DEAD';

Player.getNextId = function () {
	return Player.NEXT_ID++;
}

Player.method('tick', function (active) {	
	var actionOk = this.lastAction < (microtime() - this.actionInterval);
	
	// Attack a zombie
	if (actionOk) {
		var nearestZombie = GAME.level.zombieGroup.zombieNearestToBlock(this.currentBlock);
		if (nearestZombie !== null) {
			var distanceToPlayer = Math.distanceBetweenObjs(nearestZombie.currentBlock, this.currentBlock);
			
			if (distanceToPlayer !== null) { 
				if (distanceToPlayer < this.attackRange) {
					// Meelee
					nearestZombie.damage(this.attackHp);
				} else if (distanceToPlayer < this.shootingRange) {
					// Fire bullet
					if (this.ammo > 0) {
						
						// Is there direct line of sight?
						if (GAME.level.isDirectPathToBlock(this.currentBlock, nearestZombie.currentBlock)) {
							this.ammo--;
							
							var angleToTarget = Math.angleBetweenObjs(this, nearestZombie);	
							GAME.level.bulletGroup.fireBullet(this.x, this.y, angleToTarget);
						}
					}
				}
			}
		}
	}
	
	this.processMoveQueue();
	
	// If action could have happened update last action
	if (actionOk) {
		this.lastAction	= microtime();
	}
	
	// Refills
	if (this.currentBlock.id == 7) {
		this.ammo = this.maxAmmo;
	}
	if (this.currentBlock.id == 8) {
		this.health = 100;
	}
});

Player.method('damage', function (hp) {
	this.health -= hp;
	
	GAME.debug ? console.log('player damanged - health: ' + this.health) : null;
	
	if (this.health <= 0) {
		this.playerGroup.removePlayer(this);
		this.status = Player.STATUS_DEAD;
		GAME.debug ? console.log('player dead') : null;
	}
});

Player.method('setActive', function (active) {
	if (active) {
		this.playerGroup.setActive(this);
		this.colour = this.colourActive; 		
	} else {
		this.playerGroup.setActive(null);
		this.colour = this.colourDefault;		
	}
	this.render();
});

Player.method('render', function () { 
	this.shape.graphics.clear();
	this.shape.graphics.beginFill(this.colour).drawCircle(
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/2
	);
});

Player.method('isActive', function () { 
	return this.playerGroup.getActive() === this;
});

Player.method('onClick', function () { 
	var active = this.isActive();
	this.setActive(!active);
	return !active;
});

Player.method('onMouseOver', function () { 
	if (this.playerGroup.getActive() !== this) {
		this.colour = this.colourHover;
		this.render();
	}
});

Player.method('onMouseOut', function () { 
	if (this.playerGroup.getActive() !== this) {
		this.colour = this.colourDefault;
		this.render();
	}
});
