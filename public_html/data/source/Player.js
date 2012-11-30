function Player (playerGroup, x, y) {
	this.characterInit(x, y);
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.playerGroup = playerGroup; 
	this.colour = '#FFFFFF';
	
	this.status = Player.STATUS_ALIVE;
	
	this.health = 100;
	
	this.render();
}

Player.inherits(Character);

// Static
Player.STATUS_ALIVE = 'STATUS_ALIVE';
Player.STATUS_DEAD = 'STATUS_DEAD';

Player.method('tick', function (active) {
	this.processMoveQueue();
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
		this.colour = '#FFFF00'; 		
	} else {
		this.playerGroup.setActive(null);
		this.colour = '#FFFFFF'; 		
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

Player.method('onClick', function () { 
	var active = this.playerGroup.getActive() === this;
	this.setActive(!active);	
});

Player.method('onMouseOver', function () { 
	if (this.playerGroup.getActive() !== this) {
		this.colour = '#555555'; 
		this.render();
	}
});

Player.method('onMouseOut', function () { 
	if (this.playerGroup.getActive() !== this) {
		this.colour = '#FFFFFF'; 
		this.render();
	}
});
