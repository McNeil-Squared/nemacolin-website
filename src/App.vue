<template lang="pug">
  v-app
    app-header
    app-Navdrawer
    v-content
      v-container(fluid)
        v-fade-transition
          router-view
    app-footer
</template>

<script>
import Header from './components/shared/Header'
import Navdrawer from './components/shared/Navdrawer'
import Footer from './components/shared/Footer'
import firebase from 'firebase'

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
    appNavdrawer: Navdrawer
  },
  created () {
    if (this.$store.getters.user == null) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user)
          this.$store.dispatch('setUserData', user)
            .catch(error => console.log(error))
        }
      })
    }
  }
}
</script>

<style lang="scss">
  html { overflow-y: auto; }
  img:not(.nemacolin-avatar) { max-width: 100%; }
  a { text-decoration: none; }
</style>
