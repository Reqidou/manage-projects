const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://manageapi.qidou.club',// 后端接口
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '/api': '/api/private/v1/'
        }
      }
    }
  }
})
