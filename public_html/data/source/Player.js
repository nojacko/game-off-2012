(function(window) {

	function Player (playerGroup, x, y) {
		this.initialize();	
		
		this.playerGroup = playerGroup; 
		this.moveQueue = [];
  
		// Shape
		this.x = x*GAME.level.map.blockSize;
		this.y = y*GAME.level.map.blockSize;
		this.snapToPixel = true;
		
		// Player
		this.colour = '#FFFFFF';
		
		this.render();
	}
	
	Player.prototype = new Character();
	
	// Properties
	Player.prototype.playerGroup 	= null;
	Player.prototype.colour 		= null;
	
	// Methods
	Player.prototype.setActive = function (active)
	{
		if (active) {
			this.playerGroup.setActive(this);
			this.colour = '#FFFF00'; 		
		} else {
			this.playerGroup.setActive(null);
			this.colour = '#FFFFFF'; 		
		}
		this.render();
	}
	
	Player.prototype.render = function () 
	{ 
		this.graphics.clear();
		this.graphics.beginFill(this.colour).drawCircle(
			GAME.level.map.blockSize/2, 
			GAME.level.map.blockSize/2, 
			GAME.level.map.blockSize/3
		);
	}
	
	Player.prototype.onClick = function () 
	{ 
		var active = this.playerGroup.getActive() === this;
		this.setActive(!active);
	}
	
	Player.prototype.onMouseOver = function ()
	{ 
		if (this.playerGroup.getActive() !== this) {
			this.colour = '#555555'; 
			this.render();
		}
	}
	Player.prototype.onMouseOut = function () 
	{ 
		if (this.playerGroup.getActive() !== this) {
			this.colour = '#FFFFFF'; 
			this.render();
		}
	}

	window.Player = Player;

}(window));