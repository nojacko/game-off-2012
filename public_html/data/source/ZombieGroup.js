function ZombieGroup () 
{
	this.spawnInterval = 5;
	this.lastSpawnedTime = 0; // microtime();
	
	this.zombies = [];
}

ZombieGroup.method('tick', function() {	
	// Spawn new zombie 	
	if (this.lastSpawnedTime < (microtime() - this.spawnInterval)) {
		var spawnBlock = this.getRandomSpawnBlock();
		
		// Spawn, or wait 1 second.
		if (spawnBlock !== null) {
			// Create zombie
			var index = this.zombies.length;
			this.zombies[index] = new Zombie(this, spawnBlock.col, spawnBlock.row);
			GAME.stage.addChild(this.zombies[index].shape);
			GAME.level.addObject(this.zombies[index]);
			
			// Route it to nearest entrance point
			var nearestEntrance = this.getNearestEntranceBlock(spawnBlock);
			var path = GAME.level.map.grid.shortestPath(spawnBlock.node, nearestEntrance.node);
			this.zombies[index].addPath(path);			
			
			this.lastSpawnedTime = microtime(); // 1 sec
		} else {
			this.lastSpawnedTime += 1000; // 1 sec
		}
	}
	
	// Call zombies' tick() method
	this.zombiesIdle = [];
	for (var i in this.zombies) {
		this.zombies[i].tick();
	}
});

ZombieGroup.method('removeZombie', function(zombie) {
	for (var i in this.zombies) {
		if (this.zombies[i] === zombie) {
			GAME.level.removeObject(this.zombies[i]);
			delete this.zombies[i];
			delete zombie;
		}
	}
	
	this.zombies = _.compact(this.zombies); 
});

ZombieGroup.method('getRandomSpawnBlock', function() {
	var spawnBlocks = _.shuffle(GAME.level.map.grid.getAllBlocksByProperty('id', 2));
	return GAME.level.getRandomBlock(spawnBlocks, true)
});

ZombieGroup.method('getNearestEntranceBlock', function(block) {
	var blocks = GAME.level.map.grid.getAllBlocksByProperty('id', 3);
	return GAME.level.map.grid.blockNearestToBlock(block, blocks);
});

ZombieGroup.method('zombieNearestToBlock', function(block) {
	var shortestDistance = Infinity;
	var nearest = null;
	
	for (var i in this.zombies) {
		var distance = Math.distanceBetweenObjs(this.zombies[i].currentBlock, block);
		
		if (distance < shortestDistance) {
			shortestDistance = distance;
			nearest = this.zombies[i];
		}
	}
	
	return nearest;
});