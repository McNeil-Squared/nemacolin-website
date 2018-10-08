<template lang="pug">
  v-toolbar(app)
    router-link(to='/')
      v-toolbar-side-icon
        v-avatar(size="48")
          img(:src='src' :alt='alt')
    v-toolbar-title Nemacolin Inc.
    v-spacer
    v-toolbar-items
      v-btn(color='primary' flat) Services
      v-btn(color='primary' flat) New Residents
      v-btn(color='primary' flat) Documents
      v-btn(color='primary' flat) FAQ&rsquo;s
      v-btn(color='primary' flat) Contact
      v-btn(color='primary' flat) Login
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
