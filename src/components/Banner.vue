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
    }
</style>
