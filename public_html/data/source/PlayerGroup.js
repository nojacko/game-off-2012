function PlayerGroup () 
{
	this.players = [];
	this.activePlayer = null;
	this.maxPlayers = 5;
	
	this.spawnInterval = 30;
	this.lastSpawnedTime = 0; // microtime();
}

PlayerGroup.method('tick', function() {
	// Spawn new player 	
	if (this.players.length < this.maxPlayers && this.lastSpawnedTime < (microtime() - this.spawnInterval)) {
		var spawnBlock = this.getRandomSpawnBlock();
		
		// Spawn, or wait 1 second.
		if (spawnBlock !== null) {
			// Create player
			var index = this.players.length;
			this.players[index] = new Player(this, spawnBlock.col, spawnBlock.row);
			GAME.stage.addChild(this.players[index].shape);
			GAME.level.addObject(this.players[index]);
			GAME.level.playerUI.addPlayer(this.players[index]);
			
			this.lastSpawnedTime = microtime(); 
		} else {
			this.lastSpawnedTime += 1000; // 1 sec
		}
	}
	
	for (var i in this.players) {
		this.players[i].tick();
	}
	
	// Update UI every few ticks
	if (createjs.Ticker.getTicks() % 30 == 0) {
		GAME.level.playerUI.update();
	}
});

PlayerGroup.method('getPlayerById', function(id) {
	id = id.replace('player_', '');
	
	for (var i in this.players) {
		if (this.players[i].id == id) {
			return this.players[i];
		}
	}
	return null;
});
PlayerGroup.method('getActive', function(player) {
	return this.activePlayer;	
});

PlayerGroup.method('setActive', function(player) {
	if (player !== null) {
		this.removeActive();
	}
	this.activePlayer = player;	
});

PlayerGroup.method('removePlayer', function(player) {
	for (var i in this.players) {
		if (this.players[i] === player) {
			GAME.level.playerUI.removePlayer(player);
			GAME.level.removeObject(this.players[i]);
			delete this.players[i];
			delete player;
		}
	}
	
	this.players = _.compact(this.players); 
	
	// Game over?
	if (this.players.length == 0) {
		GAME.gameOver();
	}
});

PlayerGroup.method('removeActive', function() {
	this.activePlayer = null;
	
	for (var i in this.players) {
		this.players[i].setActive(false);
	}
});

PlayerGroup.method('onClick', function() {
	this.debug ? console.log('Game.onClick') : null;
	
	var block = GAME.level.map.grid.coordsToBlock(GAME.stage.mouseX, GAME.stage.mouseY);
	var playerAtBlock = null;
	
	for (var index in this.players) {
		if (this.players[index].currentBlock.node === block.node) {
			playerAtBlock = this.players[index];
			break;
		}
	}
	
	if (playerAtBlock !== null ) {
		playerAtBlock.onClick();
	} else if (this.activePlayer !== null) {
		var fromBlock = this.activePlayer.getFinalDestination();
		var block = GAME.level.map.grid.coordsToBlock(GAME.stage.mouseX, GAME.stage.mouseY);
		
		var path = GAME.level.map.grid.shortestPath(fromBlock.node, block.node);
		this.activePlayer.addPath(path);
	}
});	

PlayerGroup.method('playerNearestToBlock', function(block) {
	var shortestDistance = Infinity;
	var nearestBlock = null;
	
	for (var i in this.players) {
		var distance = Math.distanceBetweenObjs(this.players[i].currentBlock, block);
		
		if (distance < shortestDistance) {
			shortestDistance = distance;
			nearestBlock = this.players[i];
		}
	}
	
	return nearestBlock;
});

PlayerGroup.method('getRandomSpawnBlock', function() {
	var spawnBlocks = _.shuffle(GAME.level.map.grid.getAllBlocksByProperty('id', 6));
	return GAME.level.getRandomBlock(spawnBlocks, true);
});