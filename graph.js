/**
 *	Graph.js library
 *		by linea, 2011
 *
 *	More information is available at: https://github.com/linea/Graph.js
 */
function Graph( canvas, data, draw ) {
	this.canvas			= null;
	this.context		= null;
	this.lines			= [];
	this.width			= 0;
	this.height			= 0;
	this.drawn			= false;
	
	// Set the default options.
	this.options		= {
		'minValue':		"auto",
		'maxValue':		"auto",
		'padding':		20,
		'spacing':		20,
		'background':	["#4E87B5","#86A6C1"],
		'grid':			true,
		'gridSize':		1,
		'gridColor':	"rgba(255, 255, 255, 0.4 )",
		'gridShadow':	true,
		'bullets':		true,
		'bulletSize':	6,
		'bulletColor':	"#000",
		'bulletFill':	false,
		'bulletShadow':	true,
		'shadowColor':	"rgba(0, 0, 0, 0.6)",
		'fill':			true,
		'fillColor':	"rgba(255,255,255,0.4)",
		'lineSize':		3,
		'lineCurve':	true,
		'lineColor':	"#eee"
	};
	
	// Initialize.
	if( !this.init( canvas ) ) {
		alert( "[graph] invalid canvas element, aborting." );
		return false;
	}
	
	
	// Add the default line' data points.
	if( data ) {
		this.addLine( data, 'default' );
	}
	
	
	// Draw by default.
	if( draw ) {
		this.draw();
	}
};


// Init function.
Graph.prototype.init		= function( canvas ) {
	if( !canvas || !canvas.getContext ) {
		return false;
	}
	
	// Get the canvas' 2d context and dimensions.
	this.canvas		= canvas || false;
	this.context	= this.canvas.getContext( "2d" );
	this.width		= Math.max( this.canvas.width, this.canvas.clientWidth );
	this.height		= Math.max( this.canvas.height, this.canvas.clientHeight );
	return true;
};


// Add more data lines.
Graph.prototype.addLine		= function( data, color ) {
	this.lines.push( {
		'data':		data,
		'color':	color || 'default',
		'bullets':	[]
	} );
	
	// We'd probably want to redraw this if it's already drawn.
	if( this.drawn ) {
		this.redraw();
	}
};


// Get array of all data lines.
Graph.prototype.getLines	= function() {
	return this.lines;
};


// Remove all data lines.
Graph.prototype.clearLines	= function() {
	this.lines		= null;
	delete this.lines;
	this.lines		= [];
	// Seems excessive, I know.. but I don't care.
};


// Draw the graph as configured.
Graph.prototype.draw		= function() {
	
	// Do we need to draw the background?
	if( this.options['background'] !== false ) {
		this.drawBackground();
	}
	
	// Do we need to draw the grid?
	if( this.options['grid'] ) {
		this.drawGrid();
	}
	
	// For every line, calculate bullet points and control points (for curving)
	for( var i = 0; i < this.lines.length; i++ ) {
		this.lines[i]['bullets']	= this.calculateBulletPoints( this.lines[i]['data'] );
		
		var controlPoints			= this.calculateControlPoint( this.lines[i]['bullets'] );
		this.lines[i]['start']		= controlPoints.start;
		this.lines[i]['end']		= controlPoints.end;
		
		// If we want filling, draw that first (so the line overlays it)
		if( this.options['fill'] ) {
			this.fillLineData( 
				this.lines[i], 
				this.lines[i]['color'] == "default" ? this.options['fillColor'] : this.lines[i]['color']
			);
		}
		
		// Draw the line with either the default color, or specified color.
		var lineColor	= ( !this.options['fill'] ? this.lines[i]['color'] : "default" );
		this.drawLineData( this.lines[i], lineColor );
		
		// Finally draw bullet points.
		if( this.options['bullets'] ) {
			this.drawBulletPoints( this.lines[i], lineColor );
		}
	}
	
	this.drawn		= true;
};


