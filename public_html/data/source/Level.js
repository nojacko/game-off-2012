(function(window) {

	function Level (id) 
	{
		this.id = id;
		
		this.objects = [];
		
		this.loadLevelFile();
	}
	
	// Properties
	Level.prototype.id 		= '';
	Level.prototype.preload	= null;
	Level.prototype.map		= null;
	Level.prototype.objects	= [];
	Level.prototype.playerGroup = null;

	// Methods		
	Level.prototype.tick = function ()
	{		
		this.playerGroup.tick();	
	}
	
	Level.prototype.onClick = function ()
	{		
		this.playerGroup.onClick();	
	}
	
	Level.prototype.addObject = function (object)
	{		
		this.objects[this.objects.length] = object;
	}	
	
	Level.prototype.updateObjectsOnGrid = function (self)
	{
		var self = typeof self === 'undefined' ? null : self;
		
		this.map.grid.setObjectsOnGrid(this.objects, self);
	}
	
	
	Level.prototype.objectAtBlock = function (block, self)
	{
		var self = typeof self === 'undefined' ? null : self;
		
		for (var i in this.objects) {
			var object = this.objects[i];
			if (object !== self) {
				if (object.currentBlock !== null && object.currentBlock.node === block.node) {
					return object;
				}
			}
		}
		return null;
	}
	
	Level.prototype.loadLevelFile = function () 
	{	
		GAME.debug ? console.log('Level.loadLevelFile') : null;
		
		// Scope
		var level = this;
		
		// Load Assets
		this.preload = new createjs.PreloadJS();
		this.preload.onProgress = function (event) { level.loadProgress(event); }
		this.preload.onFileLoad = function (event) { level.loadFileLoad(event); }
		this.preload.onComplete = function (event) { level.loadAssets(event); }
		this.preload.onError = function (event) { console.log('Level Load Error'); }
        this.preload.loadManifest(
			[
				{ 
					id: 'level', 
					src: 'data/levels/' + this.id + '.json',
					type: createjs.PreloadJS.JSON
				}
			]
		);
	}	
	
	Level.prototype.loadProgress = function (event) 
	{
		GAME.debug ? console.log('Level.loadProgress: ' + event.loaded + '/' + event.total) : null;
	}
	
	Level.prototype.loadFileLoad = function (event) 
	{
		GAME.debug ? console.log('Level.loadFileLoad: { id: ' + event.id + ', src: ' + event.src +' }') : null;
	}
	
	Level.prototype.loadAssets = function (event) 
	{
		GAME.debug ? console.log('Level.loadAssets') : null;
		
		// Scope
		var level = this;		
		
		// Copy data from level file
		GAME.debug ? console.log('- Applying settings...') : null;
		var data = JSON.parse(this.preload.getResult('level').result);
		for (var index in data) {
			this[index] = data[index];
		}
		
		GAME.debug ? console.log('- Map name: ' + this.name) : null;
		
		// Load Assets
		GAME.debug ? console.log('- Loading assets...') : null;
		if (this.assets.length > 0) {
			this.preload.onComplete = function (event) { level.levelAssetsLoaded(event); }
			this.preload.loadManifest(this.assets);
		} else {
			this.levelAssetsLoaded(); 
		}
	}
	
	Level.prototype.levelAssetsLoaded = function (event) 
	{
		GAME.debug ? console.log('Map.onCompleteAssets') : null;
		
		if (typeof event === 'undefined') {
			GAME.debug ? console.log('- No assets loaded') : null;	
		}
		
		this.map = new Map(this.mapdata);
		this.playerGroup = new PlayerGroup(this.players)
		
		// Pass back to game
		GAME.start();		
	}
	
	window.Level = Level;

}(window));