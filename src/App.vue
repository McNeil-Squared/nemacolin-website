<template lang="pug">
  v-app
    app-header
    app-Navdrawer
    v-content
      v-container(fluid)
        router-view
    app-footer
</template>

<script>
import Header from './components/shared/Header'
import Navdrawer from './components/shared/Navdrawer'
import Footer from './components/shared/Footer'
export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
    appNavdrawer: Navdrawer
  }
}
</script>

<style lang="scss">
  html { overflow-y: auto; }
  // .container { padding-top: 0; }
</style>
