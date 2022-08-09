import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入全局样式表
import './assets/css/global.css'
// 导入elementui
import './plugins/element.js'
// 引入图标库
import './assets/fonts/iconfont.css'
// 导入树形插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入编辑栏 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor, /* { default global options } */)

//vue内注册时间戳
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  //变为字符串，使用padStart（objectLength, '填充数据'）
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
