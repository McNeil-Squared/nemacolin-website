<template lang="pug">
  div
    Banner(:bannerStyles="bannerStyles" :bannerText="bannerText")
    Services.mt-4
    v-layout.mt-4(row wrap)
      v-flex(xs12 md8)
        About.mr-2-md-and-up
      v-flex(xs12 md4)
        Events.ml-2-md-and-up.mt-4-sm-and-down
</template>

<script>
import Banner from '../components/Banner'
import Services from '../components/Services'
import About from '../components/About'
import Events from '../components/Events'
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
  components: { Banner, Services, About, Events }
}
</script>