// Draw the background as configured.
Graph.prototype.drawBackground	= function() {
	this.context.fillStyle	= this.parseColor( this.options['background'] );
	this.context.fillRect( 0, 0, this.width, this.height );
};


// Draw the grid as configured.
Graph.prototype.drawGrid		= function() {
	var startX		= this.options['padding'];
	var startY		= this.height - this.options['padding'];
	var height		= this.height - ( this.options['padding'] * 2 );
	var width		= this.width - ( this.options['padding'] * 2 );
	var length		= this.lines[0]['data'].length;
	var distance	= width;
	
	// Do we have more values?
	if( this.lines.length > 1 ) {
		for( var i = 0; i < this.lines.length; i++ ) {
			if( this.lines[i]['data'].length > length )
				length	= this.lines[i]['data'].length;
		}
	}
	
	// Calculate the distance for the grid.
	distance	= distance / ( length - 1 );
	
	// Set the grid style.
	this.context.strokeStyle		= this.options['gridColor'];
	this.context.lineWidth			= this.options['gridSize'];
	if( this.options['gridShadow'] ) {
		this.context.shadowOffsetX	= 0;
		this.context.shadowOffsetY	= 0;
		this.context.shadowBlur		= 2;
		this.context.shadowColor	= this.options['shadowColor'];
	} else {
		this.context.shadowBlur		= 0;
	}
	
	// Move the carrot 1 'distance' further every time.
	for( var carrot = 0; carrot < length; carrot++ ) {
		var position	= startX + ( carrot * distance );
		this.context.beginPath();
		this.context.moveTo( position, this.options['padding'] );
		this.context.lineTo( position, startY );
		this.context.stroke();
	}
	
	// Draw bottom line.
	this.context.beginPath();
	this.context.moveTo( startX, startY );
	this.context.lineTo( ( this.width - startX ), startY );
	this.context.stroke();
};


// Draw the bullet points.
Graph.prototype.drawBulletPoints	= function( data, color ) {
	var bullets			= data['bullets'];
	var startX			= this.options['padding'];
	var startY			= this.height - this.options['padding'];
	var height			= this.height - ( this.options['padding'] * 2 );
	var width			= this.width - ( this.options['padding'] * 2 );
	var length			= bullets.length;
	var color			= color || "default";
	
	// Set the style.
	this.context.lineWidth		= this.options['bulletSize'] / 3;
		this.context.lineWidth		= this.context.lineWidth < 1 ? 1 : this.context.lineWidth;
	this.context.strokeStyle	= this.parseColor( color == "default" ? this.options['lineColor'] : color );
	this.context.fillStyle		= this.options['bulletFill'] ? this.parseColor( this.options['bulletColor'] ) : this.context.strokeStyle;
	
	// Add or remove shadow.
	if( this.options['bulletShadow'] ) {
		this.context.shadowOffsetX	= 0;
		this.context.shadowOffsetY	= 0;
		this.context.shadowBlur		= this.options['lineSize'] - 1;
		this.context.shadowColor	= this.options['shadowColor'];
	} else {
		this.context.shadowBlur		= 0;
	}
	
	// And.. GO!
	for( var carrot = 0; carrot < bullets.length; carrot++ ) {
		var bullet		= bullets[carrot];
		
		this.context.beginPath();
		this.context.arc( bullet.x, bullet.y, this.options['bulletSize'], 0, Math.PI * 2, false);
		this.context.closePath();
		this.context.fill();
		if( this.options['bulletFill'] )
	    	this.context.stroke();
	}
};


