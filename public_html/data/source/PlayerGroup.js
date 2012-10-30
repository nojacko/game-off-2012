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
			var path = this.game.map.path(
				this.game.map.coordsToBlock(this.activePlayer.x, this.activePlayer.y), 
				this.game.map.coordsToBlock(this.game.stage.mouseX, this.game.stage.mouseY)
			);
			
			for (var i in path) {
				this.activePlayer.moveTo(path[i]);
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