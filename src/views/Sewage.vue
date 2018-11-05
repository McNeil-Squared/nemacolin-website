<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md6)
      h3.headline.text-xs-center.primary--text Sewage Service
      p.px-4.mt-4 Sewage service for Nemacolin is provided by a private sewage treatment plant.&nbsp;&nbsp;Nemacolin Inc employs a Certified Plant Operator to run and maintain the plant as required by Pennsylvania Law.
      p.px-4 Nemacolin Inc maintains the main sewage lines and manholes for the sewage system.
      p.title.px-4 The line that connects individual homes to the main sewage line is the responsibility of the homeowner/property owner.
    v-flex(xs12 md6)
      img(:src="src" :alt="alt" )
</template>

<script>
import img from '../assets/sewage.jpg'
export default {
  data () {
    return {
      src: img, alt: 'manhole'
    }
  }
}
</script>
