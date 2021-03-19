import BasicChart from '../chart.js';
import {getLineScale} from '../../../../util/common'
import Highcharts from 'highcharts'

class depthSymbolChart extends BasicChart {
    constructor(element, data, config, cfg) {
        super(element, data, config, cfg);

    }


    /**
     * init chart
     */
    initChart() {
        this._setDimensions();
        this._drawChart();
    }

    /**
     * 画图
     * @private
     */
    _drawChart() {
        const title = this.cfg.titles[0];
        const datas = this.data[title];
        if (!datas || datas.length === 0) return;
        const renderer = new Highcharts.Renderer(this.element, this.cfg.width, this.cfg.height);
        const scale = getLineScale(this.cfg.min, this.cfg.max, 0, this.cfg.height);
        datas.forEach(d => {
            var path = d.symbol;
            var depth = d.depth;
            if (depth > this.cfg.max) {
                return
            }
            const yOffset = 10;
            let imgWidth = 20;
            let imgHight = 40;
            const xoffset = Math.max((this.cfg.width - imgWidth) >> 1, 0);
            if (path) {
                renderer.image(path, xoffset, (scale(depth) - yOffset), imgWidth, imgHight).add();
            }
            const remark = d.addition.bz;
            if (remark) {
                const ele = document.createElement('div');
                ele.className = 'custom-jdg-bz';
                ele.style.top = scale(depth) + 'px';
                if(remark.length > 10) {
                     ele.style.textAlign = 'left';
                }
                this.element.appendChild(ele);
                const innerEle = document.createElement('div');
                innerEle.innerHTML = remark;
                innerEle.className = 'custom-jdg-title'
                ele.appendChild(innerEle)

            }
        })
    }

    /**
     * 设置画图区域宽高
     * @private
     */
    _setDimensions() {
        this.cfg.width = this.element.offsetWidth;
        this.cfg.height = this.element.offsetHeight;
    }

}

export default depthSymbolChart

