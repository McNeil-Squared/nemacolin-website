<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md6)
      v-card.mr-2.v-card--modifications
      v-card-title(primary-title)
        h3.headline.mx-auto.primary--text Trash Service
      p.px-4.mt-4 Nemacolin, Inc. is a proud supporter of locally owned businesses.&nbsp;&nbsp;Our waste removal contractor is Greene Waste Services located n Greensboro, PA.&nbsp;&nbsp;Trash pickup is once per week on Fridays.&nbsp;&nbsp;During the Summer, Memorial Day until Labor Day, trash pickup is twice weekly on Tuesdays and Fridays.&nbsp;All households are required, by Cumberland Township ordinance, to have a covered trash receptacle.&nbsp;&nbsp;A copy of the ordinance can be downloaded below.
      a.ml-4(:href="ordinances") Cumberland Township Ordinances
      p.px-4.mt-4 For all questions about trash service, including questions about what items are accepted or missed pickup, please call Greene Waste Services at 724&dash;943&dash;4232.
    v-flex(xs12 md6)
      img(:src="src" :alt="alt" )
      p replace this pic with a pic of greene waste
</template>

<script>
import img from '../assets/trash.jpg'
import ord from '../assets/docs/ordinances.pdf'
export default {
  data () {
    return {
      src: img,
      alt: 'Trash Service',
      ordinances: ord
    }
  }
}
</script>
