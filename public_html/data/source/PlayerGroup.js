(function(window) {

	function PlayerGroup (game) 
	{
		this.game = game;
		this.players = [];
		
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
			var path = this.game.map.grid.findPath(
				this.activePlayer.getFinalDestination(), 
				this.game.map.grid.coordsToBlock(this.game.stage.mouseX, this.game.stage.mouseY)
			);
			this.activePlayer.addPath(path);
		}
	}	

	PlayerGroup.prototype.playerAtBlock = function (block, self)
	{
		var self = typeof self === 'undefined' ? null : self;
		
		for (var i in this.players) {
			var player = this.players[i];
			if (player !== self) {
				if ( 
					player.currentBlock !== null && 
					player.currentBlock.col === block.col && 
					player.currentBlock.row === block.row 
				) {
					return player;
				}
			}
		}
		return null;
	}

	PlayerGroup.prototype.tick = function ()
	{
		for (var i in this.players) {
			this.players[i].tick();
		}
	}	

	window.PlayerGroup = PlayerGroup;

}(window));