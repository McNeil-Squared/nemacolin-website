<template lang="pug">
  v-layout.text-xs-center(row wrap)
      v-flex(xs12 md6)
        v-btn(color="primary" :to="username") User Profile
      v-flex(xs12 md6)
        v-btn(color="primary" to="/files") Nemacolin Files
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    username () {
      if (this.user) { return `/profile/${this.user.username}` }
    },
    ...mapState(['user'])
  }
}
</script>
