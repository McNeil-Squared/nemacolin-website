<template lang="pug">
  v-app
    app-header
    app-Navdrawer
    v-content
      v-container(fluid)
        transition(name="fade" mode="out-in")
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

  .v-dialog--active { background-color: #fff; }
  p.link { color: blue; }
  p.link:hover { cursor: pointer; }

  .loading {
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
  }
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }

  .disabledUser {
    border: 3px solid #ba1b1d
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    transition: opacity .3s;
  }

  .fade-leave-active {
    transition: opacity .3s;
    opacity: 0;
  }

  /*highlight form fields with errors*/
  .form-field--errors .v-input__slot {
    border: 1px solid #ba1b1d;
  }
</style>
