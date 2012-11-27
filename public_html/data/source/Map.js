function Map (data) 
{
	this.assets = null;
	this.layout = null;
	this.graph = null;
	this.gridLines = [];
	this.gridBlocks = [];
	
	for (var index in data) {
		this[index] = data[index];
	}
	
	this.grid = new Grid(this, this.layout, this.blockTypes)
}

Map.method('drawBlocks', function () {	
	// Draw map
	for (var y = 0; y < this.layout.length; y++) {
		var row = this.layout[y];
		for (var x = 0; x < row.length; x++) {
			var block = this.grid.gridToBlock(y, x);
			if (block.rgbaStr !== '') {
				var square = new createjs.Shape();
				square.x = x*this.blockSize;
				square.y = y*this.blockSize;
				square.graphics.beginFill(block.rgbaStr).rect(0, 0, this.blockSize, this.blockSize);
				GAME.stage.addChild(square);
				this.gridBlocks[this.gridBlocks.length] = square;
			}
		}
	}
});

Map.method('removeBlocks', function () {	
	for (var i in this.gridBlocks) {
		GAME.stage.removeChild(this.gridBlocks[i]);
	}
	this.gridBlocks = [];
});

Map.method('drawGrid', function () {
	GAME.debug ? console.log('Map.drawGrid') : null;
	
	var i = 0;

	var xlines = GAME.canvas.width/this.blockSize+1;
	for (var x = 0; x < xlines; x++) {			
		this.gridLines[i] = new createjs.Shape();
		this.gridLines[i].x = x*this.blockSize;
		this.gridLines[i].graphics.beginFill("#333333").rect(0, 0, 1, GAME.canvas.height);
		GAME.stage.addChild(this.gridLines[i]);
		i++;
	}
	var ylines = GAME.canvas.height/this.blockSize+1;
	for (var y = 0; y < ylines; y++) {
		this.gridLines[i] = new createjs.Shape();
		this.gridLines[i].y = y*this.blockSize;
		this.gridLines[i].graphics.beginFill("#333333").rect(0, 0, GAME.canvas.width, 1);
		GAME.stage.addChild(this.gridLines[i]);
		i++;
	}
	GAME.debug ? console.log('- Grid lines: ' + i) : null;
});

Map.method('removeGrid', function () {
	for (var i in this.gridLines) {
		GAME.stage.removeChild(this.gridLines[i]);
	}
	this.gridLines = [];
});
