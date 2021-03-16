<template>
  <div :style="{overflow: 'auto', height: chartBodyHeight}">
    <div class="chart-outter-wrapper" :style="{width: chartWidth}">
      <template v-for="(item, index) in template.titles">
        <chart :key="index" :index="index" :vScale="vScale" :depthMin="depthMin"  :depthMax="depthMax" :config="template" :data="chartDatas" :titles="item">
            <template v-slot:header>
              <component :is="getComponentName(item, 'header')"
                   :config="template" :titles="item"/>
            </template>
            <template v-slot:body>
              <component :key="index" :index="index" :is="getComponentName(item, 'body')" :vScale="vScale" :depthMin="depthMin"
                   :depthMax="depthMax" :config="template" :data="chartDatas" :titles="item"/>
            </template>
        </chart>
      </template>
    </div>
  </div>
</template>

<script>
    import {getWellStartEnd, getwellbore} from '../../api/well';
    import {CHART_BODY_TRANSFORM_MAP, CHART_HEADER_TRANSFORM_MAP} from '../../util/constants'
    import Chart from "./components/chart.vue";
    import CurveHeader from './components/curvechart/curveHeader'
    import CurveBody from './components/curvechart/curveBody'
    import TextHeader from './components/scalechart/textHeader'
    import ScaleBody from './components/scalechart/scaleBody'
    import {mmToPX} from "../../util/common";
    import {store} from '../../store/store'

    export default {
        name: 'LoggingChart',
        components: {Chart, CurveHeader, CurveBody, TextHeader, ScaleBody },
        props: {
            templateId: {
                type: String,
                required: true
            },
            vScale: {
                type: Number,
                required: true,
                default: 500
            },
            jingHao: {
                type: String,
                required: true
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
            xcType: {
                type: String,
                required: true,
                default: 'X'
            }
        },

        data() {
            return {
                template: {},
                chartDatas: {},
                chartWidth: 0
            }
        },
        computed: {
            // ...mapState(['templates']),
            // template() {
            //   return store.state.templates
            // },
            chartBodyHeight() {
                let dataLength = this.depthMax - this.depthMin;
                const scale = (this.vScale || 100) / 100;
                const px = this.mmToPX(10)
                return  (dataLength * px / scale  + mmToPX(this.template.headerHeight) + 4)+ 'px';
            },
        },
        watch: {
          'template.width': function (widths) {
             this.chartWidth = (widths.reduce((a, b) => a + mmToPX(b), 0) + 2 )+ 'px';
          }
        },
        methods: {
            mmToPX(input) {
                return mmToPX(input)
            },
            async init() {
                let startEnd = await getWellStartEnd(this.jingHao, this.xcType);
                if (!startEnd || startEnd.length === 0) {
                    console.error("没有深度信息");
                }
                this.loadChartData(startEnd);
            },
            async loadChartData(startEnd) {
                const min = this.depthMin || Math.max(Math.ceil(startEnd.end), startEnd.validEnd + 10);
                const max = this.depthMax || Math.max(startEnd.validStart - 5, 0);
                const params = {
                    "wzbz": 0,
                    'jh': this.jingHao,
                    'templateId': this.templateId,
                    'start': min,
                    'end': max,
                    xcType: this.xcType
                }
                console.log(store)
                const allData = await getwellbore(store.state.templates[this.templateId], params);
                var template = store.state.templates[this.templateId] || JSON.parse(allData.template);
                // this.$store.dispatch('template/setTemplateAction', {
                //     templateId: this.templateId, template });
                store.setTemplateAction(this.templateId, template)
                this.initChart(template, allData)
            },
            initChart(template, allData) {
                this.template = template;
                this.chartDatas = allData
            },
            getComponentName(titles, from) {
                if (!Array.isArray(titles) || titles.length === 0) return undefined;
                let type = this.template.type[titles[0]]; // || 'curve';
                if(from === 'header') {
                    return CHART_HEADER_TRANSFORM_MAP[type]
                } else {
                    return CHART_BODY_TRANSFORM_MAP[type]
                }

            }
        },
        mounted() {
            this.init();
        }
    }
</script>
<style>
   @import '../../assets/vue-logging-charts.scss';
</style>
<style scoped>
  .chart-outter-wrapper {
    height: 100% ;
    font-size: 12px;
    font-family: 'SimSun';
    overflow: auto;
    position: relative;
    margin: 0px auto;
    background-color: #ffffff;
  }

  .chart-outter-wrapper::-webkit-scrollbar {
    display: none;
  }
</style>
