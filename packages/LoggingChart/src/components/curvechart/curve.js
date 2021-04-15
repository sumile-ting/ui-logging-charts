import BasicChart from '../chart.js';
import {getLineScale, getColorLineScale} from '../../../../util/common'
import {_FILL_LEGEND_BASE64} from '../../../../util/constants'

class curveChart extends BasicChart {
  constructor(element, data, config, cfg) {
    super(element, data, config, cfg)
  }


  /**
   * init chart
   */
  initChart() {

  }


  // /**
  //  * 获取坐标标尺位置信息
  //  *
  //  * @param {any} minMax
  //  */
  _getTickPositions(minMax) {
    const interval = 10;
    const min = minMax[0];
    const max = minMax[1];
    const il = (max - min) / interval;
    const tickPositions = [];
    for (let i = 1; i < interval; i++) {    // 第一个和最后一个和图道重合， 不显示
      tickPositions.push((min + il * i));
    }
    // tickPositions.push(max);// 第一个和最后一个和图道重合， 不显示
    return {
      'tickPositions': tickPositions,
      'minorTickInterval': ''
    };
  }

  /**
   * 获取线性Y轴坐标
   */
  _getYAxis() {
    const yAxis = [];
    this.cfg.titles.forEach((t, i) => {
      let minMax = this.config.minMax[t];
      minMax = [Number(minMax[0]), Number(minMax[1])];
      const isLog = this.config.isLog && this.config.isLog[t];
      const yAxisType =  isLog ? 'logarithmic':  'linear';
      const min = minMax[0];
      const max = minMax[1];
      const isReversed = isLog && min > max;
      const y = {
        id: t,
        type: yAxisType,
        min: isReversed ? max : min,
        max: isReversed ? min : max,
        endOnTick: false,
        startOnTick: false,

        lineWidth: 0,
        labels: {
          enabled: false
        },
        title: {
          enabled: false
        },
        reversed: isReversed,
        visible: i == 0
      }
      if(isLog) {
        yAxis.push(Object.assign({ minorTickInterval: 0.1}, y));
      } else {
        yAxis.push(Object.assign({ tickAmount: 10}, y));
      }
    })
    return yAxis;
  }

  /**
   * 获取Y轴坐标
   */
  getYAxis() {
    return this._getYAxis();
  }

    /**
     * 获取series的扩展属性，区分左杆状、曲线+marker和普通 曲线类型
     * @param curveType
     * @param lineWidth
     * @private
     */
  _getSeriesExtendOption(title, lineWidth) {
    const curveType = this.config.curveType ? this.config.curveType[title] : 'line';
    let seriesOpt = {};
      if(curveType == 'hLine') {
        seriesOpt = {grouping: false, shadow: false, pointWidth: lineWidth,  pointPlacement: 'on', type: 'column'}
      } else if (curveType == 'scattercurve') {
        seriesOpt = {type: 'line', marker: {enabled: true, symbol: 'circle'}};
      } else {
        seriesOpt = {type: 'line'};
      }
      return seriesOpt
  }

  /**
   * 添加曲线数据
   */
  addCurveSeries() {
    const series = [];
    this.cfg.titles.forEach((t) => {
      const points = this.data[t.split('-')[0]];
      const copyPoints = Object.assign([], points);
      let lineWidth = this.config.lineWidth[t];
      const seriesOpt = this._getSeriesExtendOption(t, lineWidth);
      const crossBorderHandler = this.config.crossBorderHandler[t] ? this.config.crossBorderHandler[t].value : undefined;
      if (crossBorderHandler) {
        let seriesData = this._crossBorderDataHandle(copyPoints, t);
        let crossBorderCurveColor = (this.config.crossBorderHandler[t].color || this.config.colors[t]);
        let crossBorderCurveDashstyle = this.config.crossBorderHandler[t].dashstyle || this.config.dashstyle[t];
        let crossBorderCurveLineWidth = this.config.crossBorderHandler[t].lineWidth || lineWidth;
        const serie = {
          dashStyle: crossBorderCurveDashstyle,
          lineWidth: crossBorderCurveLineWidth,
          color: crossBorderCurveColor,
          yAxis: t,
          name: t,
          turboThreshold: 0,
          data: seriesData,
          zIndex: 1
        };
        series.push(Object.assign({}, seriesOpt, serie))
      }
      const serie = {
        id: 'series_' + t,
        lineWidth: lineWidth,
        name: t,
        color: this.config.colors[t],
        yAxis: t,
        data: points,
        turboThreshold: 0,
        dashStyle: this.config.dashstyle[t],
        zIndex: 1
      };

      series.push(Object.assign({}, seriesOpt, serie));
    })
    return series;
  }

