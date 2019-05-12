<template lang="pug">
  div
    h3.headline.text-xs-center.mb-4.primary--text Important Information for Nemacolin Residents
    v-layout(row wrap)
      v-flex(xs12 md6)
        Requirements
      v-flex(xs12 md6)
        Policies
</template>

<script>
import Requirements from '../components/Requirements'
import Policies from '../components/Policies'

export default {
  components: { Requirements, Policies }
}
</script>
