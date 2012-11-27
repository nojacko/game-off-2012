function Character () {
}

// Pseudo-constructor
Character.method('characterInit', function (x, y) {
	this.x = 0
	this.y = 0
	this.moveTarget = null;
	this.moveQueue = [];
	this.speed = 5; // Blocks per second
	this.currentBlock = null;
	
	// CreateJS Shape
	this.shape = new createjs.Shape();
	this.shape.initialize();		
	this.shape.snapToPixel = true;
});

Character.method('processMoveQueue', function () {
	if (this.moveTarget === null && this.moveQueue.length > 0 && this.moveQueue[0].length > 0) {
		// Check target isn't occupied 
		this.moveTarget = this.moveQueue[0].shift();
	
		// if occupied, attempt to move around target
		if (GAME.level.objectAtBlock(this.moveTarget, this) !== null) {				
			this.removeOccupiedNodesFromPath();
			
			if (typeof this.moveQueue[0] === 'undefined' || this.moveQueue[0].first() === null) {
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
		var moveDistance = (this.speed*GAME.frameTime*GAME.level.map.blockSize)/this.currentBlock.cost;
		
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
	
	
	this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y)
	this.shape.x = this.x;
	this.shape.y = this.y;
});

Character.method('removeOccupiedNodesFromPath', function () {
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
	
	// Clean deleted values
	this.moveQueue = _.compact(this.moveQueue); 
});

Character.method('addPath', function (path) {
	if (path.length > 0) {
		this.moveQueue.push(path);
	}
});

Character.method('getFinalDestination', function () {	
	if (this.moveQueue.last() !== null && this.moveQueue.last().last() !== null) {
		return this.moveQueue.last().last();
	} else if (this.moveTarget !== null) {
		return this.moveTarget;
	}
	return this.currentBlock;
});
