Math.prototype.toDegrees = function (x) { 
	return x * 180 / Math.PI; 
}	
Math.prototype.toRadian = function (x) { 
	return x * Math.PI / 180; 
}

/**
* Calculates the distance between two points.
* Uses a^2 + b^2 = c^2
*/ 
Math.prototype.distanceBetweenObjs = function (obj1, obj2) {
	return Math.distance2D(obj1.x, obj1.y, obj2.x, obj2.y)
}
Math.prototype.distance2D = function (x1, y1, x2, y2) { 
	return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

/**
* Calculates the angle between two points.
* if rotation is set it'll return the angle relative to rotation
* @return int Left < 0 < Right
*/
Math.prototype.angleBetweenObjs =  function (obj1, obj2, rotation) {
	return Math.angleBetweenPoints(obj1.x, obj1.y, obj2.x, obj2.y, rotation)
}
Math.prototype.angleBetweenPoints = function (x1, y1, x2, y2, rotation) { 
	// Calculate angle
	var x = x2 - x1
	var y = y2 - y1
	var theta = Math.atan2(-y, x);
	
	// Radians start from East. Convert to North	
	var degrees = Math.toDegrees(theta)*-1		
		degrees = (Math.round(degrees, 2) + 90)
	if (diff < -180) {
		degrees = degrees + 360
	} else if (diff > 180) {
		degrees = -360 + degrees
	}
	
	// Translate based on direct object is facing
	if (typeof rotation !== "undefined") {
		var diff = degrees - rotation
		if (diff < -180) {
			degrees = diff + 360
		} else if (diff > 180) {
			degrees = -360 + diff
		} else {
			degrees -= rotation
		}
	}

	return degrees
}