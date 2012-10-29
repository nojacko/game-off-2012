(function(window) {

	function Map (game, source) 
	{
		this.game = game;
		this.source = source;
	}
	
	// Properties
	Map.prototype.game 		= null;
	Map.prototype.source 	= null;
	Map.prototype.name 		= null;
	Map.prototype.assets 	= null;
	Map.prototype.grid 		= null;
	
	Map.prototype.gridLines	= [];

	// Methods	
	Map.prototype.coordsToBlock = function (x, y)
	{
		var block = {};
		block.x = Math.floor(x/this.blockSize);
		block.y = Math.floor(y/this.blockSize);
		block.coords = {};
		block.coords.x = block.x * this.blockSize;
		block.coords.y = block.y * this.blockSize;
		return block;
	}
	
	Map.prototype.load = function () 
	{	
		// Scope
		var game = this.game;
		
		// Load Assets
		this.preload = new createjs.PreloadJS();
		this.preload.onProgress = function (event) { game.map.onProgress(event); }
		this.preload.onFileLoad = function (event) { game.map.onFileLoad(event); }
		this.preload.onComplete = function (event) { game.map.onCompleteMap(event); }
		this.preload.onError = function (event) { console.log('error'); }
        this.preload.loadManifest(
			[
				{ 
					id: 'map', 
					src: 'data/maps/' + this.source + '.json',
					type: createjs.PreloadJS.JSON
				}
			]
		);
	}

	Map.prototype.onProgress = function (event) 
	{
		this.game.debug ? console.log('Map.onProgress: ' + event.loaded + '/' + event.total) : null;
	}
	
	Map.prototype.onFileLoad = function (event) 
	{
		this.game.debug ? console.log('Map.onFileLoad: { id: ' + event.id + ', src: ' + event.src +' }') : null;
	}
	
	Map.prototype.onCompleteMap = function (event) 
	{
		this.game.debug ? console.log('Map.onCompleteMap') : null;
		
		// Scope
		var game = this.game;		
		
		// Copy data from map file
		this.game.debug ? console.log('- Applying settings...') : null;
		var data = JSON.parse(this.preload.getResult('map').result);
		for (var index in data) {
			this[index] = data[index];
		}
		
		this.game.debug ? console.log('- Map name: ' + this.name) : null;
		
		// Load Assets
		this.game.debug ? console.log('- Loading assets...') : null;
		if (this.assets.length > 0) {
			this.preload.onComplete = function (event) { game.map.onCompleteAssets(event); }
			this.preload.loadManifest(this.assets);
		} else {
			this.onCompleteAssets(); 
		}
	}
		
	Map.prototype.onCompleteAssets = function (event) 
	{
		this.game.debug ? console.log('Map.onCompleteAssets') : null;
		
		if (typeof event === 'undefined') {
			this.game.debug ? console.log('- No assets loaded') : null;	
		}
		
		this.game.onMapLoad();		
	}
	
	
	Map.prototype.drawMap = function () 
	{	
		// Draw map
		for (var y = 0; y < this.grid.length; y++) {
			var row = this.grid[y];
			for (var x = 0; x < row.length; x++) {
				var cell = row[x];
				if (cell == 1) {
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