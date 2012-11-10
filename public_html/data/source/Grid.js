(function(window) {

	function Grid (map, grid) 
	{
		this.map = map;
		this.layout = grid;		
		
		this.dijkstras = new Dijkstras();
		this.dijkstras.setGraph(this.gridToGraph(this.layout));
	}
	
	// Properties
	Grid.prototype.map			= null;
	Grid.prototype.grid			= null;
	Grid.prototype.dijkstras		= null;
	
	// Methods	
	Grid.prototype.shortestPath = function (from, to) {
		GAME.debug ? console.log('Grid.shortestPath') : null;	
		var time = microtime();
		
		var nodes = this.dijkstras.getPath(from, to);		
		
		GAME.debug ? console.log('- route: ' + (microtime()-time) + 'seconds') : null;		
	
		var path = [];		
		for (var i in nodes) {
			path[path.length] = this.nodeToBlock(nodes[i]);
		}
		return path;
	} 
	
	Grid.prototype.gridToGraph = function (grid) 
	{
		// List of offset to check when creating vertices [x, y]
		var offsets = [
			[-1, -1], [0, -1], [1, -1],
			[-1,  0], /* N */ [1,  0],
			[-1,  1], [0,  1], [1,  1]
		];
		
		var graph = [];
		var i =0;
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
	}
	
	Grid.prototype.coordsToBlock = function (x, y)
	{
		var block 		= {};
		block.row 		= Math.floor(y/this.map.blockSize);
		block.col	 	= Math.floor(x/this.map.blockSize);
		block.x 		= block.col * this.map.blockSize;
		block.y 		= block.row * this.map.blockSize;
		block.node		= block.col + 'x' + block.row;
		return block;
	}
	
	Grid.prototype.gridToBlock = function (row, col)
	{
		var block 		= {};
		block.row 		= row;
		block.col	 	= col;
		block.x 		= block.col * this.map.blockSize;
		block.y 		= block.row * this.map.blockSize;
		block.node		= block.col + 'x' + block.row;
		return block;
	}	
	
	Grid.prototype.nodeToBlock = function (node)
	{
		var xy = node.split('x');
		return this.gridToBlock(xy[1], xy[0]);
	}	
	
	window.Grid = Grid;

}(window));