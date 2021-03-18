import BasicChart from '../chart.js';
import {getLineScale} from '../../../../util/common'
import Highcharts from 'highcharts'

const HAN_YOU_JI_BIE_WIDTH = 0.2;
const _DEFAULT_COLOR = "#fff";
const _TATH_STROKE = {
    'stroke': '#000',
    'stroke-width': '1'
};

export default class LithologyChart extends BasicChart {
    constructor(element, data, config, cfg) {
        super(element, data, config, cfg);
    }


    /**
     * init Chart
     */
    initChart() {
        this._setDimensions();
        let lithologyData = this._transf(this.data[this.cfg.titles[0]]);
        const ctrlWidth = this.config.yxSetting.ctrlWidth === 'true'
        const renderer = new Highcharts.Renderer(this.element, this.cfg.width, this.cfg.height);
        let groups = this._getGroups(this.data[this.cfg.titles[0]], renderer, ctrlWidth); // 加载图案
        this._drawYxImage(renderer, lithologyData, groups, ctrlWidth);
    }

    /**
     * 设置画图区域宽高
     * @private
     */
    _setDimensions() {
        this.cfg.width = this.element.offsetWidth;
        this.cfg.height = this.element.offsetHeight;
    }

    /**
     * 整理岩性数据
     * @param data
     * @private
     */
    _transf(data) {
        let flatDatas = [];
        data.forEach((item, i) => {
            let datas = this._caculCoordinate(item, i, this.cfg.min, this.cfg.max);
            Array.prototype.push.apply(flatDatas, datas);
        });
        return flatDatas;
    }

    /**
     * 计算在坐标轴上的坐标(剩余的添加到上一条中去)
     *
     * @param {any} item 每一个岩性数据
     * @param {any} i 数据的索引
     */
    _caculCoordinate(item, groupId, min, max) {
        const scale = getLineScale(this.cfg.min, this.cfg.max, 0, this.cfg.height);
        let start = item.start < min ? min : item.start;
        let end = item.end > max ? max : item.end;
        if (end - start < 0) {
            return;
        }
        start = scale(start);
        end = scale(end);
        let other = item.hyjb ? item.hyjb.trim() : undefined;
        let litholopys = item.lithologys;
        let width = item.width;
        let allHeight = end - start;
        let otherWidth = HAN_YOU_JI_BIE_WIDTH;
        let datas = [];
        let yxLeft = 0;
        if (other) {
            let hyjbBase64 = item.hyjbBase64;
            this._pushData(datas, 0, start, otherWidth, allHeight, hyjbBase64, groupId); //添加油气的图形
            yxLeft = otherWidth;
        }
        this._pushLithology(datas, litholopys, allHeight, start, yxLeft, groupId, width);
        return datas;
    }

    /**
     * 将数据存放到数组中
     * @param arr 数组
     * @param left
     * @param top
     * @param width
     * @param height
     * @param svg svg文件的名称
     * @param base64 不控制宽度的岩性图例的base64
     * @param base64Width 控制宽度的岩性图例的base64
     * @param gourpId 组名
     */
    _pushData(arr, left, top, width, height, svg, base64, base64Width, groupId) {
        arr.push({
            left: left,
            top: top,
            width: width,
            height: height,
            svg: svg,
            base64: base64,
            base64Width: base64Width,
            groupIndex: groupId
        });
    }

    /**
     * 添加岩性数据
     * @param datas 放入数据的集合
     * @param litholopys 图标集合
     * @param allHeight 总高度
     * @param top 顶的位置
     * @param left 左偏移量
     * @param groupId
     * @param width 岩性的宽度
     */
    _pushLithology(datas, litholopys, allHeight, top, left, groupId, width) {
        if (litholopys.length == 0) return;
        let first = litholopys[0];
        let unit = first.height;
        let iters = Math.floor(allHeight / unit);
        if (iters == 0) {
            this._pushData(datas, left, top, width, allHeight, first.svg, first.base64, first.controlWidthbase64, groupId);
        } else {
            let vargUnit = allHeight / iters;
            for (let i = 0; i < iters;) {
                for (let j = 0; j < litholopys.length; j++) {
                    let it = litholopys[j];
                    this._pushData(datas, left, top + i * vargUnit, width, vargUnit, it.svg, it.base64, it.controlWidthbase64, groupId);
                    if (++i >= iters) break;
                }
            }
        }
    }

    _getGroups(data, renderer, ctrlWidth) {
        var groups = [];
        const min = this.cfg.min, max = this.cfg.max;
        const scale = getLineScale(this.cfg.min, this.cfg.max, 0, this.cfg.height);

        data.forEach((d, i) => {
            let start = d.start < min ? min : d.start;
            let end = d.end > max ? max : d.end;
            let h = end - start;
            let name = d.name;
            let colorName = d.colorName;

            let title = `起始深度：${start.toFixed(2)}<br />`;
            title += `结束深度：${end.toFixed(2)}<br />`;
            title += `厚度：${h.toFixed(2)}<br />`;
            title += `岩性：${colorName}${name}<br />`;

            if (d.hyjbMc) {
                title += `含油级别：${d.hyjbMc}`;
            }
            var group = renderer.g().add();
            let data = Object.assign({}, d);
            data.start = start;
            data.end = end;
            this._drawBackgroud(renderer, group, data, scale, this.cfg.width, ctrlWidth); //绘制每个组的背景颜色（用正方形填充）
            var lable = undefined;
            group.on("mousemove", () =>  {
                let zoomNum = 1;
                lable = this._yanXingLable(lable, event, renderer, title, (zoomNum || 1));
            });
            group.on("mouseout", () => {
                lable = this._destroyYanXingLable(lable);
            });
            groups.push(group);
        });

        return groups;
    }

