<template lang="pug">
  div
    app-banner
    v-layout(row wrap)
      app-services
      app-news
</template>

<script>
import Banner from '../components/Banner'
import Services from '../components/Services'
import News from '../components/News'
export default {
  components: {
    appBanner: Banner,
    appServices: Services,
    appNews: News,
  }
}
</script>
