<template lang="pug">
  div
    app-banner(:bannerStyles="bannerStyles" :bannerText="bannerText")
    app-services.mt-4
    v-layout.mt-4(row wrap)
      v-flex(xs12 md8)
        app-about.mr-2-md-and-up
      v-flex(xs12 md4)
        app-news.ml-2-md-and-up.mt-4-sm-and-down
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
