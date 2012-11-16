function Grid (map, grid) 
{
	this.map = map;
	this.layout = grid;		
	
	this.dijkstras = new Dijkstras();
	this.dijkstras.setGraph(this.gridToGraph(this.layout));
	
	this.dijkstrasWithObjects = new Dijkstras();
}

Grid.method('shortestPath', function (from, to, withObjects) {
	GAME.debug ? console.log('Grid.shortestPath') : null;	
	
	withObjects = (typeof withObjects === 'undefined') ? false : withObjects;
	
	var time = microtime();		
	var nodes;
	if (withObjects) {
		nodes = this.dijkstrasWithObjects.getPath(from, to);		
	} else {
		nodes = this.dijkstras.getPath(from, to);
	}
	
	GAME.debug ? console.log('- route: ' + (microtime()-time) + 'seconds') : null;		

	var path = [];		
	for (var i in nodes) {
		path[path.length] = this.nodeToBlock(nodes[i]);
	}
	return path;
});

Grid.method('gridToGraph', function (grid) {
	// List of offset to check when creating vertices [x, y]
	var offsets = [
		[-1, -1], [0, -1], [1, -1],
		[-1,  0], /* N */ [1,  0],
		[-1,  1], [0,  1], [1,  1]
	];
	
	var graph = [];
	var i = 0;
	for (var y = 0; y < grid.length; y++) {
		var row = grid[y];
		for (var x = 0; x < row.length; x++) {
			var cell = row[x];
			var nodeName = x + 'x' + y;
			
			// Inaccessible
			if (cell === 0) {
				continue;
			}				
			
			// Check neigbours
			var vertices = [];
			for (var n in offsets) {
				var xOffset = x - offsets[n][0];
				var yOffset = y - offsets[n][1];
				
				if (typeof grid[yOffset] !== 'undefined') {	
					if (typeof grid[yOffset][xOffset] !== 'undefined') {	
						var targetName = xOffset + 'x' + yOffset;
						
						// Add vertex
						vertices[vertices.length] = [
							targetName, 
							Math.distance2D(x, y, xOffset, yOffset)
						]; 
					}
				}
			}
			i++
			graph[graph.length] = [nodeName, vertices];
		}
	}
	return graph;
});

Grid.method('setObjectsOnGrid', function (objects, self) {
	var graph = this.gridToGraph(this.layout);
	var inaccessibleNodes = [];
	
	// Get list of occupied nodes
	for (var i in objects) {
		if (objects[i] !== self && objects[i].currentBlock !== null) {
			inaccessibleNodes[inaccessibleNodes.length] = objects[i].currentBlock.node;
		}
	}
	
	// Loop the graph
	var indexesToRemove = []
	for (var i in graph) {
		if (inaccessibleNodes.indexOf(graph[i][0]) > -1) {
			delete graph[i][0];
		} 
	}
	// Clean deleted values
	graph = _.compact(graph); 
	
	// Loop the graph
	var indexesToRemove = []
	for (var i in graph) {
		for (var vertex in graph[i][1]) {				
			if (inaccessibleNodes.indexOf(graph[i][1][vertex][0]) > -1) {
				delete graph[i][1][vertex];
			} 
		}
		
		// Clean deleted values
		graph[i][1] = _.compact(graph[i][1]); 
	}
	
	this.dijkstrasWithObjects.setGraph(graph);
});

Grid.method('coordsToBlock', function (x, y){
	var block 		= {};
	block.row 		= Math.floor(y/this.map.blockSize);
	block.col	 	= Math.floor(x/this.map.blockSize);
	block.x 		= block.col * this.map.blockSize;
	block.y 		= block.row * this.map.blockSize;
	block.node		= block.col + 'x' + block.row;
	return block;
});

Grid.method('gridToBlock', function (row, col) {
	var block 		= {};
	block.row 		= row;
	block.col	 	= col;
	block.x 		= block.col * this.map.blockSize;
	block.y 		= block.row * this.map.blockSize;
	block.node		= block.col + 'x' + block.row;
	return block;
});	

Grid.method('nodeToBlock', function (node) {
	var xy = node.split('x');
	return this.gridToBlock(xy[1], xy[0]);
});	
