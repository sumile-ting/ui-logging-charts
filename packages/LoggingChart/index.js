import LoggingChart from './src/logging.chart'

LoggingChart.install = function (Vue) {
  Vue.component(LoggingChart.name, LoggingChart)
}

export default LoggingChart
