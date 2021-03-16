module.exports = {
  lintOnSave: false, // 关闭eslint检查
  // 修改 src 为 examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 强制内联CSS
  css: { extract: false },
  productionSourceMap: false,
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  },
  // 代理服务器配置
  devServer: {
    open: true,
    hot: true,
    sockHost: 'http://127.0.0.1',
    port: 8023,     // 端口
    proxy: {
      '/graphics': {
        target: 'http://192.168.10.168:65530',
        ws: true,
        changeOrigin: true,
        pathRewrite: {}
      }
    }

  }
};
