(function(window) {

	function Game (id, map, debug) 
	{	
		this.debug = typeof debug == 'boolean' ? debug : null;
		console.log(this.debug);
		
		// Get canvas and set up stage
		this.canvas = document.getElementById(id);
		this.stage = new createjs.Stage(this.canvas);
		this.stage.enableMouseOver(10);
		this.stage.snapToPixelEnabled = true;
		
		this.map = new Map(this, map);
		this.map.load();
	}
		
	// Properties
	Game.prototype.canvas 		= null;
	Game.prototype.stage 		= null;
	
	Game.prototype.map 			= null;
	
	Game.prototype.activePlayer	= null;
	Game.prototype.fps 			= null;
	
	// Methods	
	Game.prototype.onMapLoad = function () 
	{
		this.debug ? console.log('Game.onMapLoad') : null;
		
		// Debugging Visuals
		this.toggleDebug(this.debug); 
		
		// Draw
		this.map.drawMap();
		
		// Render
		this.stage.update();
		
		// Tick
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addListener(this);	
	}	
	
	Game.prototype.toggleDebug = function (on)
	{		
		if (typeof on === 'undefined' || typeof on !== 'boolean') {
			if (this.debug !== null) {
				this.debug = !this.debug;
			}
		} else {
			this.debug = on;
		} 
		
		// Always remove first		
		this.stage.removeChild(this.fps);
		this.fps = null;
		// To do: remove grid
	
		if (this.debug) {
			this.map.drawGrid();
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
		if (this.fps !== null && createjs.Ticker.getTicks() % 10 == 0) {
			this.fps.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + ' fps';
		}
		// Render
		this.stage.update();
	}		
	

	window.Game = Game;
	
}(window));