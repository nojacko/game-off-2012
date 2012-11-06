(function(window) {

	function PlayerGroup (players) 
	{
		this.players = [];
		
		for (var i = 0; i < players.length; i++) {
			var player = players[i];
			this.players[i] = new Player(this, player.x, player.y);
			GAME.stage.addChild(this.players[i]);
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
			var path = GAME.level.map.grid.findPath(
				this.activePlayer.getFinalDestination(), 
				GAME.level.map.grid.coordsToBlock(GAME.stage.mouseX, GAME.stage.mouseY)
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