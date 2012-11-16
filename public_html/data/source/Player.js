function Player (playerGroup, x, y) {
	this.characterInit(x, y);
	
	this.x = x*GAME.level.map.blockSize;
	this.y = y*GAME.level.map.blockSize;
	
	this.playerGroup = playerGroup; 
	this.colour = '#FFFFFF';
	
	this.render();
}

Player.inherits(Character);

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
		GAME.level.map.blockSize/3
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
