# Graph.js

## Purpose

A lightweight JavaScript class for drawing line graphs in a canvas element, that doesn't do any DOM manipulations.

## Features
  
 * Highly (and easily) configurable line graph.
 * Multiple data lines in different colors
 * Optionally add meta-data per data point
 * Additional methods to add functionality (e.g. mouseover bubble, html labels)
 * Included a minified version for quick download

## To Do

 * Add support for horizontal grid lines (include `y` label support in `getGridAxes()`)

## Concept behind Graph.js

For a project I was working on I needed to add a simple line graph, and while there are plenty of good options out there, most of them were to bloated for my needs, or depended on some library I wasn't using — besides I love creating my own components, getting my hands dirty. I've created this simplified lightweight version as a result, it doesn't do any DOM manipulation so if you want labels — you'll need to add them yourselves. To help you do this, I have included a couple methods, demonstrated in the (poorly written) vanilla JavaScript examples.

There is also no detection for canvas support, so old fashioned browsers will not work by default and there is no alternative. You might be able to get them to work, at least for IE, with the `excanvas` project. But I have not tried this myself.

## Example

Example from examples/sample1_basic.html:

	<script type="text/javascript" src="graph.min.js"></script>
	<script type="text/javascript">
		var canvas	= document.getElementById( "canvas_object" );
		var graph	= new Graph( canvas, [10,20,50,20,30,60,10], true );
	</script>
	
	<canvas id="canvas_object" width="800" height="400">
		Your browser does not support the HTML Canvas object, so... no graph for you!
	</canvas>
	
### Meta data 

In some cases you might want to add some more data than just 1 number for a data point. You might want to show both the whole number, and the % that it is at the same time. This is one of the supported options, and it's fairly easy in use as demonstrated in sample7_metadata.html. Instead of an array filled with numeric values, you pass an array with objects - and the key of one of these objects will contain the actual value used to create the graph, the rest will be stored for later use. Which key contains the numeric value is also adjustable, by changing `options['valueKey']`, the default is just value but some people prefer to use another name, or are stuck in a predefined format.

When using `getClosestBullet` the result(s) will contain the meta-data that you entered for it, within the `meta` property. So for example `closest.meta['percentage']` could contain the percentage for the given value.

## Documentation

### new Graph( canvas[, dataPoints, draw] );

Create a new Graph instance for said canvas, with the optional parameters you can make it immediately draw the graph with the given data — instead of calling the draw method later.

Parameters:

* `canvas`: Requires a pure DOM Canvas element.
* `dataPoints`: An array filled with numbers.
* `draw`: A boolean to start drawing the graph or not, default is false.

#### addLine( dataPoints[, lineColor, fillColor] )

Add a new line with the given dataPoints, and optionally you can give it a new color. Please note, that combined with multiple data lines you can specify a different fill color for every line - however when they overlap this might not give the desired effect. Please play around with it, `rgba()` colors are also supported.

Parameters:

* `dataPoints`: An array filled with numbers.
* `lineColor`: A textual representation of a color (e.g. `red`, `#ff0000`, `rgb(255,0,0)`), defaults to the 'default' options color.
* `fillColor`: A textual representation of a color (e.g. `red`, `#ff0000`, `rgb(255,0,0)`), defaults to the 'default' options color.

#### draw()

Draw the graph for the first time, useful if you didn't specify that the graph immediately draws in the constructor.

#### redraw()

Redraw the graph, a very useful method if you add/update/deleted data.

#### options['name']	= value;

