<template>
  <div ref="chart" style="width: 100%;" :style="{height: chartOptions.chartHeight + 'px'}">

  </div>
</template>

<script>
    import BasicChart from './../chart.vue'
    import DepthSymbolChart from './depthSymbol'
    export default {
        name: "depthSymbolBody",
        extends: BasicChart,
        data() {
          return {
              chartOptions: {
                  chartHeight: this.chartHeight()
              }
          }
        },
        mounted() {
          this.chart = new DepthSymbolChart(
            this.$refs.chart,
            JSON.parse(JSON.stringify(this.data)),
            this.config,
            {
                vScale: this.vScale,
                titles: this.titles,
                min: this.depthMin,
                max: this.depthMax

            }
          )
      },
    }
</script>

<style scoped>

</style>
