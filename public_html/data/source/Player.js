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
	
	Player.prototype = new createjs.Shape();
	
	// Properties
	Player.prototype.playerGroup 	= null;
	Player.prototype.colour 		= null;
	Player.prototype.moveTarget		= null;
	Player.prototype.moveQueue		= [];
	Player.prototype.speed			= 5; // Blocks per second
	Player.prototype.currentBlock	= null;
	
	// Methods
	Player.prototype.tick = function () 
	{
		if (this.moveTarget === null && this.moveQueue.length > 0 && this.moveQueue[0].length > 0) {
			// Check target isn't occupied 
			this.moveTarget = this.moveQueue[0].shift();
		
			// if occupied, attempt to move around target
			if (GAME.level.objectAtBlock(this.moveTarget, this) !== null) {				
				this.removeOccupiedNodesFromPath();
				
				if (this.moveQueue[0].first() === null) {
					// Stop moving
					this.moveTarget = null;
				} else {
					// Reroute
					GAME.level.updateObjectsOnGrid(this);
					
					this.moveTarget = this.moveQueue[0].shift();						
					var path = GAME.level.map.grid.shortestPath(this.currentBlock.node, this.moveTarget.node, true);
						
					if (path.length == 0) {
						// Cannot find path, stop
						this.moveTarget = null;
						this.moveQueue = [];
					} else {
						// Push new path to start of queue
						this.moveQueue.unshift(path);
						this.moveTarget = this.moveQueue[0].shift();
					}
				} 
			}
		}
		
		if (this.moveTarget !== null) {	
			var distance = Math.distanceBetweenObjs(this, this.moveTarget);
			var moveDistance = this.speed*GAME.frameTime*GAME.level.map.blockSize;
			
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
			
			// Remove Empty Array
			if (this.moveQueue.length > 0 && this.moveQueue[0].last() === null) {
				this.moveQueue.shift();
			}
			
			// Clean deleted values
			this.moveQueue = _.compact(this.moveQueue); 
		}
		
		
		this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y);
	}
	
	Player.prototype.removeOccupiedNodesFromPath = function () 
	{
		var foundUnoccupied = false;
		for (var i in this.moveQueue) {
			while (this.moveQueue[i].first() !== null) {
				// Occuppied? 
				if (GAME.level.objectAtBlock(this.moveQueue[i].first(), this) !== null) {	
					// Yes, remove from queue
					this.moveQueue[i].shift();
				} else {
					// No, finish
					foundUnoccupied = true;
					break;
				}
			}
			
			// Remove empty
			if (this.moveQueue[i].length == 0) {
				delete this.moveQueue[i];
			}
			
			// Stop if unoccupied node found
			if (foundUnoccupied) {
				break;
			}
		}
	}
	
	Player.prototype.addPath = function (path) 
	{
		if (path.length > 0) {
			this.moveQueue.push(path);
		}
	}
	
	Player.prototype.moveTo = function (block) 
	{		
		this.moveQueue.push(block);
	}	
	
	Player.prototype.getFinalDestination = function () 
	{	
		if (this.moveQueue.last() !== null && this.moveQueue.last().last() !== null) {
			return this.moveQueue.last().last();
		} else if (this.moveTarget !== null) {
			return this.moveTarget;
		}
		return this.currentBlock;
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