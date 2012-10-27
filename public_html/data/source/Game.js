(function(window) {

	function Game (id) {		
		// Get canvas and set up stage
		this.canvas = document.getElementById(id);
		this.stage = new createjs.Stage(this.canvas);
		this.stage.enableMouseOver(10);
		this.stage.snapToPixelEnabled = true;
		
		// FPS Counter
		this.fps = new createjs.Text('-- fps', '12px Arial', '#FFFFFF');
		this.fps.textAlign = 'right';
		this.fps.x = this.canvas.width;
		this.fps.y = 0;
		this.stage.addChild(this.fps);

		// Render
		this.stage.update();
		
		// Ticker
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addListener(this);	
	}
		
	// Properties
	Game.prototype.canvas 		= null;
	Game.prototype.stage 		= null;
	Game.prototype.activePlayer	= null;
	Game.prototype.fps 			= null;
	
	// Methods
	Game.prototype.tick = function () {
		// FPS
		if (createjs.Ticker.getTicks() % 10 == 0) {
			this.fps.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + ' fps';
		}
		// Render
		this.stage.update();
	}		

	window.Game = Game;
	
}(window));