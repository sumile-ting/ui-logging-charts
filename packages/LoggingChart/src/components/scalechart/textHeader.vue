<template>
  <div style="height: 100%">
    <div type="text" :id="title + '_Lenged'" class="text-header-text"
      :style="{color: config.fontColor[title]}">
      <span class="text">
        {{config.displayName[title] || title}}
      </span>
    </div>
  </div>
</template>

<script>
  import BasicChart from './../chart.vue'
    export default {
        name: "textHeader",
        extends: BasicChart,
        computed: {
            title() {
                return this.titles[0]
            }
        }
    }
</script>

<style scoped>
.text-header-text {
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}
.text-header-text .text {
    writing-mode: tb-rl;
    height: 100%;
}
</style>
