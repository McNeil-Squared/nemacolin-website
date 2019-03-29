<template lang="pug">
  div
    app-banner(:bannerStyles="bannerStyles" :bannerText="bannerText")
    app-services
    v-container(fluid)
      v-layout.mt-4(row wrap justify-center)
        app-about
        v-flex(xs12 md4)
          app-news
</template>

<script>
import Banner from '../components/Banner'
import Services from '../components/Services'
import About from '../components/About'
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
        subheading: 'This is the website for Nemacolin Incorporated, the municipal authority for Nemacolin Village.'
      }
    }
  },
  components: {
    appBanner: Banner,
    appServices: Services,
    appAbout: About,
    appNews: News
  }
}
</script>
