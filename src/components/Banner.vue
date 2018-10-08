<template lang="pug">
  v-layout.banner--wrapper(row wrap)
    v-flex.text-xs-center(xs12 md4)
      p.title {{ bannerText.heading }}
      p.body2 {{ bannerText.subheading }}
    v-flex(xs12 md8)
      div.banner(:style='bannerStyles')
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
  .banner--wrapper {
    // margin-top: 49px;
    // @media screen and (min-width: 960px) {
    //   margin-top: 57px;
    // }
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
  }
</style>