<template lang="pug">
  v-toolbar(app)
    router-link(to='/')
      v-toolbar-side-icon
        v-avatar(size="48")
          img(:src='src' :alt='alt')
    v-toolbar-title Nemacolin Inc.
    v-spacer
    v-toolbar-items
      v-btn(flat) Services
      v-btn(flat) New Residents
      v-btn(flat) Documents
      v-btn(flat) FAQ&rsquo;s
      v-btn(flat) Contact
      v-btn(flat) Login
</template>

<script>
export default {
  data() {
    return {
      src: require('../../assets/sdlogo.png'),
      alt: 'Nemacolin Logo'
    }
  }
}
</script>
