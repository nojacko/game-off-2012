(function(window) {

	function Game (id, debug) 
	{	
		this.debug = typeof debug == 'boolean' ? debug : false;
		
		// Get canvas and set up stage
		this.canvas = document.getElementById(id);
		this.stage = new createjs.Stage(this.canvas);
		this.stage.enableMouseOver(10);
		this.stage.snapToPixelEnabled = true;	
	}
		
	// Properties
	Game.prototype.canvas 		= null;
	Game.prototype.stage 		= null;
	
	Game.prototype.level		= null;
	
	Game.prototype.frameTime	= 0.01;
	
	Game.prototype.fps 			= null;
	
	// Methods	
	Game.prototype.loadLevel = function (level) 
	{
		this.debug ? console.log('Game.loadLevel') : null;
		
		this.level = new Level(this, level);
	}
	
	Game.prototype.levelLoaded = function () 
	{
		this.debug ? console.log('Game.onMapLoad') : null;
		
		// Scope
		var game = this;
		
		// Size Canvas
		this.canvas.width = this.level.map.xBlocks*this.level.map.blockSize + 1;
		this.canvas.height = this.level.map.yBlocks*this.level.map.blockSize + 1;
		
		// onClick events
		this.canvas.onclick = function () { game.onClick(); }
		
		// Debugging Visuals
		this.toggleDebug(this.debug); 
		
		// Draw
		this.level.map.draw();
		
		// Render
		this.stage.update();
		
		// Tick
		this.frameTime = Math.roundToDp(1/30, 2);
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addListener(this);	
	}	
	
	Game.prototype.onClick = function (on)
	{
		this.debug ? console.log('Game.onClick') : null;
		
		this.level.playerGroup.onClick();
	}
	
	Game.prototype.toggleDebug = function (on)
	{		
		if (typeof on === 'undefined' || typeof on !== 'boolean') {
			this.debug = !this.debug;
		} else {
			this.debug = on;
		} 
		
		// Always remove first		
		this.stage.removeChild(this.fps);
		this.fps = null;		
		this.level.map.removeGrid();
		
		if (this.debug) {
			this.level.map.drawGrid();
			this.drawFps();
		} 		
	}
	
	Game.prototype.drawFps = function ()
	{		
		// FPS Counter
		this.fps = new createjs.Text('-- fps', '12px Arial', '#FFFFFF');
		this.fps.textAlign = 'right';
		this.fps.x = this.canvas.width;
		this.fps.y = 0;
		this.stage.addChild(this.fps);		
	}
	
	
	Game.prototype.tick = function ()
	{
		// FPS
		if (createjs.Ticker.getTicks() % 10 == 0) {
			var fps = Math.floor(createjs.Ticker.getMeasuredFPS());
			this.frameTime = Math.roundToDp(1/fps, 2);
			if (this.fps !== null) {
				this.fps.text = fps + ' fps';
			}
		}
		
		// Players
		this.level.playerGroup.tick();
		
		// Render
		this.stage.update();
	}		
	

	window.Game = Game;
	
}(window));