// Draw the line itself.
Graph.prototype.drawLineData	= function( data, color ) {
	var bullets			= data['bullets'];
	var startX			= this.options['padding'];
	var startY			= this.height - this.options['padding'];
	var height			= this.height - ( this.options['padding'] * 2 );
	var width			= this.width - ( this.options['padding'] * 2 );
	var length			= bullets.length;
	var color			= color || "default";
	
	this.context.beginPath();
	this.context.moveTo( bullets[0].x, bullets[0].y );
	
	// Add or remove shadow.
	if( this.options['gridShadow'] ) {
		this.context.shadowOffsetX	= 0;
		this.context.shadowOffsetY	= 0;
		this.context.shadowBlur		= this.options['lineSize'] - 1;
		this.context.shadowColor	= this.options['shadowColor'];
	} else {
		this.context.shadowBlur		= 0;
	}
	
	// Set the style.
	this.context.strokeStyle	= this.parseColor( color == "default" ? this.options['lineColor'] : color );
	this.context.lineWidth		= this.options['lineSize'];
	this.context.lineCap		= "round";
	this.context.lineJoin		= "bevel";
	
	// And... GO!
	for( var carrot = 0; carrot < bullets.length; carrot++ ) {
		var bullet		= bullets[carrot];
		var prevBullet	= typeof(bullets[carrot-1]) != "undefined" ? bullets[carrot-1] : bullet;
		var nextBullet	= typeof(bullets[carrot+1]) != "undefined" ? bullets[carrot+1] : bullet;
		
		if( !this.options['lineCurve'] ) {
			this.context.lineTo( bullet.x, bullet.y );
		} else {
			if( length < 3 ) {
				alert( "[graph] cannot curve lines with less than 3 bullets points." );
				return false;
			} else if( carrot == ( bullets.length-1 ) ) {
				break; // We're done, because this loop was +1 the whole time! MAGIC!
			}
			
			if( carrot == 0 ) {
				this.context.moveTo( bullet.x, bullet.y );
			}
			
			this.context.bezierCurveTo(
				data['start'][carrot].x, data['start'][carrot].y,
				data['end'][carrot].x, data['end'][carrot].y,
				nextBullet.x, nextBullet.y
			);
		}
	}
	
	this.context.stroke();
};


// Fill the line data points.
Graph.prototype.fillLineData		= function( data, color ) {
	var bullets			= data['bullets'];
	var startX			= this.options['padding'];
	var startY			= this.height - this.options['padding'];
	var height			= this.height - ( this.options['padding'] * 2 );
	var width			= this.width - ( this.options['padding'] * 2 );
	var length			= bullets.length;
	
	this.context.beginPath();
	this.context.moveTo( startX, startY );
	
	for( var carrot = 0; carrot < bullets.length; carrot++ ) {
		var bullet		= bullets[carrot];
		var prevBullet	= typeof(bullets[carrot-1]) != "undefined" ? bullets[carrot-1] : bullet;
		var nextBullet	= typeof(bullets[carrot+1]) != "undefined" ? bullets[carrot+1] : bullet;
		
		if( !this.options['lineCurve'] ) {
			this.context.lineTo( bullet.x, bullet.y );
		} else {
			if( length < 3 ) {
				alert( "[graph] cannot curve lines with less than 3 bullets points." );
				return false;
			} else if( carrot == ( bullets.length-1 ) ) {
				break; // We're done, because this loop was +1 the whole time! MAGIC!
			}
			
			if( carrot == 0 ) {
				this.context.moveTo( bullet.x, bullet.y );
			}
			
			this.context.bezierCurveTo(
				data['start'][carrot].x, data['start'][carrot].y,
				data['end'][carrot].x, data['end'][carrot].y,
				nextBullet.x, nextBullet.y
			);
		}
	}
	
	this.context.lineTo( startX + width, startY );
	this.context.lineTo( startX, startY );
	this.context.fillStyle		= color;
	this.context.fill();
};


// Get the minimum value from all data pointes.
Graph.prototype.getMinimum			= function(spacing) {
	var minimal		= [];
	var spacing		= spacing === true ? this.options['spacing'] : 0;
	for( var carrot = 0; carrot < this.lines.length; carrot++ ) {
		minimal.push( Math.min.apply( Math, this.lines[carrot]['data'] ) );
	}
	
	return Math.min.apply( Math, minimal ) - spacing;
};


