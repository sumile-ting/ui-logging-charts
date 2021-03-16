<template>
  <div ref="chart" style="width: 100%;" :style="{height: chartOptions.chartHeight + 'px'}">

  </div>
</template>

<script>
    import BasicChart from './../chart.vue'
    import ScaleChart from './scale'
    export default {
        name: "scaleBody",
        extends: BasicChart,
        data() {
          return {
              chartOptions: {
                  chartHeight: this.chartHeight()
              }
          }
        },
        mounted() {
          this.chart = new ScaleChart(
            this.$refs.chart,
            JSON.parse(JSON.stringify(this.data)),
            this.config,
            {
                vScale: this.vScale,
                titles: this.titles

            }
          )
      },
    }
</script>

<style scoped>

</style>
