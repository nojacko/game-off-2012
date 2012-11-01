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
	Player.prototype.currentBlock	= null;
	
	// Methods
	Player.prototype.tick = function () 
	{
		if (this.moveTarget === null && this.moveQueue.length > 0) {
			// Check target isn't occupied 
			var target = this.moveQueue[0];
			var occupied = this.playerGroup.playerAtBlock(target, this) !== null;
		
			// if occupied, attempt to move around target
			if (occupied) {
				// Test alternative routes
				var col, row = 0;
				var blocksToCheck = [];
				
				if (this.currentBlock.row == target.row) {
					col = (target.col > this.currentBlock.col) ? +1 : -1;
					row = this.currentBlock.row; 
					blocksToCheck[0] = [
						this.game.map.grid.gridToBlock(row-1, this.currentBlock.col), 
						this.game.map.grid.gridToBlock(row-1, this.currentBlock.col+col),
						this.game.map.grid.gridToBlock(row-1, this.currentBlock.col+col*2)
					];
					blocksToCheck[1] = [
						this.game.map.grid.gridToBlock(row+1, this.currentBlock.col), 
						this.game.map.grid.gridToBlock(row+1, this.currentBlock.col+col),
						this.game.map.grid.gridToBlock(row+1, this.currentBlock.col+col*2) 
					];
				}
				
				if (this.currentBlock.col == target.col) {
					col = this.currentBlock.col; 
					row = (target.row > this.currentBlock.row) ? +1 : -1;
					blocksToCheck[0] = [
						this.game.map.grid.gridToBlock(this.currentBlock.row, col-1), 
						this.game.map.grid.gridToBlock(this.currentBlock.row+row, col-1),
						this.game.map.grid.gridToBlock(this.currentBlock.row+row*2, col-1)
					];
					blocksToCheck[1] = [
						this.game.map.grid.gridToBlock(this.currentBlock.row, col+1), 
						this.game.map.grid.gridToBlock(this.currentBlock.row+row, col+1),
						this.game.map.grid.gridToBlock(this.currentBlock.row+row*2, col+1) 
					];
				}
				
				// Shuffle to prevent always going the same way
				blocksToCheck.shuffle();
				
				// Check Blocks
				var pathOK = false;
				for (var i in blocksToCheck) {
					if (
						this.playerGroup.playerAtBlock(blocksToCheck[i][0], this) === null &&
						this.playerGroup.playerAtBlock(blocksToCheck[i][1], this) === null
					) {
						pathOK = true;
						break;
					}						
				}
				
				if (pathOK) {
					this.moveQueue.shift(); // Remove occupied block
					
					// Add additional to path to queue
					while (blocksToCheck[i].length > 0) {
						this.moveQueue.unshift(blocksToCheck[i].pop());
					}
					this.moveTarget = this.moveQueue.shift();
					
				} else {
					// Stop moving
					this.moveTarget = null;
					this.moveQueue = [];
				}
			} else {
				this.moveTarget = this.moveQueue.shift();
			}
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
		this.currentBlock = this.game.map.grid.coordsToBlock(this.x, this.y);
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