//导入ele组件
import Vue from 'vue'
//全局导入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 修改语言
// import zhLocale from 'element-ui/lib/locale/lang/en' // 中文
// import locale from 'element-ui/lib/locale'

// locale.use(zhLocale)

// Vue.use(ElementUI)
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
