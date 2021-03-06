function Level (id) 
{
	this.id = id;
	this.preload = null;
	this.map = null;
	this.objects = [];
	this.playerGroup = null;
	this.zombieGroup = null;
	this.score = {
		level: 0, 
		kills: 0, 
		score: 0
	};
	
	this.loadLevelFile();
}

// Methods		
Level.method('draw', function () {	
	if (GAME.debug) {
		this.map.drawBlocks();
	}
	this.playerUI.draw();
});	

Level.method('tick', function () {		
	this.playerGroup.tick();	
	this.zombieGroup.tick();
	this.bulletGroup.tick();
});

Level.method('onClick', function () {		
	this.playerGroup.onClick();	
});

Level.method('addObject', function (object) {		
	this.objects[this.objects.length] = object;
});	

Level.method('removeObject', function (object) {	
	for (var i in this.objects) {
		if (this.objects[i] === object) {
			if (typeof this.objects[i].shape !== 'undefined') {				
				GAME.stage.removeChild(this.objects[i].shape);
			}
			
			delete this.objects[i];
			delete object;
		}
	}		
});	

Level.method('updateObjectsOnGrid', function (self) {
	var self = typeof self === 'undefined' ? null : self;
	this.map.grid.setObjectsOnGrid(this.objects, self);
});


Level.method('objectAtBlock', function (block, self) {
	var self = typeof self === 'undefined' ? null : self;
	
	for (var i in this.objects) {
		var object = this.objects[i];
		if (object !== self) {
			if (typeof object.currentBlock !== 'undefined' && object.currentBlock !== null && object.currentBlock.node === block.node) {
				return object;
			}
		}
	}
	return null;
});

Level.method('getBlocksNearBlock', function (block, unoccupiedOnly) {
	unoccupiedOnly = (typeof unoccupiedOnly === 'undefined') ? false : unoccupiedOnly;
	
	var blocks = [];
	if (typeof this.map.grid.dijkstras.graph[block.node] !== 'undefined') {
		var neighbours = this.map.grid.dijkstras.graph[block.node];
		
		for (var node in neighbours) {
			var block = this.map.grid.nodeToBlock(node);
			if (unoccupiedOnly === false || this.objectAtBlock(block) === null) {
				blocks[blocks.length] = block;
			}
		}
	}
	return blocks;
});

Level.method('getRandomBlock', function (blocks, unoccupiedOnly) {
	unoccupiedOnly = (typeof unoccupiedOnly === 'undefined') ? false : unoccupiedOnly;
	
	var block = null;
	
	do {
		block = blocks.shift();
		
		if (unoccupiedOnly == false || GAME.level.objectAtBlock(block) === null) {
			break;				
		}
		block = null;
	} while (blocks.length > 0 && block === null) 
	
	return block;
});

Level.method('isDirectPathToBlock', function (from, to) {
	// Error check
	if (typeof from === 'undefined' || typeof to === 'undefined') {
		return false;
	}
	if (from === null || to === null) {
		return false;
	}
	
	var angleToTarget = Math.angleBetweenObjs(from, to);	
	var rads = Math.toRadian(angleToTarget);
	var vx = Math.sin(rads);
	var vy = -Math.cos(rads);
	
	var x = from.x;
	var y = from.y;
	
	var interval = this.map.blockSize/2;
	var currentBlock = from;
		
	while (true) {
		x += vx * interval; 
		y += vy * interval; 
		
		var nextBlock = this.map.grid.coordsToBlock(x, y);
		
		if (nextBlock == null) {
			return false;
		}
		
		var distance = Math.distanceBetweenObjs(currentBlock, to);
		if (nextBlock.node === to.node || (distance !== null && distance < this.map.blockSize*2)) {
			return true;
		} 
	
		currentBlock = nextBlock;
		
		// Path blocked
		if (currentBlock.cost === -1) {
			return false;
		}	
		
	}
	
	return true;
});

Level.method('loadLevelFile', function () {	
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
				src: 'data/levels/' + this.id + '/level.json',
				type: createjs.PreloadJS.JSON
			}
		]
	);
});

Level.method('loadProgress', function (event) {
	GAME.debug ? console.log('Level.loadProgress: ' + event.loaded + '/' + event.total) : null;	
	GAME.updateLoading('Loading... ' + Math.roundToDp(event.loaded/event.total, 2)*100 + '%');
});

Level.method('loadFileLoad', function (event) {
	GAME.debug ? console.log('Level.loadFileLoad: { id: ' + event.id + ', src: ' + event.src +' }') : null;
});

Level.method('loadAssets', function (event) {
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
});

Level.method('levelAssetsLoaded', function (event) {
	GAME.debug ? console.log('Map.onCompleteAssets') : null;
	
	if (typeof event === 'undefined') {
		GAME.debug ? console.log('- No assets loaded') : null;	
	}
	
	this.map = new Map(this.data);
	this.playerGroup = new PlayerGroup();
	this.zombieGroup = new ZombieGroup();
	this.playerUI = new PlayerUI();
	this.bulletGroup = new BulletGroup();
	
	// Set up background
	if (typeof this.preload.getResult('background') !== 'undefined') {
		var background = new createjs.Bitmap(this.preload.getResult('background').result);
		background.x = 0;
		background.y = 0;
		GAME.stage.addChild(background);
	}
	
	// Pass back to game
	GAME.start();	
});