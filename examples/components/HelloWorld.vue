<template>
  <logging-chart
          :template-id="templateId"
          :jing-hao="jingHao"
          :v-scale="vScale"
          :depth-max="depthMax"
          :depth-min="depthMin"
          :xc-type="xcType">

  </logging-chart>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      templateId: 'db5c722c-4e9c-4bd7-b049-5ec0391ac74e',
      jingHao: "东7-39",
      vScale: 500,
      depthMin: 16,
      depthMax: 2108,
      xcType: 'X'
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
