<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md6)
      v-card.mr-2.v-card--modifications
      v-card-title(primary-title)
        h3.headline.mx-auto.primary--text Sewage Service
      p.px-4.mt-4 Sewage service for Nemacolin is provided by a private sewage treatment plant.&nbsp;&nbsp;Nemacolin Inc employs a Certified Plant Operator to run and maintain the plant as required by Pennsylvania Law.
      p.px-4 Nemacolin Inc maintains the main sewage lines and manholes for the sewage system.
      p.title.px-4 Sewage lines that connect individual homes to the main sewage line are the responsibility of the homeowner/property owner.
    v-flex(xs12 md6)
      img(:src="src" :alt="alt" )
      p replace this pic with a pic of our sewage plant
</template>

<script>
import img from '../assets/sewage plant.jpg'
export default {
  data () {
    return {
      src: img, alt: 'Sewage Plant'
    }
  }
}
</script>
