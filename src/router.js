import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      meta: { title: 'Nemacolin Home' }
    },
    {
      path: '/sewage',
      name: 'sewage',
      component: () => import('./views/Sewage.vue'),
      meta: { title: 'Sewage Service' }
    }
  ]
})
