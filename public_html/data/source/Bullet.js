function Bullet (bulletGroup, x, y, angle) {
	this.bulletGroup = bulletGroup;
	
	this.x = x;
	this.y = y;
	this.angle = angle;
	

	this.rads = Math.toRadian(this.angle)
	this.vx = Math.sin(this.rads);
	this.vy = -Math.cos(this.rads);
	
	this.speed = 20;
	this.damageLower = 40;
	this.damageUpper = 60;
	this.radius = GAME.level.map.blockSize/2;
	
	this.distanace = 0;
	this.maxDistance = GAME.level.map.blockSize*10;

	this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y);
	

	// CreateJS Shape
	this.shape = new createjs.Shape();
	this.shape.initialize();		
	this.shape.snapToPixel = true;
	
	this.render();
}


Bullet.method('tick', function () { 	
	if (this.distance > this.maxDistance) {
		this.bulletGroup.removeBullet(this);
	} else {
		// Move
		var moveDistance = this.speed*GAME.frameTime*GAME.level.map.blockSize;
		this.x += this.vx * moveDistance;
		this.y += this.vy * moveDistance;
		
		this.shape.x = this.x;
		this.shape.y = this.y;		
		
		this.distance += moveDistance;
		
		// Check collisions
		this.currentBlock = GAME.level.map.grid.coordsToBlock(this.x, this.y);
		
		if (this.currentBlock !== null && this.currentBlock.cost > 0) {			
		
			var nearestZombie = GAME.level.zombieGroup.zombieNearestToBlock(this.currentBlock);
			if (nearestZombie !== null && nearestZombie.currentBlock !== null) {
				var distance = Math.distanceBetweenObjs(nearestZombie.currentBlock, this.currentBlock);
				if (distance <= this.radius) {				
					nearestZombie.damage(Math.randomNumberBetween(this.damageLower, this.damageUpper));
					this.bulletGroup.removeBullet(this);
				}
			}
		} else {
			this.bulletGroup.removeBullet(this);
		}
	}
});

Bullet.method('render', function () { 
	this.shape.graphics.clear();
	this.shape.graphics.beginFill('#FFFFFF').drawCircle(
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/2, 
		GAME.level.map.blockSize/4
	);
});