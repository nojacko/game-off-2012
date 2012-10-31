(function(window) {

	function Grid (map, grid) 
	{
		this.map = map;
		this.grid = grid;
		this.graph = new Graph(this.grid);
	}
	
	// Properties
	Grid.prototype.map			= null;
	Grid.prototype.grid			= null;
	Grid.prototype.graph			= null;
	
	// Methods		
	Grid.prototype.findPath = function (from, to) 
	{
		return astar.search(
			this.graph.nodes, 
			this.graph.nodes[from.row][from.col], 
			this.graph.nodes[to.row][to.col]
		);
	}
	
	Grid.prototype.coordsToBlock = function (x, y)
	{
		var block 		= {};
		block.row 		= Math.floor(y/this.map.blockSize);
		block.col	 	= Math.floor(x/this.map.blockSize);
		block.x 		= block.col * this.map.blockSize;
		block.y 		= block.row * this.map.blockSize;
		return block;
	}
	
	Grid.prototype.gridToBlock = function (row, col)
	{
		var block 		= {};
		block.row 		= row;
		block.col	 	= col;
		block.x 		= block.col * this.map.blockSize;
		block.y 		= block.row * this.map.blockSize;
		return block;
	}	
	
	window.Grid = Grid;

}(window));