    /**
     * 绘制岩性的背景颜色
     * @param renderer
     * @param g
     * @param data
     */
    _drawBackgroud(renderer, g, data, scale, width, ctrlWidth) {
        var top = scale(data.start);
        var end = scale(data.end);
        var finalWidth = this._getYxWidth(data, width, ctrlWidth);
        var finalLeft = this._getLeft(data, width);
        let color = data.color ? "rgb(" + data.color.replace(/\./gi, ",") + ")" : _DEFAULT_COLOR;
        renderer
            .rect(finalLeft, top, finalWidth, end - top, 0)
            .attr({
                fill: color,
                'stroke': '#000',
                'stroke-width': '0.5',
                'shape-rendering': 'crispEdges'
            })
            .add(g);
    }

    /**
     * 获取岩性的宽度，
     * @param data
     * @param width null 或者 不控制宽度的统一宽度
     */
    _getYxWidth(data, width, ctrlWidth) {
        var finalWidth = width;
        if (ctrlWidth)
            finalWidth = width * data.width;
        if (data.hyjb && data.hyjb.trim()) {
            if (finalWidth > width * HAN_YOU_JI_BIE_WIDTH) { // 防止宽度为20的岩性碰见含有级别显示不出来
                finalWidth -= width * HAN_YOU_JI_BIE_WIDTH;
            }
        }
        return finalWidth;
    }

    /**
     *
     * @param data
     * @returns {number}
     */
    _getLeft(data, width) {
        if (data.hyjb && data.hyjb.trim()) return width * HAN_YOU_JI_BIE_WIDTH;
        else return 0;
    }

    /**
     * 鼠标悬浮在岩性上面的事件
     * @param lable
     * @param event
     * @param renderer
     */
    _yanXingLable(lable, event, renderer, title, zoomNum) {
        if (lable && lable.destroy) lable.destroy();
        var y = event.offsetY / zoomNum - 85;
        if (event.offsetY / zoomNum <= 85) y = 5;
        lable = renderer
            .label(title, event.offsetX / zoomNum + 5, y)
            .css({
                color: "#111",
                align: "center"
            })
            .attr({
                fill: "#fff",
                padding: 8,
                r: 5
            })
            .add();

        return lable;
    }

    /**
     * 鼠标移走后销毁lable
     * @param lable
     */
    _destroyYanXingLable(lable) {
        if (lable) lable.destroy();
        lable = undefined;
        return lable;
    }

    /**
     * 加载岩性svg
     * @param renderer
     * @param lithologyData
     * @param groups
     * @param widthNum
     */
    _drawYxImage(renderer, lithologyData, groups, ctrlWidth) {
        const widthNum = this.cfg.width;
        lithologyData.forEach((lithology) => {
            let left = lithology.left * this.cfg.width;
            let top = lithology.top;
            let height = lithology.height;
            let groupIndex = lithology.groupIndex;
            let width, svg;
            if (lithology.svg != null) {
                if (ctrlWidth) {
                    width = widthNum * lithology.width;
                    svg = lithology.base64Width; // 使用base64的显示
                    if (lithology.svg.indexOf("-") === -1) { // 表示含油级别符号
                        // width = widthNum * HAN_YOU_JI_BIE_WIDTH; // 含油级别的图标宽度固定
                        let topAndHeight = this._caculateHyjbTopAndHeight(renderer, top, height, width, left);
                        top = topAndHeight[0];
                        height = topAndHeight[1];
                        left = topAndHeight[2];
                        width = height + left;
                        svg = lithology.svg;
                    }
                } else {
                    width = widthNum;
                    svg = lithology.base64;
                    if (lithology.svg.indexOf("-") === -1) { // 表示含油级别符号
                        width = widthNum * HAN_YOU_JI_BIE_WIDTH; // 含油级别的图标宽度固定
                        let topAndHeight = this._caculateHyjbTopAndHeight(renderer, top, height, width, left);
                        top = topAndHeight[0];
                        height = topAndHeight[1];
                        left = topAndHeight[2];
                        width = height + left;
                        svg = lithology.svg;
                    }
                }
                if (lithology.svg && lithology.svg.trim()) {
                    let w = width - left;
                    if (w === 0) { // 防止宽度为20的岩性碰见含有级别显示不出来
                        w = width;
                    }
                    renderer.image(svg, left, top, w, height).attr({
                        zIndex: 1
                    }).add(groups[groupIndex]);
                }
            }
        });
    }

    /**
     * 计算含油级别的位置, 调整成正三角形
     * @param {*} top
     * @param {*} height
     * @param {*} width
     */
    _caculateHyjbTopAndHeight(renderer, top, height, width, left) {
        renderer.path(['M', 0, top, 'L', width, top]).attr(_TATH_STROKE).add(); // 先画条分割线
        let line = Math.min(height, width);
        if (height > width) {
            top += (height - width) / 2;
        } else if (height < width) {
            left += (width - height) / 2;
        }
        return [top, line, left];
    }
}
