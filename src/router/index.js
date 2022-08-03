import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
const Welcome = () => import('@/components/home/childComps/Welcome')
const Users = () => import('@/components/home/childComps/user/Users')


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
    redirect: '/home/welcome',
    children: [{
      path: 'welcome',
      component: Welcome,
    },{
      path: 'users',
      component: Users
    }]
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
