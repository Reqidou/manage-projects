import Vue from 'vue'
import VueRouter from 'vue-router'


//路由懒加载
const Login = () => import('@/components/login/Login')
const Home = () => import('@/components/home/Home')
const Welcome = () => import('@/components/home/childComps/Welcome')
const Users = () => import('@/components/home/childComps/user/Users')
const Rights = () => import('@/components/power/rights/Rights')
const Roles = () => import('@/components/power/roles/Roles')
const Cate = () => import('@/components/goods/cate/Cate')
const Params = () => import('@/components/goods/params/Params')
const List = () => import('@/components/goods/list/List')
const Add = () => import('@/components/goods/list/Add')
const Order = () => import('@/components/order/Order')
const Report = () => import('@/components/report/Report')

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
    },
    {
      path: 'rights',
      component: Rights
    },
    {
      path: 'roles',
      component: Roles
    },
    {
      path: 'categories',
      component: Cate
    },
    {
      path: 'params',
      component: Params
    }, 
    {
      path: 'goods',
      component: List
    }, 
    {
      path: 'goods/add',
      component: Add
    },
    {
      path: 'orders',
      component: Order
    },
    {
      path: 'reports',
      component: Report
    },
  ]
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
