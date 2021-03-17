import './util/highcharts'
import './util/highcharts-pattern-fill'
import LoggingChart from './LoggingChart';
import store from './store'
const components = [
  LoggingChart
];
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

    // 动态注册store
  if(opts.store) {
     opts.store.registerModule("templates", store);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  LoggingChart
};
