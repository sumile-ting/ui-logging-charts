class BasicChart {
  constructor(element, data, config, cfg) {
    this.data = data;
    this.config = config;
    this.element = element;
    this.cfg = cfg;

    // Resize listener
    this.onResize = () => {this.resizeChart()}
    window.addEventListener("resize", this.onResize);

    this.initChart();
  }

  /**
   * init chart mothods
   */
  initChart() {

  }

  /**
   * resize chart methods
   */
  resizeChart() {
     this.updateChart();
  }

  /**
    * Update chart methods
    */
    updateChart(){

    }

    /**
    * Destroy chart methods
    */
    destroyChart(){
        window.removeEventListener("resize", this.onResize);
    }
}

export default BasicChart
