<template>
  <highcharts ref="highcharts" :options="chartOptions"></highcharts>

</template>

<script>
  import BasicChart from './../chart.vue'
  import CurveChart from './curve.js'
  import {Chart} from 'highcharts-vue'

  export default {
    name: 'curveBody',
    components: { highcharts: Chart },
    extends: BasicChart,
    data() {
        return  {
          chartOptions: {
            chart: {
                // type: 'spline',
                height: this.chartHeight()
            },
            xAxis: {
                min: this.depthMin,
                max: this.depthMax,
                lineWidth: 0,
                gridLineWidth: 1,
                tickLength: 0,
                tickInterval: 20,
                visible: true,
                labels: {
                    enabled: false,
                },
                opposite: true
            },
            tooltip: { // 数据提示框
                shared: true,
                backgroundColor: 'rgba(247, 247, 247, 1)',
            },
            yAxis: [],
            series: []
          }
      }
    },
    mounted() {
      this.chart = new CurveChart(
        this.$refs.highcharts,
        JSON.parse(JSON.stringify(this.data)),
        this.config,
        {
            titles: this.titles

        }
      );
      const template = this.config;
      this.chartOptions.tooltip = {
          formatter: function () {
              var a = '深度: ' + this.x.toFixed(2) + ' ' + "m" + '<br />';
              let points = this.points;
              for(let i = 0; i < points.length; i++) {
                  let series = points[i].series;
                  if(!series.name.startsWith('Series') && points[i].point.isInside) {
                    const title = series.name.split("-")[0];
                    const displayName = template.displayName[title] || title;
                    const number = points[i].point.addition || points[i].point.y;
                    a += "<span class='prompt' style='color:" + series.color + "'>" + (displayName) + ': ' + number + "</span><br>";
                  }

              }
              return a;
          }
      }
      this.chartOptions.yAxis = this.chart.getYAxis();
      this.chartOptions.series = [  ...this.chart.addCurveSeries(), ...this.chart.addFillSeries()];
    },
    beforeDestroy() {
        // this.$refs.highcharts.destroy()
        this.chart.destroyChart();
    }
  }
</script>

<style scoped>

</style>
