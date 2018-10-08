<template lang="pug">
  div
    app-banner(:bannerStyles="bannerStyles" :bannerText="bannerText")
    v-layout(row wrap)
      app-services
      app-news
</template>

<script>
import Banner from '../components/Banner'
import Services from '../components/Services'
import News from '../components/News'
export default {
  data () {
    return {
      bannerStyles: {
        height: '300px',
        background: `url(${require('../assets/nemacolin.jpg')}) no-repeat center`,
        'justify-content': 'center'
      },
      bannerText: {
        heading: 'Welcome to Nemacolin!',
        subheading: 'The is the website for Nemacolin Incorporated, the municipal authority for Nemacolin Village.'
      }
    }
  },
  components: {
    appBanner: Banner,
    appServices: Services,
    appNews: News,
  }
}
</script>
