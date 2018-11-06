import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import firebase from 'firebase'

firebase.firestore().settings({ timestampsInSnapshots: true })

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false,
    user: null
  },
  getters: {
    navDrawer (state) {
      return state.navDrawer
    },
    userData (state) {
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
    setUser (state, userData) {
      state.user = userData
    },
    logout (state) {
      state.user = null
      router.push('/')
    }
  },
  actions: {
    toggleDrawer ({ commit }) {
      commit('toggleDrawer')
    },
    signin ({ dispatch }, loginData) {
      firebase.auth().signInWithEmailAndPassword(loginData.email, loginData.password)
        .then(dispatch('refreshLogin'))
        .then(router.push('/'))
        .catch(error => console.log(error))
    },
    refreshLogin ({ commit }) {
      let currentUser = firebase.auth().currentUser
      if (currentUser != null) {
        firebase.firestore().collection('users').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let dbdata = doc.data()
              let userData = {
                displayName: currentUser.displayName,
                uid: currentUser.uid,
                firstName: dbdata.firstName,
                lastName: dbdata.lastName,
                email: dbdata.email,
                phone: dbdata.phone,
                house: dbdata.house,
                pobox: dbdata.poBox,
                position: dbdata.position,
                role: dbdata.role
              }
              commit('setUser', userData)
            })
          })
          .catch(error => console.log(error))
      }
    },
    logout ({ commit }) {
      firebase.auth().signOut()
        .then(commit('logout'))
        .catch(error => console.log(error))
    }
  }
})
