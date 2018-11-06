import '@babel/polyfill'
import Vue from 'vue'
import firebase from './firebase'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'whatwg-fetch'

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
