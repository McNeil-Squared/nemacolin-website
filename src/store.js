import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false
  },
  getters: {
    navDrawer (state) {
      return state.navDrawer
    }
  },
  mutations: {
    toggleDrawer (state) {
      state.navDrawer = !state.navDrawer
    },
    userLoginError (state) {
      state.status = 'fail'
      state.sending = 'false'
    }
  },
  actions: {
    toggleDrawer ({ commit }) {
      commit('toggleDrawer')
    }
  }
})
