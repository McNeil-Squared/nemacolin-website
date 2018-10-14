<template lang="pug">
  v-layout.text-xs-center(row wrap :style='bannerStyles')
    v-flex(xs12)
      p.title {{ bannerText.heading }}
      p.subheading.px-2 {{ bannerText.subheading }}
</template>

<script>
export default {
  props: {
    bannerStyles: {
      type: Object,
      required: true
    },
    bannerText: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
    .title {
      margin-top: 2.0rem;
      margin-bottom: 4.0rem;
    }

    .title, .subheading {
      color: #fff;
    }
    .banner {
      display: flex;
      width: 100%;
      align-items: center;
      margin: 0.5rem 0;
      @media screen and (max-width: 600px) {
        height: 150px !important;
      }
      // .quote {
      //   font-family: 'butteredToast', sans-serif;
      //   text-align: center;
      //   font-size: 1.25rem;
      //   color: #fff;
      //   margin: 0;
      //   padding: 0 0.35rem;
      //   @media screen and (min-width: 600px) {
      //     font-size: 2.0rem;
      //     padding: 0 1.5rem;
      //     .attribution { font-size: 1.25rem; }
      //   }
      //   .attribution {
      //     font-family: 'Roboto', sans-serif;
      //     display: inline-block;
      //     width: 100%;
      //     text-align: right;
      //     font-size: 1.0rem;
      //     @media screen and (min-width: 600px) {
      //       font-size: 1.25rem;
      //     }
      //   }
      // }
    }
</style>