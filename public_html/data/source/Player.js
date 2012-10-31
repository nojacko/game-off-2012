(function(window) {

	function Player (game, playerGroup, x, y) {
		this.initialize();	
		
		this.game = game; 
		this.playerGroup = playerGroup; 
		this.moveQueue = [];
  
		// Shape
		this.x = x*this.game.map.blockSize;
		this.y = y*this.game.map.blockSize;
		this.snapToPixel = true;
		
		// Player
		this.colour = '#FFFFFF';
		
		this.render();
	}
	
	Player.prototype = new createjs.Shape();
	
	// Properties
	Player.prototype.game			= null;
	Player.prototype.playerGroup 	= null;
	Player.prototype.colour 		= null;
	Player.prototype.moveTarget		= null;
	Player.prototype.moveQueue		= [];
	Player.prototype.speed			= 5; // Blocks per second
	
	// Methods
	Player.prototype.tick = function () 
	{
		if (this.moveTarget === null && this.moveQueue.length > 0) {
			this.moveTarget = this.moveQueue.shift();
		}
		
		if (this.moveTarget !== null) {	
			var distance = Math.distanceBetweenObjs(this, this.moveTarget);
			var moveDistance = this.speed*this.game.frameTime*this.game.map.blockSize;
			
			if (distance < moveDistance) {
				// Finish movement
				this.x = this.moveTarget.x;
				this.y = this.moveTarget.y;
				this.moveTarget = null;
			} else {
				var angleToTarget = Math.angleBetweenObjs(this, this.moveTarget);
				var rads = Math.toRadian(angleToTarget)
				this.x += Math.sin(rads) * moveDistance
				this.y += -Math.cos(rads) * moveDistance	
			}			
		}
	}
	
	Player.prototype.moveTo = function (block) 
	{		
		this.moveQueue.push(block);
	}	
	
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
			this.game.map.blockSize/2, 
			this.game.map.blockSize/2, 
			this.game.map.blockSize/3
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