// Get the maximum value from all data pointes.
Graph.prototype.getMaximum			= function( spacing ) {
	var maximal		= [];
	var spacing		= spacing === true ? this.options['spacing'] : 0;
	for( var carrot = 0; carrot < this.lines.length; carrot++ ) {
		maximal.push( Math.max.apply( Math, this.lines[carrot]['data'] ) );
	}
	
	return Math.max.apply( Math, maximal ) + spacing;
};


// Calculate the positions for bullet points (and lines).
Graph.prototype.calculateBulletPoints		= function( data ) {
	var startX			= this.options['padding'];
	var startY			= this.height - this.options['padding'];
	var height			= this.height - ( this.options['padding'] * 2 );
	var width			= this.width - ( this.options['padding'] * 2 );
	var length			= data.length;
	var minValue		= this.options['minValue'] == "auto" ? this.getMinimum(true) : this.options['minValue'];
	var maxValue		= this.options['maxValue'] == "auto" ? this.getMaximum(true) : this.options['maxValue'];
	
	var bulletPoints	= [];
	var distance		= width / ( length - 1 );
	var left			= startX;
	var difference		= Math.abs( maxValue - minValue );
	var onePercent		= height / 100;
	
	for( var carrot = 0; carrot < length; carrot++ ) {
		var value		= data[carrot] - minValue;
		var percentage	= Math.round( ( value / difference ) * 100 );
		var top			= startY - ( onePercent * percentage );
		
		bulletPoints.push( {
			'x':		left,
			'y':		top,
			'value':	data[carrot],
			'number':	carrot
		} );
		
		left		+= distance;
	}
	
	return bulletPoints;
};


// Calculate control point for curving lines.
// Math curtosy of my esteemed colleague, who remains anonymous.
Graph.prototype.calculateControlPoint		= function( data ) {
	var length		= data.length - 1;
	var controlX	= [];
	var controlY	= [];
	var startPoints	= [];
	var endPoints	= [];
	
	for( var carrot = 1; carrot < (length-1); carrot++ ) {
		controlX[carrot]	= 4 * data[carrot].x + 2 * data[carrot+1].x;
		controlY[carrot]	= 4 * data[carrot].y + 2 * data[carrot+1].y;
	}
	
	controlX[0]			= data[0].x + 2 * data[1].x;
	controlY[0]			= data[0].y + 2 * data[1].y;
	controlX[length-1]	= ( 8 * data[length-1].x + data[length].x ) / 2.0;
	controlY[length-1]	= ( 8 * data[length-1].y + data[length].y ) / 2.0;
	
	var controlX	= this.processControlPoint( controlX );
	var controlY	= this.processControlPoint( controlY );
	
	// Starting points.
	for( var carrot = 0; carrot < length; carrot++ ) {
		startPoints[carrot]		= {
			'x':	controlX[carrot],
			'y':	controlY[carrot]
		};
	}
	
	// End points.
	for( var carrot = 0; carrot < length; carrot++ ) {
		if( carrot < (length-1) ) {
			endPoints[carrot]		= {
				'x':	2 * data[carrot+1].x - startPoints[carrot+1].x,
				'y':	2 * data[carrot+1].y - startPoints[carrot+1].y
			};
		} else {
			endPoints[carrot]		= {
				'x':	( data[length].x + startPoints[carrot].x ) / 2,
				'y':	( data[length].y + startPoints[carrot].y ) / 2
			};
		}
	}
	
	return {
		'start':	startPoints,
		'end':		endPoints
	};
};


// Transform the raw control point data, and, well.. do some magic math!
Graph.prototype.processControlPoint		= function( data ) {
	var length		= data.length;
	var results		= [];
	var bezier		= [];
	
	
	// Solve tridiagonal system of n equations (built from constraints on the 
	// first/second derivatives of the cubic Bezier curve within each i-th interval)
	//   - Anonymous Yet Esteemed Colleague, 2011
	bezier[0]	= 2;
	for( var carrot = 1; carrot < length; carrot++ ) {
		var point		= 1 / bezier[carrot-1];
		bezier[carrot]	= ( carrot < (length-1) ? 4.0 : 3.5 ) - point;
		data[carrot]	-= point * data[carrot-1];
	}
	
	results[length-1]	= data[length-1] / bezier[length-1];
	
	for( var carrot = (length - 2); carrot >= 0; carrot-- ) {
		results[carrot]		= ( data[carrot] - results[carrot+1] ) / bezier[carrot];
	}
	
	return results;
};


