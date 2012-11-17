function PlayerGroup (players) 
{
	this.players = [];
	this.activePlayer = null;
	
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
		this.players[i] = new Player(this, player.x, player.y);
		GAME.level.addObject(this.players[i]);
	}
}

PlayerGroup.method('draw', function(player) {
	for (var index in this.players) {
		GAME.stage.removeChild(this.players[index].shape);
		GAME.stage.addChild(this.players[index].shape);
	}
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

PlayerGroup.method('tick', function() {
	for (var i in this.players) {
		this.players[i].tick();
	}
});