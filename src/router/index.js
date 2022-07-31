import Vue from 'vue'
import VueRouter from 'vue-router'

//路由懒加载
const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if(to.path === '/login')
    return next() 
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)
    next('/login') //强制跳转
  next()
})
export default router
