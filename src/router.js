import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: () => import('./views/Home.vue'), meta: { title: 'Nemacolin Home' } },
    { path: '/sewage', name: 'sewage', component: () => import('./views/Sewage.vue'), meta: { title: 'Sewage Service' } },
    { path: '/trash', name: 'trash', component: () => import('./views/Trash.vue'), meta: { title: 'Trash Service' } },
    { path: '/park', name: 'park', component: () => import('./views/Park.vue'), meta: { title: 'Nemacolin Park' } },
    { path: '/info', name: 'info', component: () => import('./views/Info.vue'), meta: { title: 'Resident Information' } },
    { path: '/faqs', name: 'faqs', component: () => import('./views/FAQs.vue'), meta: { title: 'Frequently Asked Questions' } },
    { path: '/contact', name: 'contact', component: () => import('./views/Contact.vue'), meta: { title: 'Contact Us' } }
  ]
})