  /**
   * 越界处理
   * @param data
   * @param title
   * @param style
   * @returns {[]}
   */
  _crossBorderDataHandle(data, title) {
    const minMax = this._findMinMax(title, data);
    let result = [];
    // var len = data.length;
    data.forEach((t) => {
      let point = minMax[0] - 0.1;
      if (t.y != null && t.y < minMax[0]) {
        point = minMax[1] - Math.abs(t.y - minMax[0]) % (minMax[1] - minMax[0]);
      } else if (t.y != null && t.y > minMax[1]) {
        point = minMax[0] + (t.y - minMax[1]) % (minMax[1] - minMax[0]);
      }
      result.push({
        x: t.x,
        y: parseFloat(point.toFixed(2)),
        addition: t.y
      });
    });
    return result;
  }

  /**
   * 获取最大值和最小值
   *
   * @param {any} t
   * @param {any} data
   */
  _findMaxMin(t) {
    var minMax = this.config.minMax[t];
    if (minMax) {
      return [Number(minMax[0]), Number(minMax[1])];
    }
    return null;
  }

  /**
   * 获取log坐标的最大值和最小值
   *
   * @param {any} t
   * @param {any} data
   */
  _findLogMaxMin(t) {
    return this.config.minMax[t];
  }

  _getValueFromFill(title, value, minMax) {
    var minMaxSetting = [parseFloat(this.config.minMax[title][0]), parseFloat(this.config.minMax[title][1])];
    if (value == 'min') {
      return minMax[0] < minMaxSetting[0] ? minMax[0] : minMaxSetting[0];
    } else if (value == 'max') {
      return minMax[1] > minMaxSetting[1] ? minMax[1] : minMaxSetting[1];
    } else {
      return parseFloat(value);
    }
  }

  /**
   *
   * @param datas
   * @param low
   * @param high
   */
  _pushColorCodeFillData(x, low, high) {
    var lowNum = Number(low);
    var highNum = Number(high);
    return [{
      low: lowNum,
      high: highNum,
      x: x
    }, (highNum - lowNum)];
  }

  /**
   *
   * @returns {Array}
   */
  _getColorCodeFillData(fill, data, title) {
    var datas = {
      lowhigh: [],
      differs: []
    };
    var from = fill.from;
    var to = fill.to;
    var minMax = this._findMaxMin(from);
    var toMinMax = this._findMaxMin(to);
    data[from] = (data[from.split('-')[0]] || []);
    data[to] = (data[to.split('-')[0]] || []);
    if (!minMax) {
      minMax = toMinMax;
      let value = this._getValueFromFill(title, fill.from, minMax);
      data[from] = data[to].map(function (to) {
        return {
          x: to.x,
          y: value
        }
      })
    }
    if (!toMinMax) {
      toMinMax = minMax;
      let value = this._getValueFromFill(title, fill.to, toMinMax);
      data[to] = data[from].map(function (from) {
        return {
          x: from.x,
          y: value
        }
      })
    }
    var sacle = getLineScale(toMinMax[0], toMinMax[1], minMax[0], minMax[1])
    var fromData = data[from];
    var toData = data[to];
    fromData.forEach((from, i) => {
      var res = this._pushColorCodeFillData(from.x, from.y, sacle(toData[i].y));
      datas.lowhigh.push(res[0]);
      datas.differs.push(res[1]);

    });

    return datas;
  }


  /**
   * 色标填充
   * @param fillDatas
   * @param fill
   * @param isLog
   * @param data
   */
  _pushColorCodeFillSeris(fillDatas, fill, data, title) {
    var ser = this._getPublicColorCodeFillSerObject();
    var all = this._getColorCodeFillData(fill, data, title);
    var datas = all['lowhigh'];
    var differs = all['differs'];
    var min = Math.min.apply(null, differs);
    var max = Math.max.apply(null, differs);
    var colorScale = getColorLineScale(min, max, fill.fillType);
    datas.forEach((d, i) => {
      d.color = colorScale(differs[i]);
    })
    ser.yAxis = title;
    ser.data = datas;
    fillDatas.push(ser);
  }

  _getPublicColorCodeFillSerObject() {
    return {
      type: 'columnrange',
      pointPadding: 0,
      groupPadding: 0,
      borderWidth: 0,
      states: {
        hover: {
          enabled: false,
        }
      },
      turboThreshold: 0
    }
  }

  /**
   *
   * @param t
   * @param data
   */
  _findMinMax(t, data, style) {
    var minMax = this.config.minMax[t];
    if (!minMax) {
      if (style === 'liner') return this._findMaxMin(t, data);
      else if (style === 'log') return this._findLogMaxMin(t);
    }
    return [Number(minMax[0]), Number(minMax[1])];
  }

