import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false
  },
  getters: {
    navDrawer: state => { return state.navDrawer }
  },
  mutations: {
    toggleDrawer: (state) => {
      state.navDrawer = !state.navDrawer
    }
  },
  actions: {
    toggleDrawer: ({ commit }) => {
      commit('toggleDrawer')
    }
  }
})
