Math.toDegrees = function (x) { 
	return x * 180 / Math.PI; 
}	
Math.toRadian = function (x) { 
	return x * Math.PI / 180; 
}

/**
* Calculates the distance between two points.
* Uses a^2 + b^2 = c^2
*/ 
Math.distanceBetweenObjs = function (obj1, obj2) {
	if (typeof obj1 === 'undefined' || typeof obj2 === 'undefined' || obj1 === null || obj2 === null) {
		return null;
	}
	return Math.distance2D(obj1.x, obj1.y, obj2.x, obj2.y)
}
Math.distance2D = function (x1, y1, x2, y2) { 
	return Math.sqrt( Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

/**
* Calculates the angle between two points.
* if rotation is set it'll return the angle relative to rotation
* @return int Left < 0 < Right
*/
Math.angleBetweenObjs =  function (obj1, obj2, rotation) {
	return Math.angleBetweenPoints(obj1.x, obj1.y, obj2.x, obj2.y, rotation)
}
Math.angleBetweenPoints = function (x1, y1, x2, y2, rotation) { 
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

Math.roundToDp = function (num, dp) 
{
	return Math.round(num*Math.pow(10,dp))/Math.pow(10,dp);
}

/** 
 * Get random number between two other numbers
 * http://stackoverflow.com/questions/4959975/random-between-two-numbers-in-javascript
 */

Math.randomNumberBetween = function (from, to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}

function microtime () {
  return new Date().getTime() / 1000;   
}


/** 
 * Array functions
 * Use Object.defineProperty to prevent enumerating issues.
 */


/**
 * Shuffle items in array.
 * http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
 */
if (!Array.prototype.prototype) {
	Object.defineProperty(Array.prototype, 'shuffle', {
		value: function() { 
			var i = this.length, j, tempi, tempj;
			if ( i == 0 ) { return false; }
			while ( --i ) {
				j       = Math.floor( Math.random() * ( i + 1 ) );
				tempi   = this[i];
				tempj   = this[j];
				this[i] = tempj;
				this[j] = tempi;
			}
			return this;
		}
	});
}

/**
* Get first item in array.
*/
if (!Array.prototype.prototype) {
	Object.defineProperty(Array.prototype, 'first', {
		value: function() { 
			if (this.length > 0) {
				return this[0];
			}
			return null; 
		}
	});
}

/**
* Get last item in array.
*/
if (!Array.prototype.prototype) {
	Object.defineProperty(Array.prototype, 'last', {
		value: function() { 
			if (this.length > 0) {
				return this[this.length-1];
			}
			return null; 
		}
	});
}

/**
 * Convert HEX to RGB
 * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


/**
 * Convert RGB to HEX
 * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}