import Highcharts from 'highcharts'
import highchartMore from 'highcharts/highcharts-more'
highchartMore(Highcharts)
// Highcharts全局设置
Highcharts.setOptions({
    boost: {
        useGPUTranslations: true,
        seriesThreshold: 1
        // usePreallocated: true
    },
    plotOptions: {
        series: {
           marker: {
             enabled: false
           },
          states: {
              hover: {
                enabled: false
              }
          },
          animation: false
        }
    },
    loading: {
        labelStyle: {
            color: 'white'
        },
        style: {
            backgroundColor: 'gray'
        }
    },
    chart: {
        inverted: true, // 反转坐标
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
        spacingTop: 0
    },
    title: {
        text: null
    },
    tooltip: { // 数据提示框
        useHTML: true,
        style: {
            padding: '2px',
            fontSize: '10px',
        },
        formatter: function () {
            let seriesName = this.series.name;
            if (seriesName.startsWith("Series")) {
                return false;
            }
            return `深度: ${this.x} m<br/>${seriesName}: ${this.y}`;
        }
    },
    legend: { // 图例
        enabled: false,
    },
    exporting: { // 导出
        enabled: false,
    },
    credits: { // 版权信息
        enabled: false
    },
    lang: {
        resetZoomTitle: '恢复',
        resetZoom: '恢复',
        printChart: '打印图表',
        contextButtonTitle: '导出',
        downloadJPEG: '导出JPEG图片',
        downloadPDF: '导出PDF文件',
        downloadPNG: '导出PNG图片',
        downloadSVG: '导出SVG图形'
    }
})
