import Vue from 'vue'
import VueRouter from 'vue-router'

<<<<<<< HEAD
<<<<<<< HEAD
const Login = () => import('@/components/login/Login')
=======
//路由懒加载
const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
>>>>>>> login
=======
const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
const Welcome = () => import('@/components/home/childComps/Welcome')
const Users = () => import('@/components/home/childComps/user/Users')

>>>>>>> user

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
<<<<<<< HEAD
>>>>>>> login
=======
    redirect: '/home/welcome',
    children: [{
      path: 'welcome',
      component: Welcome,
    },{
      path: 'users',
      component: Users
    }]
>>>>>>> user
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
