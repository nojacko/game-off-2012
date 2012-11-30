function BulletGroup () 
{
	this.bullets = [];
}

BulletGroup.method('tick', function() {
	for (var i in this.bullets) {
		if (typeof this.bullets[i] !== 'undefined') {
			this.bullets[i].tick();
		}
	}
});

BulletGroup.method('fireBullet', function(x, y, angle) {
	var index = this.bullets.length;	
	this.bullets[index] = new Bullet(this, x, y, angle);
	GAME.stage.addChild(this.bullets[index].shape);
});

BulletGroup.method('removeBullet', function(bullet) {
	for (var i in this.bullets) {
		if (this.bullets[i] === bullet) {			
			GAME.stage.removeChild(this.bullets[i].shape);
			delete this.bullets[i];
			delete bullet;
		}
	}
	
	this.bullets = _.compact(this.bullets); 
});