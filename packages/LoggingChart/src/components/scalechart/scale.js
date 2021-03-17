import {axisLeft} from 'd3-axis'
import {select, selectAll, mouse} from 'd3-selection'
import {line} from 'd3-shape'

import BasicChart from '../chart.js';
import {getLineScale} from '../../../../util/common'

const d3 = {select, selectAll, axisLeft, line, mouse}

class scaleChart extends BasicChart {
  constructor(element, data, config, cfg) {
    super(element, data, config, cfg);

  }


  /**
   * init chart
   */
  initChart() {
    this.selection = d3.select(this.element);
    this._getDimensions();
    this._renderDepthChart();
    this._setChartDimension();
  }

  _renderDepthChart() {
    this.svg = this.selection.append("svg").attr('overflow', 'visible');
    const jsData = this.data[this.cfg.titles[0]];
    if (!jsData) {
      return;
    }
    const [min, max] = [...jsData];

    let originalData = [];
    for (let i = min; i <= max; i++) {
      originalData.push(i);
    }

    const labelInterval = this.cfg.vScale / 20;
    const monirInterval = labelInterval / 5;
    const axisData = originalData.filter(d => d % monirInterval === 0);
    const xScale = getLineScale(min, max, 0, this.cfg.height);
    const axis = d3.axisLeft(xScale)
      .tickSize(15)
      .tickValues(axisData)
      .tickFormat(d => (d % labelInterval === 0) ? d : "");

    const x_axis = this.svg.append("g")
      .attr("transform", `translate(${this.cfg.width}, 0)`)
      .call(axis);

    x_axis.selectAll('g').select('line').attr('shape-rendering', 'crispEdges').attr('stroke-width', '1').attr('x2', -10);
    x_axis.selectAll('g').select('text').attr('x', -12).classed("axis-font", true);
    x_axis.selectAll('g')
      .filter(d => d % monirInterval === 0 && d % labelInterval !== 0)
      .classed("minor", true)
      .select('line')
      .attr('x2', -5)
      .attr('shape-rendering', 'crispEdges');
    this.svg.on("mousemove mouseleave", () => this._chartDepthMoveEvent(xScale));
  }

  _chartDepthMoveEvent(scale) {
    const svg = this.svg;
    let line = d3.line().x(d => d[0]).y(d => d[1]); // 线条生成器
    let eventType = window.event.type;
    if (eventType === 'mouseleave') {
      this._drawcursor(svg, [], line);
      this._drawcursorText(svg, []);
    } else if (eventType === 'mousemove') {
      let position = d3.mouse(svg.node());
      let y = position[1];

      this._drawcursor(svg, this._getCursorData(y), line);
      this._drawcursorText(svg, this._getTextData(y, scale));
    }
  }

  /**
   *
   * @param {*} svg
   * @param {*} data
   */
  _drawcursorText(svg, data) {
    let text =
      svg.selectAll("text.cursor").data(data);
    text.enter()
      .append("text")
      .attr("fill", "black")
      .attr("class", "cursor")
      .merge(text)
      .attr("transform", d => `translate(${d.x}, ${d.y - 5})`)
      .text(d => d.text);

    text.exit().remove();
  }

  /**
   *
   * @param {*} svg
   * @param {*} data
   * @param {*} line
   */
  _drawcursor(svg, data, line) {
    let pathLines = svg.selectAll("path.line")
      .data(data);
    pathLines
      .enter()
      .append("path")
      .merge(pathLines)
      .style("stroke", "black")
      .attr("class", "line")
      .attr("d", function (d) {
        return line(d);
      })
      .attr('shape-rendering', 'crispEdges');

    pathLines.exit().remove();
  }


  /**
   *
   */
  _getCursorData(y) {
    return [
      [
        [-1000, y],
        [2000, y]
      ]
    ];
  }

  /**
   *
   * @param {*} y
   */
  _getTextData(y, scale) {
    let depth = scale.invert(y).toFixed(2)
    let data = []
    for (let i = -5; i < 10; i++) {
      if (i !== 0)
        data.push({
          x: 200 * i,
          y: y,
          text: depth
        })
    }

    return data;
  }

  _setChartDimension() {
    // Resize SVG element
    this.svg.attr("width", this.cfg.width).attr("height", this.cfg.height);
  }

  /**
   * Set up chart dimensions
   */
  _getDimensions() {
    this.cfg.width = parseInt(this.selection.node().offsetWidth);
    this.cfg.height = parseInt(this.selection.node().offsetHeight);
    this.element.parentElement.parentElement.style.zIndex = '999';
  }
}

export default scaleChart

