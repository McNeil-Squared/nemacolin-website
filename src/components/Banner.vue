<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 md9)
      img(:src='src' :alt='alt')
    v-flex(xs12 md3)
      p Welcome to Nemacolin
</template>

<script>
export default {
  data() {
    return {
      src: require('../assets/school.png'),
      alt: 'Nemacolin Elementary'
    }
  }
}
</script>
