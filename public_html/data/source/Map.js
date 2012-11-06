(function(window) {

	function Map (game, mapdata) 
	{
		this.game = game;
		this.gridLines = [];
		
		for (var index in mapdata) {
			this[index] = mapdata[index];
		}
		
		this.grid = new Grid(this, this.layout)
	}
	
	// Properties
	Map.prototype.game 		= null;
	Map.prototype.assets 	= null;
	Map.prototype.layout 	= null;
	Map.prototype.graph		= null;
	
	Map.prototype.gridLines	= [];

	// Methods	
	Map.prototype.draw = function () 
	{	
		// Draw map
		for (var y = 0; y < this.layout.length; y++) {
			var row = this.layout[y];
			for (var x = 0; x < row.length; x++) {
				var cell = row[x];
				if (cell == 0) {
					var block = new createjs.Shape();
					block.x = x*this.blockSize;
					block.y = y*this.blockSize;
					block.graphics.beginFill("#FFFFFF").rect(0, 0, this.blockSize, this.blockSize);
					this.game.stage.addChild(block)	
				}
			}
		}
	}
	
	
	Map.prototype.drawGrid = function () 
	{
		this.game.debug ? console.log('Map.drawGrid') : null;
		
		var i = 0;
	
		var xlines = this.game.canvas.width/this.blockSize+1;
		for (var x = 0; x < xlines; x++) {			
			this.gridLines[i] = new createjs.Shape();
			this.gridLines[i].x = x*this.blockSize;
			this.gridLines[i].graphics.beginFill("#333333").rect(0, 0, 1, this.game.canvas.height);
			this.game.stage.addChild(this.gridLines[i]);
			i++;
		}
		var ylines = this.game.canvas.height/this.blockSize+1;
		for (var y = 0; y < ylines; y++) {
			this.gridLines[i] = new createjs.Shape();
			this.gridLines[i].y = y*this.blockSize;
			this.gridLines[i].graphics.beginFill("#333333").rect(0, 0, this.game.canvas.width, 1);
			this.game.stage.addChild(this.gridLines[i]);
			i++;
		}
		this.game.debug ? console.log('- Grid lines: ' + i) : null;
	}
	
	Map.prototype.removeGrid = function () 
	{
		for (var i in this.gridLines) {
			this.game.stage.removeChild(this.gridLines[i]);
		}
		this.gridLines = [];
	}
	
	window.Map = Map;

}(window));