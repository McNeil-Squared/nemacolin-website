<template lang="pug">
  v-app
    app-header
    v-content
      v-container(fluid)
        router-view
    app-footer
</template>

<script>
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
export default {
  components: {
    appHeader: Header,
    appFooter: Footer
  }
}
</script>
