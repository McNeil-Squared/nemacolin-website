<template lang="pug">
  v-toolbar(app)
    router-link(to='/')
      v-toolbar-side-icon
        v-avatar(size="48")
          img(:src='src' :alt='alt')
    v-toolbar-title Nemacolin Inc.
    v-spacer
    v-toolbar-items
      v-menu(open-on-hover offset-y)
        v-btn(slot="activator" color='primary' flat) Services
          v-icon.ml-2.mb-1(color='primary') fas fa-caret-down
        v-list
          v-list-tile(v-for="item in menuItems" :key="item.name" @click="" :to="item.to")
            v-list-tile-title {{ item.name }}
      v-btn(color='primary' flat) New Residents
      v-btn(color='primary' flat) Documents
      v-btn(color='primary' flat) FAQ&rsquo;s
      v-btn(color='primary' flat) Contact
      v-btn(color='accent' flat) Login
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: 'Sewage Service', to: '/sewage' },
        { name: 'Nemacolin Park', to: '/park' },
        { name: 'Trash Service', to: '/trash' },
        { name: 'Street Lights', to: '/lights' },
        { name: 'Fire Hydrants', to: '/hydrants' },
      ],
      src: require('../../assets/sdlogo.png'),
      alt: 'Nemacolin Logo'
    }
  }
}
</script>