The options are available in a simple array form on the graph, you can overwrite them easily. A quick sample, can also be found in the examples directory (sample2_options.html) but it is advised to just play around with them so you can see what they actually do.

	var graph		= new Graph( canvas );
	graph.options['minValue']		= "auto";
	// Will automatically get the lowest number from your data array.
	
	graph.options['maxValue']		= "auto";
	// Will automatically get the highest number from your data array.
	
	graph.options['padding']		= 50;
	// The padding from the canvas border to where the grid/graph begins.
	
	graph.options['spacing']		= 20; 
	// This helps prevent lines from being EXACTLY ON the top/bottom axis line of the graph.
	
	graph.options['border']			= 20;
	// This border is 'inside' the canvas restrictions, same idea as padding except padding leaves the background
	// and border will not let the background start at 0,0 but at borderSize,borderSize.
	
	graph.options['borderColor']	= "#000";
	// By default the border will be just plain white, but maybe you prefer it to be some other color.
	
	graph.options['background']		= ["#fff","#eee","#ddd"];
	// Background, either string ('#fff', or 'red') or array with strings representing colors for a gradient.
	
	graph.options['grid']			= true;
	// Enable the background lines/grid. Only Vertical and bottom line support for now.
	
	graph.options['gridSize']		= 0.2;
	// The size of the background lines/grid. Can be half as well (0.5)
	
	graph.options['gridColor']		= "rgba(0, 0, 0, 0.3 )";
	// The color for the background lines/grid.
	
	graph.options['gridShadow']		= false;
	// Give the grid a small shadow as well for depth effect.
	
	graph.options['gridDotted']		= true;
	// Give the grid a small shadow as well for depth effect.
	
	graph.options['axisSize']		= 1;
	// The size for the axis lines (left and bottom line). Use "auto" to use the same setting as `gridSize`.
	
	graph.options['axisColor']		= "#000";
	// The color for the axis lines (left and bottom line). Use "auto" to use the same setting as `gridColor`.
	
	graph.options['axisShadow']		= false;
	// The shadow option for the axis lines (left and bottom line). Use "auto" to use the same setting as `gridShadow`.
	
	graph.options['bullets']		= true;
	// Show bullets for the data points from your data array.
	
	graph.options['bulletSize']		= 5;
	// The radius of the bullet points.
	
	graph.options['bulletColor']	= "#000";
	// The inside color of the bullet, only visible if you have 'bulletFill' enabled.
	
	graph.options['bulletFill']		= true;
	// Enable or disable the inside color for the bullet.
	
	graph.options['bulletShadow']	= true;
	// Give the bullet a shadow, or don't! Your choice. 
	
	graph.options['shadowColor']	= "rgba(0, 0, 0, 0.6)";
	// The color for all shadows (grid/bullet/etc)
	
	graph.options['fill']			= true;
	// Do you want to fill the data from line to bottom (nice effect if you use an alpha color)
	
	graph.options['fillColor']		= "rgba(255,0,87,0.2)";
	// The color, only visible if you enable 'fill'.
	
	graph.options['lineSize']		= 3;
	// The size of the line.
	
	graph.options['lineCurve']		= true;
	// Do you want the line to curve, or not?
	
	graph.options['lineColor']		= "#ff0059";
	// Which color is the line (and bullets/bullet outside)
	
	graph.options['useOffset']		= true;
	// Tranforms input coordinates (e.g. `mouseX`) to relative coordinates.
	
	graph.options['valueKey']		= "value";
	// When using meta-data, which key contains the actual numeric value.

### Methods you can use to extend Graph functionality.

#### getClosestBullet( mouseX[, magnify] )

Determine what the closest bullet point is near the `mouseX` position, you have to manually calculate this (relative) position though. An example can be found in the examples directory, sample4_mouseover.html — optionally you can have this method magnify the closest bullet so you can visually represent where the user is.

Parameters:

* `mouseX`: The X coordinate where your mouse is, or finger, or whichever X you wish.
* `magnify`: A boolean to determine if you want to highlight the closest bullet, defaults to false;

#### getGridAxes()

Returns an object, containing positions for both the `x` and `y` gridlines. The current version does not (yet) contain `y` gridlines so it will be an empty array, the `x` will be an array filled with objects containing the `x`,`y` position where you can put your label. A sample can be found in the examples directory, sample5_labels.html

#### getMinimum()

Returns the lowest value from all available data points. Useful for multiple things, like manually changing the `minValue` option.

#### getMaximum()

Returns the highest value from all available data points. Useful for multiple things, like manually changing the `maxValue` option.

#### getOffset()

Returns an object with `x`,`y` offset for the `canvas` object, used internally if `options['useOffset']` is enabled, otherwise still useful feature.

## Minified with YUI! Compressor

This is the simple way this version has been minified, in case you were wondering. Also a note for myself so I can make it consistent throughout versions.

	java -jar yuicompressor-2.4.2.jar graph.js --line-break 300 --preserve-semi --output graph.min.js