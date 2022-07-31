import Vue from 'vue'
import VueRouter from 'vue-router'

<<<<<<< HEAD
const Login = () => import('@/components/login/Login')
=======
//路由懒加载
const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
>>>>>>> login

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
<<<<<<< HEAD
    redirect: '/login',
=======
    redirect: '/login'
>>>>>>> login
  },
  {
    path: '/login',
    component: Login,
<<<<<<< HEAD
=======
  },
  {
    path: '/home',
    component: Home,
>>>>>>> login
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
