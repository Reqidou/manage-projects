import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式表
import './assets/css/global.css'
// 导入elementui
import './plugins/element.js'
// 引入图标库
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
