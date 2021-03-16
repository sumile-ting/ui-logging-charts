/**
 * Highcharts pattern fill plugin
 *
 * Author:         Torstein Honsi
 * Last revision:  2014-04-29
 * License:        MIT License
 *
 * Options:
 * - pattern:      The URL for a pattern image file
 * - width:        The width of the image file
 * - height:       The height of the image file
 * - color1:       In oldIE, bright colors in the pattern image are replaced by this color.
 *                 Not yet implemented in SVG.
 * - color2:       In oldIE, dark colors are replaced by this.
 */

/* eslint-disable */
/*global Highcharts */
import Highcharts from 'highcharts'

var idCounter = 0;

Highcharts.wrap(Highcharts.SVGElement.prototype, 'fillSetter', function (proceed, color, prop, elem) {
    var id,
        pattern;
    if (color && color.pattern && prop === 'fill') {
        id = 'highcharts-pattern-' + idCounter++;
        pattern = this.renderer.createElement('pattern')
            .attr({
                id: id,
                patternUnits: 'userSpaceOnUse',
                width: color.width,
                height: color.height
            })
            .add(this.renderer.defs);
        if (color.color) {
            this.renderer.rect(0, 0, color.width, color.height)
                .attr({
                    fill: color.color
                })
                .add(pattern);
        }
        if (color.pattern.indexOf('none.svg') === -1)
            this.renderer.image(
                color.pattern, 0, 0, color.width, color.height
            ).add(pattern);
        elem.setAttribute(prop, 'url(' + this.renderer.url + '#' + id + ')');
    } else {
        return proceed.call(this, color, prop, elem);
    }
});
