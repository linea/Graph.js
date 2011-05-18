# CHANGELOG

## v0.3 - Released [not yet]

 * Fixed: when the shadow was enabled, the line-filling also had a shadow making it darker than it should be.
 * Added: new option: `options['gridDotted']` to make the grid lines dotted.
 * Added: new option: `options['axisSize']` to specify the axis line size. (value 'auto' to use Grid setting)
 * Added: new option: `options['axisColor']` to specify the axis line color. (value 'auto' to use Grid setting)
 * Added: new option: `options['axisShadow']` to give the axis line a shadow. (value 'auto' to use Grid setting)

## v0.2 - Released May 18th, 2011

 * Added: new sample files demonstrating some of the changes.
 * Fixed: Issue #4 - Improved support for multiple data lines and `getClosestBullet`.
 * Added: Issue #3 - Added border support (new options `options['border']` and `options['borderColor']`)
 * Added: Issue #2 - Support for meta-data per data point. (also the new option: `options['valueKey']`)
 * Added: new method `getOffset()` and option `options['useOffset']` to improve ease of use for `getClosestBullet`.

## v0.1 - Released May 17th, 2011

This was the initial release, so basic feature set.