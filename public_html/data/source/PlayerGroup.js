(function(window) {

	function PlayerGroup (game) 
	{
		this.game = game;
		
		for (var i = 0; i < this.game.map.players.length; i++) {
			var player = this.game.map.players[i];
			this.players[i] = new Player(game, this, player.x, player.y);
			this.game.stage.addChild(this.players[i]);
		}
	}
	
	// Properties
	PlayerGroup.prototype.game			= null;
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
			var from;
			
			// Queue up movements correctly
			if (this.activePlayer.moveQueue.length > 0) {
				from = this.activePlayer.moveQueue[this.activePlayer.moveQueue.length-1];
			} else if (this.activePlayer.moveTarget !== null) {
				from = this.activePlayer.moveTarget;
			} else {
				from = this.game.map.grid.coordsToBlock(this.activePlayer.x, this.activePlayer.y);		
			}			
			
			var path = this.game.map.grid.findPath(
				from, 
				this.game.map.grid.coordsToBlock(this.game.stage.mouseX, this.game.stage.mouseY)
			);
			
			for (var i in path) {
				var block = this.game.map.grid.gridToBlock(path[i].x, path[i].y);
				this.activePlayer.moveTo(block);
			}
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