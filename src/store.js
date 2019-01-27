import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

firebase.firestore().settings({ timestampsInSnapshots: true })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false,
    user: null,
    resetPasswordModal: false,
    targetUser: { firstName: '', lastName: '' }
  },
  getters: {
    navDrawer (state) {
      return state.navDrawer
    },
    user (state) {
      return state.user
    }
  },
  mutations: {
    toggleDrawer (state) {
      state.navDrawer = !state.navDrawer
    },
    userLoginError (state) {
      state.status = 'fail'
      state.sending = 'false'
    },
    setUserData (state, userData) {
      state.user = userData
    },
    removeUserSessionData (state) {
      state.user = null
    },
    toggleResetPasswordModal (state) {
      state.resetPasswordModal = !state.resetPasswordModal
    },
    setTargetUser (state, user) {
      state.targetUser = user
    }
  },
  actions: {
    toggleDrawer ({ commit }) {
      commit('toggleDrawer')
    },
    setUserData ({ commit }, user) {
      return new Promise((resolve, reject) => {
        firebase.firestore().collection('users').doc(user.uid).get()
          .then((doc) => {
            let currentUser = doc.data()
            let userData = {
              displayName: user.displayName,
              uid: user.uid,
              verified: user.emailVerified,
              username: currentUser.username,
              role: currentUser.role
            }
            commit('setUserData', userData)
            resolve('success')
          }).catch(error => reject(error))
      })
    },
    removeUserSessionData ({ commit }) {
      commit('removeUserSessionData')
    },
    toggleResetPasswordModal ({ commit }) {
      commit('toggleResetPasswordModal')
    },
    setTargetUser ({ commit }, user) {
      commit('setTargetUser', user)
    }
  }
})