// Clear all data on the graph.
Graph.prototype.clear		= function() {
	this.context.clearRect( 0, 0, this.width, this.height );
	this.canvas.width	= this.width;
};


// Redraw the entire graph.
Graph.prototype.redraw		= function() {
	this.clear();
	this.draw();
};


// Return the ax X and Y positions for every grid line.
Graph.prototype.getGridAxes			= function() {
	var startX		= this.options['padding'];
	var startY		= this.height - this.options['padding'];
	var height		= this.height - ( this.options['padding'] * 2 );
	var width		= this.width - ( this.options['padding'] * 2 );
	var length		= this.lines[0]['data'].length;
	var distance	= width;
	var output		= {
		'x':	[],
		'y':	'not yet supported'
	};
	
	// Do we have more values?
	if( this.lines.length > 1 ) {
		for( var i = 0; i < this.lines.length; i++ ) {
			if( this.lines[i]['data'].length > length )
				length	= this.lines[i]['data'].length;
		}
	}
	
	// Calculate the distance for the grid.
	distance	= distance / ( length - 1 );
	
	
	
	// Move the carrot 1 'distance' further every time.
	for( var carrot = 0; carrot < length; carrot++ ) {
		var position	= startX + ( carrot * distance );
		output['x'].push( {
			'y':	startY,
			'x':	position
		} );
	}
	
	return output;
};


// Get the closet bullet by the X coordinate. Right now only works
// for the 1st / primary data line.
Graph.prototype.getClosestBullet	= function( nearX, magnify ) {
	var bullets		= this.lines[0]['bullets'];
	var length		= bullets.length;
	var closest		= false;
	var distance	= this.width / ( length - 1 );
	var magnify		= magnify === false ? false : true;
	
	
	// If we change the appearance of the bullet, redraw first.
	if( magnify ) {
		this.redraw();
	}
	
	// Find the bullet!
	for( var carrot = 0; carrot < length; carrot++ ) {
		var bullet		= bullets[carrot];
		var previous	= carrot == 0 ? 0 : bullet.x - distance;
		var half		= Math.floor( (bullet.x-previous) / 2 ) - ( this.options['padding'] / 2 );
		
		if( nearX < previous || nearX > bullet.x ) {
			continue; // not it.
		}
		
		if( nearX <= ( previous + half ) ) {
			closest		= carrot == 0 ? bullet : bullets[carrot-1];
			break;
		} else {
			closest		= bullet;
			break;
		}
	}
	
	// Set the fill style.
	this.context.fillStyle		= this.options['bulletFill'] ? this.parseColor( this.options['bulletColor'] ) : this.context.strokeStyle;
	
	// If we want to magnify, simply draw a bigger bullet!
	if( magnify ) {
		this.context.beginPath();
		this.context.arc( closest.x, closest.y, (this.options['bulletSize']*1.4), 0, Math.PI * 2, false);
		this.context.closePath();
		this.context.fill();
		
		if( this.options['bulletFill'] )
			this.context.stroke();
	}
	
	return closest;
};


// Parse the color, if it's an array create a gradient.
Graph.prototype.parseColor	= function( color ) {
	if( typeof(color) == "object" || typeof(color) == "array" ) {
		var gradient	= this.context.createLinearGradient( 0, 0, 0, this.height );
		var stops		= 1 / (color.length - 1);
		
		for( var i = 0; i < color.length; i++ ) {
			var stop	= i * stops;
			if( stop > 1 ) stop	= 1;

			gradient.addColorStop( stop, color[i] );
		}
		
		return gradient;
	}
	
	return color;
};


// Identify me.
Graph.prototype.toString	= function() {
	return "[object Graph.js]";
};