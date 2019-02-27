import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Index.vue'
import Login from './components/_auth/Login.vue'
import Register from './components/_auth/Signup.vue'
import Vendors from './components/_dashboard/vendors.vue'
import Pay from './components/_dashboard/pay.vue'
import _History from './components/_dashboard/history.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect:{name:'vendors'},
      children: [{ path: '/vendors',name:'vendors', component: Vendors },{ path: '/history', name:'history' , component: _History },{ path: '/pay', name:'pay', component: Pay }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
