<template>
  <div style="height: 100%; position: relative">
    <div v-for="title in titles" type="Curve" class="curve-header-wrapper" :id="title + '_Legend'" :key="title"
         :style="{height: (mmToPX(config.headerHeight) /  titles.length) + 'px'}">
      <div class="header_text_cu" :style="{color: config.fontColor[title]}" style="margin-bottom: 14px">
              <span style="display: inline-block;">
                {{config.displayName[title]}}
              </span>
      </div>
      <div class="header-curve-path"
           :style="{borderTopWidth: config.lineWidth[title] + 'px', borderTopColor: config.colors[title], borderTopStyle: lineStyleTansfer(config.dashstyle[title])}">
      </div>
      <div class="header_text_cu" :style="{color: config.fontColor[title]}" style="margin-top: 13px">
        <span style="display: inline-block; position: absolute;left: 5px; ">{{config.minMax[title][0]}}</span>
        <span style="display: inline-block;">{{config.unit[title]}}</span>
        <span style="display: inline-block; position: absolute;right: 5px; "> {{config.minMax[title][1]}}</span>
      </div>
    </div>
  </div>

</template>

<script>
    import BasicChart from './../chart.vue'
    export default {
        name: "curveHeader",
        extends: BasicChart,
    }
</script>

<style scoped>

</style>
