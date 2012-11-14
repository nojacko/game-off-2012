(function(window) {

	function PlayerGroup (players) 
	{
		this.players = [];
		
		for (var i = 0; i < players.length; i++) {
			var player = players[i];
			this.players[i] = new Player(this, player.x, player.y);
			GAME.stage.addChild(this.players[i]);
			GAME.level.addObject(this.players[i]);
		}
	}
	
	// Properties
	PlayerGroup.prototype.players 		= [];
	PlayerGroup.prototype.activePlayer	= null;
	
	// Methods	
	PlayerGroup.prototype.getActive = function (player)
	{
		return this.activePlayer;	
	}
	PlayerGroup.prototype.setActive = function (player)
	{
		if (player !== null) {
			this.removeActive();
		}
		this.activePlayer = player;	
	}
	PlayerGroup.prototype.removeActive = function ()
	{
		this.activePlayer = null;
		
		for (var i in this.players) {
			this.players[i].setActive(false);
		}
	}
	
	PlayerGroup.prototype.onClick = function ()
	{
		this.debug ? console.log('Game.onClick') : null;
		
		if (this.activePlayer !== null) {
			var fromBlock = this.activePlayer.getFinalDestination();
			var toBlock = GAME.level.map.grid.coordsToBlock(GAME.stage.mouseX, GAME.stage.mouseY);
			
			var path = GAME.level.map.grid.shortestPath(fromBlock.node, toBlock.node);
			this.activePlayer.addPath(path);
		}
	}	

	PlayerGroup.prototype.tick = function ()
	{
		for (var i in this.players) {
			this.players[i].tick();
		}
	}	

	window.PlayerGroup = PlayerGroup;

}(window));