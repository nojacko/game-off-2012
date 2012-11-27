function Block (map, row, col, data) 
{	
	this.map = map;
	
	this.row = row;
	this.col = col;
	this.x = this.col * this.map.blockSize;
	this.y = this.row * this.map.blockSize;
	
	this.node = this.col + 'x' + this.row;	
	
	this.id = (typeof data['id'] === 'undefined') ? '99999' : data['id'];
	this.type = (typeof data['type'] === 'undefined') ? '' : data['type'];
	this.cost = (typeof data['cost'] === 'undefined') ? 0 : data['cost'];
	this.noPathTo = (typeof data['noPathTo'] === 'undefined') ? [] : data['noPathTo'];
	this.colour = (typeof data['colour'] === 'undefined') ? '' : data['colour'];
	
	this.rgb = hexToRgb(this.colour);
	this.rgbaStr = (this.rgb === null) ? '' : 'rgba('+this.rgb.r+','+this.rgb.g+','+this.rgb.b+',0.2)';
}

Block.method('canLinkTo', function (to) {
	return (this.noPathTo.indexOf(to.id) === -1)
});

Block.method('accessible', function () {
	return (this.cost > 0 );
});