  /**
   * 获取线间填充的数据
   * @param fill
   * @param data
   * @param isLog
   */
  _getbetweenFillData(fill, data, policy) {
    var datas = [];
    var from = fill.from;
    var to = fill.to;
    var minMax = this._findMaxMin(from);
    var toMinMax = this._findMaxMin(to);
    if(this.config.isLog  && this.config.isLog[from]) {
        minMax = [Math.log10(minMax[0]), Math.log10(minMax[1])];
    }
    if(this.config.isLog && this.config.isLog[to]) {
        toMinMax = [Math.log10(toMinMax[0]), Math.log10(toMinMax[1])];
    }
    var sacle = getLineScale(toMinMax[0], toMinMax[1], minMax[0], minMax[1]);
    var fromData = data[from.split('-')[0]];
    var toData = data[to.split('-')[0]];
    if (!fromData || !toData) return;
    fromData.forEach((from, i) => {
      if (toData[i]) {
        if (this.config.isLog && this.config.isLog[from]) {
          toData[i].y = Math.pow(10, sacle(Math.log10(toData[i].y)));
        } else {
          toData[i].y = sacle(toData[i].y);
        }
        this._pushFillData(datas, from, toData[i], policy);
      }

    });

    return datas;
  }

  /**
   *
   * @param datas
   * @param low
   * @param heigh
   */
  _pushFillData(datas, low, high, policy) {
    var lowNum = Number((low.y || low.y == 0) ? low.y : low);
    var highNum = Number((high.y || high.y == 0) ? high.y : high);
    if (policy === 'low') {
      if (lowNum > highNum) lowNum = highNum;
    } else if (policy === 'high') {
      if (lowNum < highNum) lowNum = highNum;
    }
    datas.push({
      low: lowNum,
      high: highNum,
      x: (low.x || high.x || 0)
    })
  }

  /**
   *
   * @param fill
   * @param fillColor
   * @returns
   */
  _getPublicFillSerObject(fill, fillColor, fillShap) {
    let fillShapBase64 = _FILL_LEGEND_BASE64[fillShap];
    return {
      type: "arearange",
      lineWidth: 0,
      states: {
        hover: {
          enabled: false,
        }
      },
      fillColor: {
        pattern: fillShapBase64 || ' ',
        width: 10,
        height: 10,
        color: fillColor
      },
      turboThreshold: 0
    }
  }

  /**
   *
   * @param fillDatas
   * @param fill
   * @param isLog
   * @param data
   * @param policy
   */
  _pushFillSeris(fillDatas, fill, data, policy) {
    var fillColor, fillShap;
    if (policy === 'low') {
      fillColor = fill['lessColor'], fillShap = fill['shap'];
    } else if (policy === 'high') {
      fillColor = fill['moreColor'];
      fillShap = fill['moreShap'];
    }
    var ser = this._getPublicFillSerObject(fill, fillColor, fillShap);
    if (fill['isbetween']) {
      var betweenFillDatas = this._getbetweenFillData(fill, data, policy);
      ser.yAxis = fill.from;
      ser.data = betweenFillDatas;
    } else {
      var datas = this._getfillData(fill, data, policy);
      ser.yAxis = fill.title;
      ser.data = datas;
    }
    fillDatas.push(ser);
  }

  /**
   *
   * @param title
   * @param data
   * @param fillTar
   */
  _getfillData(fill, data, policy) {
    var datas = [];
    var from = fill.from.split('-')[0];
    var to = fill.to.split('-')[0];
    var title = fill.title;
    var minMax = this._findMaxMin(title);
    if (from === 'max') from = minMax[1];
    else if (from === 'min') from = minMax[0];
    else if (data[from]) from = data[from.split('-')[0]];

    if (to === 'max') to = minMax[1];
    else if (to === 'min') to = minMax[0];
    else if (data[to]) to = data[to.split('-')[0]];
    if (Array.isArray(from)) {
      from.forEach((f) => {
        f.y = f.y < minMax[0] ? minMax[0] : f.y;
        f.y = f.y > minMax[1] ? minMax[1] : f.y;
        this._pushFillData(datas, f, to, policy);
      })
    } else {
      to.forEach((t) => {
        t.y = t.y < minMax[0] ? minMax[0] : t.y;
        t.y = t.y > minMax[1] ? minMax[1] : t.y;
        this._pushFillData(datas, from, t, policy);
      })
    }
    return datas;
  }

  /**
   * 曲线填充
   * @param title
   * @param data
   */
  _fillSeries(title, data, template) {
    var fills = template['fills'];
    if (!fills) return [];
    var fillTar = fills[title];
    if (!Array.isArray(fillTar)) return [];
    data = JSON.parse(JSON.stringify(data));
    var fillDatas = [];
    fillTar.forEach((fill) => {
      if (fill['fillType']) {
        this._pushColorCodeFillSeris(fillDatas, fill, data, fill.title);
      } else { // 纯色和图案填充， 如果是图案，把fill.shap = 'none',
        if (fill['lessColor'])
          this._pushFillSeris(fillDatas, fill, data, 'low');
        if (fill['moreColor'])
          this._pushFillSeris(fillDatas, fill, data, 'high');
      }
    });
    return fillDatas;
  }

  /**
   * 添加填充曲线
   */
  addFillSeries() {
    return this._fillSeries(this.cfg.titles.join('-'), this.data, this.config)
  }
}

export default curveChart
