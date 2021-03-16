<template>
  <div class="chart-inner-wrapper"  :style="{marginLeft: marginLeft + 'px'}">
    <div class="chart-header" :style="{height: mmToPX(config.headerHeight) + 'px', width: mmToPX(config.width[index])+ 'px'}">
      <slot name="header" :config="config" :titles="titles">
      </slot>
    </div>
    <div class="chart-body" :style="{width: mmToPX(config.width[index])+ 'px', marginTop: mmToPX(config.headerHeight) + 'px'}">
      <slot name="body" :vScale="vScale" :depthMin="depthMin" :depthMax="depthMax" :config="config" :data="data" :titles="titles"></slot>
    </div>
  </div>


</template>
<script>
  import mixin from '../../../mixin'
  export default {
    name: 'chart',
    data() {
      return {
        chart: {}
      }
    },
    mixins: [mixin],
    props: {
      config: {
        type: Object,
        required: true,
        default: () => ({})
      },
      data: {
        type: Object,
        required: false,
        default: () => ({})
      },
      depthMin: {
        type: Number,
        required: false,
        default: 0
      },
      depthMax: {
        type: Number,
        required: false,
        default: 10000
      },
      vScale: {
        type: Number,
        required: false,
        default: 500
      },
      titles: {
          type: Array,
          required: true,
          default: () => ([])
      },
      index: {
          type: Number,
          required: false,
          default: 0
      }
    },
    computed: {
        marginLeft() {
            let width = 0;
            for(let i=0; i < this.index; i++) {
                width += this.mmToPX(this.config.width[i]);
            }
            return width;
        }
    },
    watch: {
      config: {
        handler(val) {
          this.chart.updateConfig(val)
        },
        deep: true
      },
      datum(vals) {
        this.chart.updateData([...vals])
      }
    },
    methods: {
        chartHeight() {
            let dataLength = this.depthMax - this.depthMin;
            const scale = (this.vScale || 100) / 100;
            const px = this.mmToPX(10)
            return  dataLength * px / scale;
        }
    },
    beforeDestroy() {
      // this.chart.destroyChart()
    }
  }
</script>

<style>

.chart-header {
  border: 1px solid #000;
  position: fixed;
  z-index: 999;
  background-color: #ffffff;
}
  .chart-body {
    border: 1px solid #000;
    border-top: none;
    position: absolute;
  }
</style>
