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

ZombieGroup.method('getRandomSpawnBlock', function(player) {
	var spawnBlock = null;
	var spawnBlocks = _.shuffle(GAME.level.map.grid.getAllBlocksByProperty('id', 2));
	
	do {
		spawnBlock = spawnBlocks.shift();
		
		if (GAME.level.objectAtBlock(spawnBlock) === null) {
			break;				
		}
		spawnBlock = null;
	} while (spawnBlocks.length > 0 && spawnBlock === null) 
	
	return spawnBlock;
});

ZombieGroup.method('getNearestEntranceBlock', function(block) {
	var blocks = GAME.level.map.grid.getAllBlocksByProperty('id', 3);
	return GAME.level.map.grid.blockNearestToBlock(block, blocks);
});
